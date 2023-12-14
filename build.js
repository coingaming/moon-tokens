const StyleDictionary = require("style-dictionary");
const fs = require("fs-extra");
const path = require("path");
const _ = require("style-dictionary/lib/utils/es6_");
const flutterFormats = require("./flutter/formats");
const flutterTransforms = require("./flutter/transforms");

const buildFolder = path.resolve(__dirname, "./build");

// Parser to remove junk data from Figma JSON
StyleDictionary.registerParser({
  pattern: /\.json$/,
  parse: ({ contents, filePath }) => {
    try {
      const object = JSON.parse(contents);
      const output = {};

      for (const key in object) {
        const subOutput = {};

        if (object.hasOwnProperty(key)) {
          for (const subKey in object[key]) {
            // Skip if the subKey does not contain a "/" as that denotes the
            // subKey belongs to a Figma collection
            if (!subKey.includes("/")) continue;

            // Modify the subKey to only keep the last segment of the path for name
            if (object[key].hasOwnProperty(subKey)) {
              const element = object[key][subKey];
              subOutput[`${subKey.split("/").pop()}`] = element;
            }
          }
        }
        output[key] = subOutput;
      }

      return output;
    } catch (error) {
      console.log(error);
    }
  },
});

// Flutter tooling
StyleDictionary.registerFormat({
  name: "flutter/colors.dart",
  formatter: flutterFormats["flutter/colors.dart"],
});

StyleDictionary.registerTransform({
  name: "name/flutter/field",
  type: "name",
  transformer: flutterTransforms["name/flutter/field"],
});

StyleDictionary.registerTransformGroup({
  name: "flutter/colors",
  transforms: ["attribute/cti", "name/flutter/field", "color/hex8flutter"],
});

function getStyleDictionaryConfig(brand) {
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
            type: "color",
            filter: {
              attributes: {
                category: "color",
              },
            },
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
  //"mode-1",
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
fs.emptyDirSync(buildFolder);

brands.map(function (brand) {
  platforms.map(function (platform) {
    const StyleDictionaryExtended = StyleDictionary.extend(
      getStyleDictionaryConfig(brand)
    );

    StyleDictionaryExtended.buildPlatform(platform);
  });
});
