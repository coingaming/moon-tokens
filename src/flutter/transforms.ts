import { Named, Transform } from "style-dictionary";
import _ from "style-dictionary/lib/utils/es6_";

const isNumber = (num: number) => /^-?[0-9]+$/.test(num + "");

// Transforms the name of the token to camelCase and removes the first segment.
// Also adds a "v" prefix if the name starts with a number.
export const nameFlutterField: Named<Transform> = {
  name: "name/flutter/field",
  type: "name",
  transformer: function (token, options) {
    const result = _.camelCase(
      [options.prefix].concat(token.path.slice(1, token.path.length)).join(" ")
    );

    return isNumber(result) ? "v" + result : result;
  },
};
