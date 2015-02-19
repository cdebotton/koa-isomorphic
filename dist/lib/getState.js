"use strict";

module.exports = function (router) {
  return new Promise(function (resolve, reject) {
    router.run(function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _args = args;
      var Handler = _args[0];
      var state = _args[1];


      var promiseArray = state.routes.filter(function (route) {
        return route.handler.fetchData;
      }).map(function (route) {
        return route.handler.fetchData(state);
      });

      Promise.all(promiseArray).then(function (data) {
        return resolve(args);
      })["catch"](reject);
    });
  });
};