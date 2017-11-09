"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("animated/lib/targets/react-dom"));

var _class, _temp, _initialiseProps, _class2, _temp2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _default = (_temp = _class =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(_default, _React$Component);

  function _default(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _initialiseProps.call(_this);

    _this.state = {
      ready: false
    };
    _this.layers = [];
    _this.height = 0;
    _this.scrollTop = 0;
    _this.offset = 0;
    _this.busy = false;
    return _this;
  }

  var _proto = _default.prototype;

  _proto.scrollTo = function scrollTo(offset) {
    this.scrollStop();
    this.offset = offset;
    var target = this.refs.container;
    this.animatedScroll = new _reactDom.default.Value(target.scrollTop);
    this.animatedScroll.addListener(function (_ref) {
      var value = _ref.value;
      return target.scrollTop = value;
    });
    this.props.effect(this.animatedScroll, offset * this.height).start();
  };

  _proto.getChildContext = function getChildContext() {
    return {
      parallax: this
    };
  };

  _proto.componentDidMount = function componentDidMount() {
    window.addEventListener('resize', this.updateRaf, false);
    this.update();
    this.setState({
      ready: true
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.updateRaf, false);
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this.update();
  };

  _proto.render = function render() {
    var _props = this.props,
        style = _props.style,
        innerStyle = _props.innerStyle,
        pages = _props.pages,
        className = _props.className,
        scrolling = _props.scrolling,
        children = _props.children;
    return _react.default.createElement("div", {
      ref: "container",
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
        WebkitTransform: 'translate(0, 0)',
        MsTransform: 'translate(0, 0)',
        transform: 'translate3d(0, 0, 0)'
      }, style),
      className: className
    }, this.state.ready && _react.default.createElement("div", {
      ref: "content",
      style: _extends({
        position: 'absolute',
        width: '100%',
        WebkitTransform: 'translate(0,0)',
        MsTransform: 'translate(0,0)',
        transform: 'translate3d(0, 0, 0)',
        overflow: 'hidden',
        height: this.height * pages
      }, innerStyle)
    }, children));
  };

  return _default;
}(_react.default.Component), Object.defineProperty(_class, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    pages: _propTypes.default.number.isRequired,
    effect: _propTypes.default.func,
    scrolling: _propTypes.default.bool
  }
}), Object.defineProperty(_class, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    effect: function effect(animation, toValue) {
      return _reactDom.default.spring(animation, {
        toValue: toValue
      });
    },
    scrolling: true
  }
}), Object.defineProperty(_class, "childContextTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    parallax: _propTypes.default.object
  }
}), Object.defineProperty(_class, "Layer", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: (_temp2 = _class2 =
  /*#__PURE__*/
  function (_React$Component2) {
    _inheritsLoose(value, _React$Component2);

    function value(props, context) {
      var _this2;

      _this2 = _React$Component2.call(this, props, context) || this;
      var parallax = context.parallax;
      var targetScroll = Math.floor(props.offset) * parallax.height;
      var offset = parallax.height * props.offset + targetScroll * props.speed;
      var toValue = parseFloat(-(parallax.scrollTop * props.speed) + offset);
      _this2.animatedTranslate = new _reactDom.default.Value(toValue);
      var height = parallax.height * props.factor;
      _this2.animatedHeight = new _reactDom.default.Value(height);
      return _this2;
    }

    var _proto2 = value.prototype;

    _proto2.componentDidMount = function componentDidMount() {
      var parent = this.context.parallax;

      if (parent) {
        parent.layers = parent.layers.concat(this);
        parent.update();
      }
    };

    _proto2.componentWillUnmount = function componentWillUnmount() {
      var _this3 = this;

      var parent = this.context.parallax;

      if (parent) {
        parent.layers = parent.layers.filter(function (layer) {
          return layer !== _this3;
        });
        parent.update();
      }
    };

    _proto2.setPosition = function setPosition(height, scrollTop, immediate) {
      if (immediate === void 0) {
        immediate = false;
      }

      var targetScroll = Math.floor(this.props.offset) * height;
      var offset = height * this.props.offset + targetScroll * this.props.speed;
      var toValue = parseFloat(-(scrollTop * this.props.speed) + offset);
      if (!immediate) this.context.parallax.props.effect(this.animatedTranslate, toValue).start();else this.animatedTranslate.setValue(toValue);
    };

    _proto2.setHeight = function setHeight(height, immediate) {
      if (immediate === void 0) {
        immediate = false;
      }

      var toValue = parseFloat(height * this.props.factor);
      if (!immediate) this.context.parallax.props.effect(this.animatedHeight, toValue).start();else this.animatedHeight.setValue(toValue);
    };

    _proto2.render = function render() {
      var _props2 = this.props,
          style = _props2.style,
          children = _props2.children,
          offset = _props2.offset,
          speed = _props2.speed,
          factor = _props2.factor,
          className = _props2.className,
          props = _objectWithoutProperties(_props2, ["style", "children", "offset", "speed", "factor", "className"]);

      var translate3d = this.animatedTranslate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0,0px,0', '0,1px,0']
      });
      return _react.default.createElement(_reactDom.default.div, _extends({}, props, {
        ref: "layer",
        className: className,
        style: _extends({
          position: 'absolute',
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform',
          width: '100%',
          height: this.animatedHeight,
          WebkitTransform: [{
            translate3d: translate3d
          }],
          MsTransform: [{
            translate3d: translate3d
          }],
          transform: [{
            translate3d: translate3d
          }]
        }, style)
      }), children);
    };

    return value;
  }(_react.default.Component), Object.defineProperty(_class2, "contextTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: {
      parallax: _propTypes.default.object
    }
  }), Object.defineProperty(_class2, "propTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: {
      factor: _propTypes.default.number,
      offset: _propTypes.default.number,
      speed: _propTypes.default.number
    }
  }), Object.defineProperty(_class2, "defaultProps", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: {
      factor: 1,
      offset: 0,
      speed: 0
    }
  }), _temp2)
}), _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  Object.defineProperty(this, "moveItems", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value() {
      _this4.layers.forEach(function (layer) {
        return layer.setPosition(_this4.height, _this4.scrollTop);
      });

      _this4.busy = false;
    }
  });
  Object.defineProperty(this, "scrollerRaf", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value() {
      return requestAnimationFrame(_this4.moveItems);
    }
  });
  Object.defineProperty(this, "onScroll", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value(event) {
      if (!_this4.busy) {
        _this4.busy = true;

        _this4.scrollerRaf();

        _this4.scrollTop = event.target.scrollTop;
      }
    }
  });
  Object.defineProperty(this, "update", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value() {
      if (!_this4.refs.container) return;
      _this4.height = _this4.refs.container.clientHeight;
      if (_this4.props.scrolling) _this4.scrollTop = _this4.refs.container.scrollTop;else _this4.refs.container.scrollTop = _this4.scrollTop = _this4.offset * _this4.height;
      if (_this4.refs.content) _this4.refs.content.style.height = _this4.height * _this4.props.pages + "px";

      _this4.layers.forEach(function (layer) {
        layer.setHeight(_this4.height, true);
        layer.setPosition(_this4.height, _this4.scrollTop, true);
      });
    }
  });
  Object.defineProperty(this, "updateRaf", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value() {
      requestAnimationFrame(_this4.update); // Some browsers don't fire on maximize

      setTimeout(_this4.update, 150);
    }
  });
  Object.defineProperty(this, "scrollStop", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value(event) {
      return _this4.animatedScroll && _this4.animatedScroll.stopAnimation();
    }
  });
}, _temp);

exports.default = _default;
