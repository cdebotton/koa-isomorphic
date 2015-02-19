import cheerio from "cheerio";
import serialize from "serialize-javascript";

const ENV = process.env.NODE_ENV || 'development';
const DEV = ENV === 'development';

export default ({ alt, markup }) => {
  return new Promise((resolve, reject) => {
    try {
      let $ = cheerio.load(markup);
      let snapshotData = serialize(alt.flush());
      let bundle = DEV ? 'http://localhost:9000/dist/bundle.js' : '/bundle.min.js';

      $('body').append(`<script id="flux-snapshot">var snapshot = ${snapshotData};</script>`);
      $('body').append(`<script src="${bundle}"></script>`);
      if (DEV) {
        $('body').append('<script src="http://localhost:35729/livereload.js?snipver=1"></script>');
      }

      resolve($.html());
    }
    catch (err) {
      reject(err);
    }
  });
};
