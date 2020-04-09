"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getNetworkObserver;

var _Observer = _interopRequireDefault(require("./Observer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GLOBAL_KEY = "$__network_observer__";

function getNetworkObserver(props) {
  if (!window[GLOBAL_KEY]) {
    window[GLOBAL_KEY] = new _Observer.default(props);
  }

  return window[GLOBAL_KEY];
}