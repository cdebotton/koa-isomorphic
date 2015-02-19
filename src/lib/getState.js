export default (router) => new Promise((resolve, reject) => {
  router.run((...args) => {
    let [Handler, state] = args;

    let promiseArray = state.routes
      .filter(route => route.handler.fetchData)
      .map(route => route.handler.fetchData(state));

    Promise.all(promiseArray)
      .then(data => resolve(args))
      .catch(reject);
  });
});
