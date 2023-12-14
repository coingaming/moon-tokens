const fs = require("fs");
const _template = require("lodash/template");
const {
  fileHeader,
  sortByReference,
  sortByName,
  createPropertyFormatter,
} = require("style-dictionary/lib/common/formatHelpers");

const supportedColorCategories = ["color"];

module.exports = {
  "flutter/colors.dart": function ({ dictionary, options, file }) {
    const template = _template(
      fs.readFileSync(__dirname + "/templates/colors.dart.template")
    );

    let allTokens;
    const { outputReferences } = options;
    const formatProperty = createPropertyFormatter({
      outputReferences,
      dictionary,
    });

    if (outputReferences) {
      allTokens = [...dictionary.allTokens].sort(sortByReference(dictionary));
    } else {
      allTokens = [...dictionary.allTokens].sort(sortByName);
    }

    return template({ allTokens, file, options, formatProperty, fileHeader });
  },
};

//_.upperFirst(toDartType(token));
