"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var cheerio = _interopRequire(require("cheerio"));

var serialize = _interopRequire(require("serialize-javascript"));

var ENV = process.env.NODE_ENV || "development";
var DEV = ENV === "development";

module.exports = function (_ref) {
  var alt = _ref.alt;
  var markup = _ref.markup;
  return new Promise(function (resolve, reject) {
    try {
      var $ = cheerio.load(markup);
      var snapshotData = serialize(alt.flush());
      var bundle = DEV ? "http://localhost:9000/dist/bundle.js" : "/bundle.min.js";

      $("body").append("<script id=\"flux-snapshot\">var snapshot = " + snapshotData + ";</script>");
      $("body").append("<script src=\"" + bundle + "\"></script>");
      if (DEV) {
        $("body").append("<script src=\"http://localhost:35729/livereload.js?snipver=1\"></script>");
      }

      resolve($.html());
    } catch (err) {
      reject(err);
    }
  });
};