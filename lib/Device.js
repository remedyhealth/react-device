'use strict';

exports.__esModule = true;
exports.PORTRAIT = exports.LANDSCAPE = exports.SIZE_UNKNOWN = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SIZE_UNKNOWN = exports.SIZE_UNKNOWN = -1;
var LANDSCAPE = exports.LANDSCAPE = 'landscape';
var PORTRAIT = exports.PORTRAIT = 'portrait';

/**
 *
 */

var Device = function (_Component) {
  _inherits(Device, _Component);

  _createClass(Device, null, [{
    key: '_buildDeviceInfo',
    value: function _buildDeviceInfo() {
      var windowDetails = {
        width: SIZE_UNKNOWN,
        height: SIZE_UNKNOWN,
        orientation: LANDSCAPE
      };

      if (global.window) {
        windowDetails.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        windowDetails.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        windowDetails.orientation = windowDetails.width > windowDetails.height ? LANDSCAPE : PORTRAIT;
      }

      return _extends({
        screen: windowDetails
      }, Device.details);
    }
  }, {
    key: '_onChange',
    value: function _onChange() {
      var deviceInfo = Device._buildDeviceInfo();
      Device._listeners.forEach(function (listener) {
        listener(deviceInfo);
      });
    }
  }]);

  function Device(props) {
    _classCallCheck(this, Device);

    var _this = _possibleConstructorReturn(this, (Device.__proto__ || Object.getPrototypeOf(Device)).call(this, props));

    Device.details = (0, _uaParserJs2.default)(props.userAgent);
    return _this;
  }

  _createClass(Device, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!Device._listeners.length) {
        Device._debouncedChange = (0, _debounce2.default)(Device._onChange, Device.DEBOUNCE_TIME);
        window.addEventListener('resize', Device._debouncedChange, true);
      }
      Device._listeners.push(this.props.onChange);
      Device._debouncedChange();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var idx = Device._listeners.indexOf(this.props.onChange);
      Device._listeners.splice(idx, 1);
      if (!Device._listeners.length) {
        window.removeEventListener('resize', Device._debouncedChange, true);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.onChange !== nextProps.onChange;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.onChange !== this.props.onChange) {
        var idx = Device._listeners.indexOf(this.props.onChange);
        Device._listeners.splice(idx, 1, nextProps.onChange);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Device;
}(_react.Component);

Device._listeners = [];
Device.DEBOUNCE_TIME = 100;
Device.details = {};


Device.propTypes = {
  onChange: _react.PropTypes.func.isRequired,
  userAgent: _react.PropTypes.string
};

exports.default = Device;