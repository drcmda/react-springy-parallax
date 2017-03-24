import React from 'react'
import Animated from 'animated/lib/targets/react-dom'

export default class extends React.Component {
    static propTypes = {
        pages: React.PropTypes.number.isRequired,
        effect: React.PropTypes.func,
        scrolling: React.PropTypes.bool
    }
    static defaultProps = {
        effect: (animation, toValue) => Animated.spring(animation, { toValue }),
        scrolling: true
    }
    static childContextTypes = { parallax: React.PropTypes.object }

    constructor(props) {
        super(props)
        this.state = { ready: false }
        this.layers = []
        this.height = 0
        this.scrollTop = 0
        this.offset = 0
        this.busy = false
    }

    moveItems = () => {
        this.layers.forEach(layer => layer.setPosition(this.height, this.scrollTop))
        this.busy = false
    }

    scrollerRaf = () => requestAnimationFrame(this.moveItems)

    onScroll = event => {
        if (!this.busy) {
            this.busy = true
            this.scrollerRaf()
            this.scrollTop = event.target.scrollTop
        }
    }

    update = () => {
        this.height = this.refs.container.clientHeight

        if (this.props.scrolling) this.scrollTop = this.refs.container.scrollTop
        else this.refs.container.scrollTop = (this.scrollTop = this.offset * this.height)

        if (this.refs.content) this.refs.content.style.height = `${this.height * this.props.pages}px`
        this.layers.forEach(layer => {
            layer.setHeight(this.height, true)
            layer.setPosition(this.height, this.scrollTop, true)
        })
    }

    updateRaf = () => {
        requestAnimationFrame(this.update)
        // Some browsers don't fire on maximize
        setTimeout(this.update, 150)
    }

    scrollStop = event => this.animatedScroll && this.animatedScroll.stopAnimation()

    scrollTo(offset) {
        this.scrollStop()
        this.offset = offset
        const target = this.refs.container
        this.animatedScroll = new Animated.Value(target.scrollTop)
        this.animatedScroll.addListener(({ value }) => target.scrollTop = value)
        this.props.effect(this.animatedScroll, offset * this.height).start()
    }

    getChildContext() {
        return { parallax: this }
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateRaf, false)
        this.update()
        this.setState({ ready: true })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateRaf, false)
    }

    componentDidUpdate() {
        this.update()
    }

    render() {
        const { style, innerStyle, pages, className, scrolling, children } = this.props
        return (
            <div
                ref="container"
                onScroll={this.onScroll}
                onWheel={scrolling && this.scrollStop}
                onTouchStart={scrolling && this.scrollStop}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    overflow: scrolling ? 'scroll' : 'hidden',
                    overflowX: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    transform: 'translate3d(0, 0, 0)',
                    ...style
                }}
                className={className}>

                {this.state.ready &&
                    <div
                        ref="content"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            transform: 'translate3d(0, 0, 0)',
                            overflow: 'hidden',
                            height: this.height * pages,
                            ...innerStyle
                        }}>
                        {children}
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
        static defaultProps = {
            factor: 1,
            offset: 0,
            speed: 0
        }

        constructor(props, context) {
            super(props, context)
            const parallax = context.parallax
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

        setPosition(height, scrollTop, immediate = false) {
            const targetScroll = Math.floor(this.props.offset) * height
            const offset = height * this.props.offset + targetScroll * this.props.speed
            const toValue = parseFloat(-(scrollTop * this.props.speed) + offset)
            if (!immediate) this.context.parallax.props.effect(this.animatedTranslate, toValue).start()
            else this.animatedTranslate.setValue(toValue)
        }

        setHeight(height, immediate = false) {
            const toValue = parseFloat(height * this.props.factor)
            if (!immediate) this.context.parallax.props.effect(this.animatedHeight, toValue).start()
            else this.animatedHeight.setValue(toValue)
        }

        render() {
            const { style, children, offset, speed, factor, ...props } = this.props
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
                    }}>
                    {children}
                </Animated.div>
            )
        }
    }
}
