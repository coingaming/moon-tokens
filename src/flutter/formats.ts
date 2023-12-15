import { formatHelpers, Named, Format } from "style-dictionary";
import { FormatterArguments } from "style-dictionary/types/Format";
import _ from "style-dictionary/lib/utils/es6_";
import fs from "fs-extra";
import _template from "lodash/template";

// Converts the class name to camelcase and adds a "b" prefix if the class name
// starts with a number
function correctClassName(name: string): string {
  const hasNumAtStart = (name: string) => /^\d/.test(name);
  const result = _.camelCase(name);

  return hasNumAtStart(result) ? "b" + result : result;
}

function whichTheme(name: string | undefined): string {
  const isLightTheme = name?.toLowerCase().includes("light");
  return isLightTheme ? "light" : "dark";
}

export const flutterColorsDart: Named<Format> = {
  name: "flutter/colors.dart",
  formatter: function ({
    dictionary,
    options,
    file,
  }: FormatterArguments): string {
    const template = _template(
      fs.readFileSync(__dirname + "/templates/colors.dart.template", "utf8")
    );

    let allTokens;
    const themeVariant = whichTheme(file.className);
    const { outputReferences } = options;

    const formatProperty = formatHelpers.createPropertyFormatter({
      outputReferences,
      dictionary,
      formatting: {
        separator: ": const",
        suffix: ",",
      },
    });

    if (outputReferences) {
      allTokens = [...dictionary.allTokens].sort(
        formatHelpers.sortByReference(dictionary)
      );
    } else {
      allTokens = [...dictionary.allTokens].sort(formatHelpers.sortByName);
    }

    const fileHeader = formatHelpers.fileHeader;

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
