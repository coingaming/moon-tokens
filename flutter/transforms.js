var Color = require("tinycolor2");

function isColor(token) {
  return token.attributes.category === "color";
}

function isSize(token) {
  return token.attributes.category === "size";
}

function getBasePxFontSize(options) {
  return (options && options.basePxFontSize) || 16;
}

module.exports = {
  /**
   * Transforms the value into a Flutter Color object using 8-digit hex with the alpha chanel on start
   *  ```js
   *  // Matches: token.attributes.category === 'color'
   *  // Returns:
   *  Color(0xFF00FF5F)
   *  ```
   *  @memberof Transforms
   *
   */
  "color/hex8flutter": {
    type: "value",
    matcher: isColor,
    transformer: function (token) {
      var str = Color(token.value).toHex8().toUpperCase();
      return `Color(0x${str.slice(6)}${str.slice(0, 6)})`;
    },
  },

  /**
   * Scales the number by 16 (or the value of 'basePxFontSize' on the platform in your config) to get to points for Flutter
   *
   * ```dart
   * // Matches: token.attributes.category === 'size'
   * // Returns: 16.00
   * ```
   *
   * @memberof Transforms
   */
  "size/flutter/remToDouble": {
    type: "value",
    matcher: isSize,
    transformer: function (token, options) {
      const baseFont = getBasePxFontSize(options);
      return (parseFloat(token.value, 10) * baseFont).toFixed(2);
    },
  },
};
