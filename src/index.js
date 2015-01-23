export default function(params) {
  const DEV = process.env.NODE_ENV === 'development';
  let {routes, ReactRouter, React} = params;
  var Routes;
  if (! DEV) Routes = require(routes);

  return function *(next) {
    if (DEV) Routes = require(routes);

    let {Handler, state} = yield getHandler(this, Routes, ReactRouter);
    let data = yield fetchData(state)
    let markup = React.renderToString(
      <Handler
        params={state.params}
        query={state.query} />
    );

    this.body = `<!doctype html>${markup}`;

    yield next;
  };
};


var getHandler = (app, Routes, ReactRouter) => {
  return new Promise((resolve, reject) => {
    let location = app.req.url;
    let Router = createRouter({reject, location, Routes, ReactRouter});

    resolveRoute(Router, app).then(({Handler, state}) => {
      resolve({Handler, state});
    });
  });
};

var createRouter = (params = {}) => {
  let {reject} = params;
  let {ReactRouter, Routes, location} = params;
  let Router = ReactRouter.create({
    routes: Routes,
    location: location,
    onAbort: (aborted) => {
      let {to, params, query} = aborted;
      let url = Router.makePath(to, params, query);

      reject(url);
    }
  });

  return Router;
};

var resolveRoute = (Router, app) => {
  return new Promise((resolve, reject) => {
    try {
      Router.run((Handler, state) => {
        resolve({Handler, state});
      });
    }
    catch (err) {
      reject(err);
    }
  }).catch(redirect => {
    app.redirect(redirect);
  });
};

var fetchData = (state = {}) => {
  let promiseArray = generatePromises(state);

  return Promise.all(promiseArray)
    .then(data => data.reduce((memo, item) => {
      return Object.assign(memo, item);
    }, {}));
};


var generatePromises = (state = {}) => {
  let {routes, params, query} = state;

  return routes.filter(route => route.handler.fetchData)
    .map(route => {
      return new Promise((resolve, reject) => {
        route.handler.fetchData(params, query)
          .then(resolve)
          .catch(reject);
      });
    });
};
