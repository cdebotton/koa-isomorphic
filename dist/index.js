"use strict";

let parent = module.parent;
try {
  var ReactRouter = parent.require("react-router");
} catch (err) {
  throw new Error("koa-isomorphic requires ReactRouter. Please run `npm install " + "-S react-router`.");
}
try {
  var React = parent.require("react");
} catch (err) {
  throw new Error("koa-isomorphic requires React. Please run `npm install " + "-S react`.");
}

module.exports = function (routes) {
  let DEV = process.env.NODE_ENV === "development";
  var Routes;

  if (!DEV) Routes = require(routes);

  return function* (next) {
    if (DEV) Routes = require(routes);

    var _ref = yield getHandler(this, Routes, ReactRouter);
    let Handler = _ref.Handler;
    let state = _ref.state;
    let data = yield fetchData(state);
    let markup = React.renderToString(React.createElement(Handler, {
      params: state.params,
      query: state.query }));

    this.body = "<!doctype html>" + markup;

    yield next;
  };
};




var getHandler = function (app, Routes, ReactRouter) {
  return new Promise(function (resolve, reject) {
    let location = app.req.url;
    let Router = createRouter({ reject: reject, location: location, Routes: Routes, ReactRouter: ReactRouter });

    resolveRoute(Router, app).then(function (_ref2) {
      var Handler = _ref2.Handler;
      var state = _ref2.state;
      resolve({ Handler: Handler, state: state });
    });
  });
};

var createRouter = function () {
  var params = arguments[0] === undefined ? {} : arguments[0];
  let reject = params.reject;
  let ReactRouter = params.ReactRouter;
  let Routes = params.Routes;
  let location = params.location;
  let Router = ReactRouter.create({
    routes: Routes,
    location: location,
    onAbort: function (aborted) {
      let to = aborted.to;
      let params = aborted.params;
      let query = aborted.query;
      let url = Router.makePath(to, params, query);

      reject(url);
    }
  });

  return Router;
};

var resolveRoute = function (Router, app) {
  return new Promise(function (resolve, reject) {
    try {
      Router.run(function (Handler, state) {
        resolve({ Handler: Handler, state: state });
      });
    } catch (err) {
      reject(err);
    }
  })["catch"](function (redirect) {
    app.redirect(redirect);
  });
};

var fetchData = function () {
  var state = arguments[0] === undefined ? {} : arguments[0];
  let promiseArray = generatePromises(state);

  return Promise.all(promiseArray).then(function (data) {
    return data.reduce(function (memo, item) {
      return Object.assign(memo, item);
    }, {});
  });
};


var generatePromises = function () {
  var state = arguments[0] === undefined ? {} : arguments[0];
  let routes = state.routes;
  let params = state.params;
  let query = state.query;


  return routes.filter(function (route) {
    return route.handler.fetchData;
  }).map(function (route) {
    return new Promise(function (resolve, reject) {
      route.handler.fetchData(params, query).then(resolve)["catch"](reject);
    });
  });
};