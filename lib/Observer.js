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
    _this.websocketRetryInterval = 5000;
    _this.onlineStatus = true;
    _this.socketCreator = null;
    _this.socketInst = null;

    if (props) {
      var pingUrl = props.pingUrl,
          checkInterval = props.checkInterval,
          socket_1 = props.socket;
      if (pingUrl) _this.pingUrl = pingUrl;
      if (checkInterval) _this.checkInterval = checkInterval;

      if (socket_1) {
        if (typeof socket_1 === "string") {
          _this.socketCreator = function () {
            return new WebSocket(socket_1);
          };
        } else {
          _this.socketCreator = socket_1;
        }
      }
    }

    _this.init();

    return _this;
  }
  /**
   * 通过 imgPing 的方式检查网络是否 ok
   */


  Observer.prototype.getNetworkStatus = function () {
    var _this = this;

    return new Promise(function (resolve, reject) {
      fetch(_this.pingUrl + "?t=" + Date.now()).then(function () {
        if (!_this.onlineStatus) {
          _this.onlineStatus = true;

          _this.emit("online");

          _this.establishSocketIfNeeded();
        }

        resolve(true);
      }).catch(function () {
        if (_this.onlineStatus) {
          _this.onlineStatus = false;

          _this.emit("offline");
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

  Observer.prototype.isSocketOk = function () {
    return this.socketInst && this.socketInst.readyState === this.socketInst.OPEN;
  };

  Observer.prototype.isSocketConnecting = function () {
    return this.socketInst && this.socketInst.readyState === this.socketInst.CONNECTING;
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

    if (this.socketCreator) {
      this.establishSocketIfNeeded();
    }
  };

  Observer.prototype.establishSocketIfNeeded = function () {
    var _this = this;

    if (this.isSocketOk() || this.isSocketConnecting()) {
      return;
    }

    if (this.socketCreator) {
      this.socketInst = this.socketCreator();

      this.socketInst.onclose = function () {
        _this.emit("close"); // 尝试重启


        setTimeout(function () {
          _this.establishSocketIfNeeded();
        }, _this.websocketRetryInterval);
      };

      this.socketInst.onerror = function () {
        _this.emit("error");
      };

      this.socketInst.onmessage = function (e) {
        var msg = e.data;

        try {
          msg = JSON.parse(msg);
        } catch (error) {}

        _this.emit("message", msg);
      };

      this.socketInst.onopen = function () {
        _this.emit("open");
      };
    }
  };

  return Observer;
}(_mmevents.default);

var _default = Observer;
exports.default = _default;