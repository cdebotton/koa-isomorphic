"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var inject = _interopRequire(require("./lib/inject"));

var getState = _interopRequire(require("./lib/getState"));

var createRouter = _interopRequire(require("./lib/createRouter"));

try {
  var React = module.parent.require("react");
  var ReactRouter = module.parent.require("react-router");
} catch (err) {
  throw err;
}

module.exports = function (_ref) {
  var alt = _ref.alt;
  var routes = _ref.routes;
  return function* (next) {
    yield next;

    var router = createRouter.call(this, ReactRouter, routes);
    var _ref2 = yield getState(router);
    var _ref22 = _slicedToArray(_ref2, 2);

    var Handler = _ref22[0];
    var state = _ref22[1];
    var markup = React.renderToString(React.createElement(Handler, state));
    var snapshot = yield inject({ alt: alt, markup: markup });

    this.body = "<!doctype html>" + snapshot;
  };
};