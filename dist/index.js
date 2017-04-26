'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class2, _temp;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('animated/lib/targets/react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

        _initialiseProps.call(_this);

        _this.state = { ready: false };
        _this.layers = [];
        _this.height = 0;
        _this.scrollTop = 0;
        _this.offset = 0;
        _this.busy = false;
        return _this;
    }

    _createClass(_class, [{
        key: 'scrollTo',
        value: function scrollTo(offset) {
            this.scrollStop();
            this.offset = offset;
            var target = this.refs.container;
            this.animatedScroll = new _reactDom2.default.Value(target.scrollTop);
            this.animatedScroll.addListener(function (_ref) {
                var value = _ref.value;
                return target.scrollTop = value;
            });
            this.props.effect(this.animatedScroll, offset * this.height).start();
        }
    }, {
        key: 'getChildContext',
        value: function getChildContext() {
            return { parallax: this };
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            window.addEventListener('resize', this.updateRaf, false);
            this.update();
            this.setState({ ready: true });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.updateRaf, false);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.update();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                style = _props.style,
                innerStyle = _props.innerStyle,
                pages = _props.pages,
                className = _props.className,
                scrolling = _props.scrolling,
                children = _props.children;

            return _react2.default.createElement(
                'div',
                {
                    ref: 'container',
                    onScroll: this.onScroll,
                    onWheel: scrolling && this.scrollStop,
                    onTouchStart: scrolling && this.scrollStop,
                    style: _extends({
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        overflow: scrolling ? 'scroll' : 'hidden',
                        overflowX: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        transform: 'translate3d(0, 0, 0)'
                    }, style),
                    className: className },
                this.state.ready && _react2.default.createElement(
                    'div',
                    {
                        ref: 'content',
                        style: _extends({
                            position: 'absolute',
                            width: '100%',
                            transform: 'translate3d(0, 0, 0)',
                            overflow: 'hidden',
                            height: this.height * pages
                        }, innerStyle) },
                    children
                )
            );
        }
    }]);

    return _class;
}(_react2.default.Component);

_class.propTypes = {
    pages: _propTypes2.default.number.isRequired,
    effect: _propTypes2.default.func,
    scrolling: _propTypes2.default.bool
};
_class.defaultProps = {
    effect: function effect(animation, toValue) {
        return _reactDom2.default.spring(animation, { toValue: toValue });
    },
    scrolling: true
};
_class.childContextTypes = { parallax: _propTypes2.default.object };
_class.Layer = (_temp = _class2 = function (_React$Component2) {
    _inherits(_class2, _React$Component2);

    function _class2(props, context) {
        _classCallCheck(this, _class2);

        var _this2 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props, context));

        var parallax = context.parallax;
        var targetScroll = Math.floor(props.offset) * parallax.height;
        var offset = parallax.height * props.offset + targetScroll * props.speed;
        var toValue = parseFloat(-(parallax.scrollTop * props.speed) + offset);
        _this2.animatedTranslate = new _reactDom2.default.Value(toValue);
        var height = parallax.height * props.factor;
        _this2.animatedHeight = new _reactDom2.default.Value(height);
        return _this2;
    }

    _createClass(_class2, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var parent = this.context.parallax;
            if (parent) {
                parent.layers = parent.layers.concat(this);
                parent.update();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var _this3 = this;

            var parent = this.context.parallax;
            if (parent) {
                parent.layers = parent.layers.filter(function (layer) {
                    return layer !== _this3;
                });
                parent.update();
            }
        }
    }, {
        key: 'setPosition',
        value: function setPosition(height, scrollTop) {
            var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var targetScroll = Math.floor(this.props.offset) * height;
            var offset = height * this.props.offset + targetScroll * this.props.speed;
            var toValue = parseFloat(-(scrollTop * this.props.speed) + offset);
            if (!immediate) this.context.parallax.props.effect(this.animatedTranslate, toValue).start();else this.animatedTranslate.setValue(toValue);
        }
    }, {
        key: 'setHeight',
        value: function setHeight(height) {
            var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var toValue = parseFloat(height * this.props.factor);
            if (!immediate) this.context.parallax.props.effect(this.animatedHeight, toValue).start();else this.animatedHeight.setValue(toValue);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                style = _props2.style,
                children = _props2.children,
                offset = _props2.offset,
                speed = _props2.speed,
                factor = _props2.factor,
                className = _props2.className,
                props = _objectWithoutProperties(_props2, ['style', 'children', 'offset', 'speed', 'factor', 'className']);

            return _react2.default.createElement(
                _reactDom2.default.div,
                _extends({}, props, {
                    ref: 'layer',
                    className: className,
                    style: _extends({
                        position: 'absolute',
                        backgroundSize: 'auto',
                        backgroundRepeat: 'no-repeat',
                        willChange: 'transform',
                        width: '100%',
                        height: this.animatedHeight,
                        transform: [{
                            translate3d: this.animatedTranslate.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0,0px,0', '0,1px,0']
                            })
                        }]
                    }, style) }),
                children
            );
        }
    }]);

    return _class2;
}(_react2.default.Component), _class2.contextTypes = { parallax: _propTypes2.default.object }, _class2.propTypes = {
    factor: _propTypes2.default.number,
    offset: _propTypes2.default.number,
    speed: _propTypes2.default.number
}, _class2.defaultProps = {
    factor: 1,
    offset: 0,
    speed: 0
}, _temp);

var _initialiseProps = function _initialiseProps() {
    var _this4 = this;

    this.moveItems = function () {
        _this4.layers.forEach(function (layer) {
            return layer.setPosition(_this4.height, _this4.scrollTop);
        });
        _this4.busy = false;
    };

    this.scrollerRaf = function () {
        return requestAnimationFrame(_this4.moveItems);
    };

    this.onScroll = function (event) {
        if (!_this4.busy) {
            _this4.busy = true;
            _this4.scrollerRaf();
            _this4.scrollTop = event.target.scrollTop;
        }
    };

    this.update = function () {
        if (!_this4.refs.container) return;
        _this4.height = _this4.refs.container.clientHeight;

        if (_this4.props.scrolling) _this4.scrollTop = _this4.refs.container.scrollTop;else _this4.refs.container.scrollTop = _this4.scrollTop = _this4.offset * _this4.height;

        if (_this4.refs.content) _this4.refs.content.style.height = _this4.height * _this4.props.pages + 'px';
        _this4.layers.forEach(function (layer) {
            layer.setHeight(_this4.height, true);
            layer.setPosition(_this4.height, _this4.scrollTop, true);
        });
    };

    this.updateRaf = function () {
        requestAnimationFrame(_this4.update);
        // Some browsers don't fire on maximize
        setTimeout(_this4.update, 150);
    };

    this.scrollStop = function (event) {
        return _this4.animatedScroll && _this4.animatedScroll.stopAnimation();
    };
};

exports.default = _class;
