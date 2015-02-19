import inject from "./lib/inject";
import getState from "./lib/getState";
import createRouter from "./lib/createRouter";

try {
  var React = module.parent.require('react');
  var ReactRouter = module.parent.require('react-router');
}
catch (err) {
  throw err;
}

export default ({alt, routes}) => {
  return function *(next) {
    yield next;

    let router = createRouter.call(this, ReactRouter, routes);
    let [Handler, state] = yield getState(router);
    state.env = process.env.NODE_ENV || 'development';

    let markup = React.renderToString(<Handler {...state} />);
    let snapshot = yield inject({ alt, markup });

    this.body = `<!doctype html>${snapshot}`;
  };
};
