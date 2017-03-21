import React from 'react';
import Animated from 'animated/lib/targets/react-dom';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = { ready: false };
        this.layers = [];
        this.height = 0;
        this.scrollTop = 0;
        this.busy = false;

        this.moveItems = () => {
            this.layers.forEach(layer => layer.move(this.height, this.scrollTop, this.props.pages));
            this.busy = false;
        };

        this.scrollerRaf = () => requestAnimationFrame(this.moveItems);

        this.onWheel = event => this.animatedScroll && this.animatedScroll.stopAnimation();

        this.onScroll = event => {
            if (!this.busy) {
                this.busy = true;
                this.scrollerRaf();
                this.scrollTop = event.target.scrollTop;
            }
        };

        this.onResize = () => {
            this.scrollTop = this.refs.container.scrollTop;
            this.height = this.refs.container.clientHeight;
            if (this.refs.content) this.refs.content.style.height = `${this.height * this.props.pages}px`;
            this.layers.forEach(layer => layer.height(this.height));
            this.moveItems();
        };
    }

    scrollTo(offset) {
        const target = this.refs.container;
        this.animatedScroll && this.animatedScroll.stopAnimation();
        this.animatedScroll = new Animated.Value(target.scrollTop);
        this.animatedScroll.addListener(({ value }) => target.scrollTop = value);
        Animated.spring(this.animatedScroll, { toValue: offset * this.height }).start();
    }

    componentDidUpdate() {
        this.layers = Object.keys(this.refs).filter(key => this.refs[key].move).map(key => this.refs[key]);
        this.onResize();
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize, false);
        this.componentDidUpdate();
        this.setState({ ready: true });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize, false);
    }

    render() {
        this.layers = React.Children.map(this.props.children, (child, index) =>
            React.cloneElement(child, { ...child.props, ref: `child-${index}`, container: this }));
        return (
            <div
                ref="container"
                onScroll={this.onScroll}
                onWheel={this.onWheel}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    overflow: 'scroll',
                    overflowX: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    transform: 'translate3d(0, 0, 0)',
                    ...this.props.style
                }}
                className={this.props.className}>

                {this.state.ready &&
                    <div
                        ref="content"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            transform: 'translate3d(0, 0, 0)',
                            overflow: 'hidden',
                            height: this.height * this.props.pages,
                            ...this.props.innerStyle
                        }}>
                        {this.layers}
                    </div>}

            </div>
        );
    }

    static Layer = class extends React.Component {
        constructor(props) {
            super(props);
            const targetScroll = Math.floor(props.offset) * props.container.height;
            const offset = props.container.height * props.offset + targetScroll * props.speed;
            const toValue = parseFloat(-(props.container.scrollTop * props.speed) + offset);
            this.animTranslate = new Animated.Value(toValue);
            const height = props.container.height * props.factor;
            this.animHeight = new Animated.Value(height);
        }

        static propTypes = {
            factor: React.PropTypes.number,
            offset: React.PropTypes.number,
            stretch: React.PropTypes.number
        };
        static defaultProps = { factor: 1, offset: 0, stretch: 1 };

        move(height, scrollTop, pages) {
            const targetScroll = Math.floor(this.props.offset) * height;
            const offset = height * this.props.offset + targetScroll * this.props.speed;
            const toValue = parseFloat(-(scrollTop * this.props.speed) + offset);
            Animated.spring(this.animTranslate, { toValue }).start();
        }

        height(height) {
            const toValue = parseFloat(height * this.props.factor);
            Animated.spring(this.animHeight, { toValue }).start();
        }

        render() {
            let { style, className, children, offset, speed, factor, container, stretch, ...props } = this.props;

            return (
                <Animated.div
                    {...props}
                    ref="layer"
                    style={{
                        position: 'absolute',
                        backgroundSize: 'auto',
                        backgroundRepeat: 'no-repeat',
                        willChange: 'transform',
                        width: '100%',
                        height: this.animHeight,
                        transform: [
                            {
                                translate3d: this.animTranslate.interpolate({
                                    inputRange: [0, 100000],
                                    outputRange: ['0,0px,0', '0,100000px,0']
                                })
                            }
                        ],
                        ...style
                    }}
                    className={className}>
                    {children}
                </Animated.div>
            );
        }
    };
}
