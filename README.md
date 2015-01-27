# koa-isomorphic

A simple, lightweight isomorphic React plugin for koa. Simply `use` it and point it to your routes. React and ReactRouter must be installed in your module for koa-isomorphic to work.

```js
var path = require('path');
var app = require('koa')();
var isomorphic = require('koa-isomorphic');
var port = process.env.NODE_ENV || 3000;


app.use(isomorphic(path.join(__dirname, 'src', 'routes')));

app.listen(port, function(err) {
  if (err) throw err;
  console.log('Listening at http://localhost:%d.', port);
});
```


## requirements
1. React `^0.12.2`
2. ReactRouter `^0.11.6`
3. koajs `^0.15.0`
4. nodejs `^0.11.14` || iojs `1.0.0`
