const fs = require("fs");
const _template = require("lodash/template");
const _ = require("style-dictionary/lib/utils/es6_");
const {
  fileHeader,
  sortByReference,
  sortByName,
  createPropertyFormatter,
} = require("style-dictionary/lib/common/formatHelpers");

function correctClassName(name) {
  const hasNumAtStart = (name) => /^\d/.test(name);
  const result = _.camelCase(name);

  return hasNumAtStart(result) ? "b" + result : result;
}

function whichTheme(name) {
  const isLightTheme = name.toLowerCase().includes("light");
  return isLightTheme ? "light" : "dark";
}

module.exports = {
  "flutter/colors.dart": function ({ dictionary, options, file }) {
    const template = _template(
      fs.readFileSync(__dirname + "/templates/colors.dart.template")
    );

    let allTokens;
    const themeVariant = whichTheme(file.className);
    const { outputReferences } = options;
    const formatProperty = createPropertyFormatter({
      outputReferences,
      dictionary,
      formatting: {
        separator: ":",
        suffix: ",",
      },
    });

    if (outputReferences) {
      allTokens = [...dictionary.allTokens].sort(sortByReference(dictionary));
    } else {
      allTokens = [...dictionary.allTokens].sort(sortByName);
    }

    return template({
      allTokens,
      file,
      options,
      formatProperty,
      correctClassName,
      fileHeader,
      themeVariant,
    });
  },
};

//_.upperFirst(toDartType(token));
