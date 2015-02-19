export default function (ReactRouter, routes) {
  let { url } = this.req;

  return ReactRouter.create({
    location: url,
    routes: routes,
    onAbort(aborted) {
      let { to, params, query } = aborted;
      let url = ReactRouter.makePath(to, params, query);

      this.redirect(url);
    }
  });
}
