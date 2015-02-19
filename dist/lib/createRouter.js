"use strict";

module.exports = function (ReactRouter, routes) {
  var url = this.req.url;


  return ReactRouter.create({
    location: url,
    routes: routes,
    onAbort: function onAbort(aborted) {
      var to = aborted.to;
      var params = aborted.params;
      var query = aborted.query;
      var url = ReactRouter.makePath(to, params, query);

      this.redirect(url);
    }
  });
};