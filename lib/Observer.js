"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var tslib_1 = _interopRequireWildcard(require("tslib"));

var _mmevents = _interopRequireDefault(require("mmevents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Observer =
/** @class */
function (_super) {
  tslib_1.__extends(Observer, _super);

  function Observer(props) {
    var _this = _super.call(this) || this;

    _this.pingUrl = "https://static.yximgs.com/udata/pkg/IS-DOCS-MD/ping.gif";
    _this.checkInterval = 10000;
    _this.onlineStatus = true;
    if (props && props.pingUrl) _this.pingUrl = props.pingUrl;
    if (props && props.checkInterval) _this.checkInterval = props.checkInterval;

    _this.init();

    return _this;
  }
  /**
   * 通过 imgPing 的方式检查网络是否 ok
   */


  Observer.prototype.getNetworkStatus = function () {
    var _this = this;

    return new Promise(function (resolve, reject) {
      fetch(_this.pingUrl).then(function () {
        if (!_this.onlineStatus) {
          _this.onlineStatus = true;

          _this.emit("change", true);
        }

        resolve(true);
      }).catch(function () {
        if (_this.onlineStatus) {
          _this.onlineStatus = false;

          _this.emit("change", false);
        }

        resolve(false);
      });
    });
  };
  /**
   * 获取当前最新维护的网络状态
   */


  Observer.prototype.isOnline = function () {
    return this.onlineStatus;
  };

  Observer.prototype.init = function () {
    var _this = this;

    window.addEventListener("online", function () {
      _this.getNetworkStatus();
    });
    window.addEventListener("offline", function () {
      _this.getNetworkStatus();
    });
    this.getNetworkStatus();
    setInterval(function () {
      _this.getNetworkStatus();
    }, this.checkInterval);
  };

  return Observer;
}(_mmevents.default);

var _default = Observer;
exports.default = _default;