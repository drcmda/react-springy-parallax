import React from 'react'
import Animated from 'animated/lib/targets/react-dom'

export default class extends React.Component {
    static propTypes = { pages: React.PropTypes.number.isRequired }
    static childContextTypes = { parallax: React.PropTypes.object }

    constructor(props) {
        super(props)
        this.state = { ready: false }
        this.layers = []
        this.height = 0
        this.scrollTop = 0
        this.busy = false
    }

    moveItems = () => {
        this.layers.forEach(layer => layer.setPosition(this.height, this.scrollTop))
        this.busy = false
    }

    scrollerRaf = () => requestAnimationFrame(this.moveItems)

    onWheel = event => this.animatedScroll && this.animatedScroll.stopAnimation()

    onScroll = event => {
        if (!this.busy) {
            this.busy = true
            this.scrollerRaf()
            this.scrollTop = event.target.scrollTop
        }
    }

    update = () => {
        this.scrollTop = this.refs.container.scrollTop
        this.height = this.refs.container.clientHeight
        if (this.refs.content) this.refs.content.style.height = `${this.height * this.props.pages}px`
        this.layers.forEach(layer => layer.setHeight(this.height))
        this.moveItems()
    }

    scrollTo(offset) {
        const target = this.refs.container
        this.animatedScroll && this.animatedScroll.stopAnimation()
        this.animatedScroll = new Animated.Value(target.scrollTop)
        this.animatedScroll.addListener(({ value }) => target.scrollTop = value)
        Animated.spring(this.animatedScroll, { toValue: offset * this.height }).start()
    }

    getChildContext() {
        return { parallax: this }
    }

    componentDidMount() {
        window.addEventListener('resize', this.update, false)
        this.update()
        this.setState({ ready: true })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.update, false)
    }

    componentDidUpdate() {
        this.update()
    }

    render() {
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
                        {this.props.children}
                    </div>}

            </div>
        )
    }

    static Layer = class extends React.Component {
        static contextTypes = { parallax: React.PropTypes.object }
        static propTypes = {
            factor: React.PropTypes.number,
            offset: React.PropTypes.number,
            speed: React.PropTypes.number
        }
        static defaultProps = { factor: 1, offset: 0, speed: 0 }

        constructor(props, context) {
            super(props, context)
            const parallax = context.parallax;
            const targetScroll = Math.floor(props.offset) * parallax.height
            const offset = parallax.height * props.offset + targetScroll * props.speed
            const toValue = parseFloat(-(parallax.scrollTop * props.speed) + offset)
            this.animatedTranslate = new Animated.Value(toValue)
            const height = parallax.height * props.factor
            this.animatedHeight = new Animated.Value(height)
        }

        componentDidMount() {
            const parent = this.context.parallax
            parent.layers = parent.layers.concat(this)
            parent.update()
        }

        componentWillUnmount() {
            const parent = this.context.parallax
            parent.layers = parent.layers.filter(layer => layer !== this)
            parent.update()
        }

        setPosition(height, scrollTop) {
            const targetScroll = Math.floor(this.props.offset) * height
            const offset = height * this.props.offset + targetScroll * this.props.speed
            const toValue = parseFloat(-(scrollTop * this.props.speed) + offset)
            Animated.spring(this.animatedTranslate, { toValue }).start()
        }

        setHeight(height) {
            const toValue = parseFloat(height * this.props.factor)
            Animated.spring(this.animatedHeight, { toValue }).start()
        }

        render() {
            const { style, className, children, offset, speed, factor, container, ...props } = this.props
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
                        height: this.animatedHeight,
                        transform: [
                            {
                                translate3d: this.animatedTranslate.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0,0px,0', '0,1px,0']
                                })
                            }
                        ],
                        ...style
                    }}
                    className={className}>
                    {children}
                </Animated.div>
            )
        }
    }
}
