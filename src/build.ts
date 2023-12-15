import StyleDictionary, { Config } from "style-dictionary";
import _ from "style-dictionary/lib/utils/es6_";
import fs from "fs-extra";
import path from "path";
import { figmaVariablesSanitizer } from "./shared/parsers";
import { flutterColorsDart } from "./flutter/formats";
import { nameFlutterField } from "./flutter/transforms";

// Shared parts
StyleDictionary.registerParser(figmaVariablesSanitizer);

// Flutter parts
StyleDictionary.registerFormat(flutterColorsDart);
StyleDictionary.registerTransform(nameFlutterField);
StyleDictionary.registerTransformGroup({
  name: "flutter/colors",
  transforms: ["attribute/cti", "name/flutter/field", "color/hex8flutter"],
});

function getStyleDictionaryConfig(brand: string): Config {
  return {
    source: [`tokens/brands/${brand}/*.json`],
    platforms: {
      /* web: {
        transformGroup: "web",
        buildPath: `build/web/${brand}/`,
        files: [
          {
            destination: "tokens.scss",
            format: "scss/variables",
          },
        ],
      }, */
      flutter: {
        transformGroup: "flutter/colors",
        buildPath: `build/flutter/${brand}/`,
        files: [
          {
            destination: `${_.snakeCase(brand)}_colors.dart`,
            format: "flutter/colors.dart",
            className: `${brand}Colors`,
            filter: {
              attributes: {
                category: "color",
              },
            },
          },
        ],
      },
    },
  };
}

// Listing the brands explicitly as there seem to be junk collections in the data
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
  //"mode-1", // This holds all the non-color tokens
  "partners",
  "pay.io-dark",
  "pay.io-light",
  "sb-dark",
  "sb-light",
  "ta-mini-betting",
  "tradeart",
];

const platforms = [/* "web", */ "flutter"];

// Clear the build folder before building new values
fs.emptyDirSync(path.resolve(__dirname, "./build"));

brands.map(function (brand) {
  platforms.map(function (platform) {
    const StyleDictionaryExtended = StyleDictionary.extend(
      getStyleDictionaryConfig(brand)
    );

    StyleDictionaryExtended.buildPlatform(platform);
  });
});
