const StyleDictionary = require("style-dictionary");
const fs = require("fs");
const path = require("path");
const flutterFormats = require("./flutter/formats");
const flutterTransforms = require("./flutter/transforms");

StyleDictionary.registerFilter({
  name: "removeNonBrandColors",
  matcher: function (token) {
    return token.category !== "color" && token.name.includes("brand");
  },
});

StyleDictionary.registerFormat({
  name: "flutter/colors.dart",
  formatter: flutterFormats["flutter/colors.dart"],
});

StyleDictionary.registerTransformGroup({
  name: "figma-flutter",
  transforms: [
    "attribute/cti",
    //"name/cti/camel",
    ...Object.getOwnPropertyNames(flutterTransforms),
  ],
});

/**
 * @see - https://amzn.github.io/style-dictionary/#/config?id=platform
 */
function getStyleDictionaryConfig(brand) {
  return {
    source: [`tokens/brands/${brand}/*.json`, "tokens/globals/**/*.json"],
    platforms: {
      /**
       * Available platforms: https://amzn.github.io/style-dictionary/#/config?id=platform
       */
      web: {
        transformGroup: "web",
        buildPath: `build/web/${brand}/`,
        files: [
          {
            destination: "tokens.scss",
            format: "scss/variables",
          },
        ],
      },
      flutter: {
        transformGroup: "figma-flutter",
        buildPath: `build/flutter/${brand}/`,
        files: [
          {
            destination: `${brand}Colors.dart`,
            format: "flutter/colors.dart",
            className: `${brand}Colors`,
            type: "color",
            filter: "removeNonBrandColors",
          },
          /* {
            destination: "style_dictionary_sizes.dart",
            format: "flutter/class.dart",
            className: "StyleDictionarySize",
            type: "float",
            filter: {
              attributes: {
                category: "size",
              },
            },
          }, */
        ],
      },
    },
  };
}

/**
 * Define the brands you want to build.
 * These should match the names of your Figma modes.
 */
const brands = [
  "8io-dark",
  "8io-light",
  "bc-dark",
  "bc-light",
  "bombay-wallet-dark",
  "bombay-wallet-light",
  "empire-dark",
  "empire-light",
  "hub88",
  "mds-dark",
  "mds-light",
  "mode-1",
  "partners",
  "pay.io-dark",
  "pay.io-light",
  "sb-dark",
  "sb-light",
  "ta-mini-betting",
  "tradeart",
];

/**
 * Define the platforms you want to build.
 */
const platforms = ["web", "flutter"];

/**
 * Build the tokens for each brand.
 * {@see - Example based on https://github.com/amzn/style-dictionary/tree/main/examples/advanced/multi-brand-multi-platform}
 */
brands.map(function (brand) {
  platforms.map(function (platform) {
    const StyleDictionaryExtended = StyleDictionary.extend(
      getStyleDictionaryConfig(brand)
    );

    StyleDictionaryExtended.buildPlatform(platform);
  });
});
