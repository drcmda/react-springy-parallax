"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("animated/lib/targets/react-dom"));

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var _default =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(_default, _React$Component);

  function _default(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _initialiseProps.call(_assertThisInitialized(_this));

    _this.state = {
      ready: false
    };
    _this.layers = [];
    _this.space = 0;
    _this.current = 0;
    _this.offset = 0;
    _this.busy = false;
    return _this;
  }

  var _proto = _default.prototype;

  _proto.scrollTo = function scrollTo(offset) {
    var _props = this.props,
        horizontal = _props.horizontal,
        effect = _props.effect;
    this.scrollStop();
    this.offset = offset;
    var target = this.refs.container;
    this.animatedScroll = new _reactDom.default.Value(target[horizontal ? 'scrollLeft' : 'scrollTop']);
    this.animatedScroll.addListener(function (_ref) {
      var value = _ref.value;
      return target[horizontal ? 'scrollLeft' : 'scrollTop'] = value;
    });
    effect(this.animatedScroll, offset * this.space).start();
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
    var _objectSpread2;

    var _props2 = this.props,
        style = _props2.style,
        innerStyle = _props2.innerStyle,
        pages = _props2.pages,
        className = _props2.className,
        scrolling = _props2.scrolling,
        children = _props2.children,
        horizontal = _props2.horizontal;
    var overflow = scrolling ? 'scroll' : 'hidden';
    return _react.default.createElement("div", {
      ref: "container",
      onScroll: this.onScroll,
      onWheel: scrolling ? this.scrollStop : null,
      onTouchStart: scrolling ? this.scrollStop : null,
      style: _objectSpread({
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: overflow,
        overflowY: horizontal ? 'hidden' : overflow,
        overflowX: horizontal ? overflow : 'hidden',
        WebkitOverflowScrolling: 'touch',
        WebkitTransform: 'translate(0,0)',
        MsTransform: 'translate(0,0)',
        transform: 'translate3d(0,0,0)'
      }, style),
      className: className
    }, this.state.ready && _react.default.createElement("div", {
      ref: "content",
      style: _objectSpread((_objectSpread2 = {
        position: 'absolute'
      }, _objectSpread2[horizontal ? 'height' : 'width'] = '100%', _objectSpread2.WebkitTransform = 'translate(0,0)', _objectSpread2.MsTransform = 'translate(0,0)', _objectSpread2.transform = 'translate3d(0,0,0)', _objectSpread2.overflow = 'hidden', _objectSpread2[horizontal ? 'width' : 'height'] = this.space * pages, _objectSpread2), innerStyle)
    }, children));
  };

  return _default;
}(_react.default.Component);

exports.default = _default;
Object.defineProperty(_default, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    pages: _propTypes.default.number.isRequired,
    effect: _propTypes.default.func,
    scrolling: _propTypes.default.bool,
    horizontal: _propTypes.default.bool
  }
});
Object.defineProperty(_default, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    effect: function effect(animation, toValue) {
      return _reactDom.default.spring(animation, {
        toValue: toValue
      });
    },
    scrolling: true,
    horizontal: false
  }
});
Object.defineProperty(_default, "childContextTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    parallax: _propTypes.default.object
  }
});
Object.defineProperty(_default, "Layer", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: (_temp = _class =
  /*#__PURE__*/
  function (_React$Component2) {
    _inheritsLoose(value, _React$Component2);

    function value(props, context) {
      var _this2;

      _this2 = _React$Component2.call(this, props, context) || this;
      var parallax = context.parallax;
      var targetScroll = Math.floor(props.offset) * parallax.space;
      var offset = parallax.space * props.offset + targetScroll * props.speed;
      var toValue = parseFloat(-(parallax.current * props.speed) + offset);
      _this2.animatedTranslate = new _reactDom.default.Value(toValue);
      _this2.animatedSpace = new _reactDom.default.Value(parallax.space * props.factor);
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
      if (!immediate) this.context.parallax.props.effect(this.animatedSpace, toValue).start();else this.animatedSpace.setValue(toValue);
    };

    _proto2.render = function render() {
      var _objectSpread3;

      var _props3 = this.props,
          style = _props3.style,
          children = _props3.children,
          offset = _props3.offset,
          speed = _props3.speed,
          factor = _props3.factor,
          className = _props3.className,
          props = _objectWithoutProperties(_props3, ["style", "children", "offset", "speed", "factor", "className"]);

      var horizontal = this.context.parallax.props.horizontal;
      var translate3d = this.animatedTranslate.interpolate({
        inputRange: [0, 1],
        outputRange: horizontal ? ['0px,0,0', '1px,0,0'] : ['0,0px,0', '0,1px,0']
      });
      return _react.default.createElement(_reactDom.default.div, _extends({}, props, {
        ref: "layer",
        className: className,
        style: _objectSpread((_objectSpread3 = {
          position: 'absolute',
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform'
        }, _objectSpread3[horizontal ? 'height' : 'width'] = '100%', _objectSpread3[horizontal ? 'width' : 'height'] = this.animatedSpace, _objectSpread3.WebkitTransform = [{
          translate3d: translate3d
        }], _objectSpread3.MsTransform = [{
          translate3d: translate3d
        }], _objectSpread3.transform = [{
          translate3d: translate3d
        }], _objectSpread3), style)
      }), children);
    };

    return value;
  }(_react.default.Component), Object.defineProperty(_class, "contextTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: {
      parallax: _propTypes.default.object
    }
  }), Object.defineProperty(_class, "propTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: {
      factor: _propTypes.default.number,
      offset: _propTypes.default.number,
      speed: _propTypes.default.number
    }
  }), Object.defineProperty(_class, "defaultProps", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: {
      factor: 1,
      offset: 0,
      speed: 0
    }
  }), _temp)
});

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  Object.defineProperty(this, "moveItems", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value() {
      _this4.layers.forEach(function (layer) {
        return layer.setPosition(_this4.space, _this4.current);
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
      var horizontal = _this4.props.horizontal;

      if (!_this4.busy) {
        _this4.busy = true;

        _this4.scrollerRaf();

        _this4.current = event.target[horizontal ? 'scrollLeft' : 'scrollTop'];
      }
    }
  });
  Object.defineProperty(this, "update", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value() {
      var _this4$props = _this4.props,
          scrolling = _this4$props.scrolling,
          horizontal = _this4$props.horizontal;
      if (!_this4.refs.container) return;
      _this4.space = _this4.refs.container[horizontal ? 'clientWidth' : 'clientHeight'];
      if (scrolling) _this4.current = _this4.refs.container[horizontal ? 'scrollLeft' : 'scrollTop'];else _this4.refs.container[horizontal ? 'scrollLeft' : 'scrollTop'] = _this4.current = _this4.offset * _this4.space;
      if (_this4.refs.content) _this4.refs.content.style[horizontal ? 'width' : 'height'] = _this4.space * _this4.props.pages + "px";

      _this4.layers.forEach(function (layer) {
        layer.setHeight(_this4.space, true);
        layer.setPosition(_this4.space, _this4.current, true);
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
};
