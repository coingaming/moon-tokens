const _ = require("style-dictionary/lib/utils/es6_");

const isInteger = (num) => /^-?[0-9]+$/.test(num + "");

module.exports = {
  "name/flutter/field": function (token, options) {
    const result = _.camelCase(
      [options.prefix].concat(token.path.slice(1, token.path.length)).join(" ")
    );

    return isInteger(result) ? "v" + result : result;
  },
};
