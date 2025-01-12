var loaderUtils = require("loader-utils");
// lqip: https://github.com/zouhir/lqip
var lqip = require("lqip");

module.exports = function (contentBuffer) {
  this.cacheable && this.cacheable();
  var callback = this.async();

  // user options
  var config = loaderUtils.getOptions(this) || {};

  config.palette = "palette" in config ? config.palette : false;
  config.size = "size" in config ? config.size : 10;

  // promise array in case users want both
  // base64 & color palettes generated
  // that means we have 2 promises to resolve
  var outputPromises = [];
  var data = {"buffer": contentBuffer, "size": config.size}
  outputPromises.push(lqip.convert(data));

  // final step, resolving all the promises we got so far
  Promise.all(outputPromises)
    .then(data => {
      if (data) {
        if (data[0]) {
          callback(null, data[0]);
        } else {
          callback(new Error("[lqip-loader] No data received from base64/palette promise"), null);
        }
      } else {
        callback(new Error("[lqip-loader] No data received from base64/palette promise"), null);
      }
    })
    .catch(error => {
      console.error(error);
      callback(error, null);
    });
};

module.exports.raw = true;
