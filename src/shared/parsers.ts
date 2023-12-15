import { DesignTokens, Named, Parser } from "style-dictionary";
import _ from "style-dictionary/lib/utils/es6_";

// Parser to remove junk data from Figma JSON
export const figmaVariablesSanitizer: Named<Parser> = {
  name: "figma/variables/sanitizer",
  pattern: /\.json$/,
  parse: ({ contents }): DesignTokens => {
    try {
      const object = JSON.parse(contents);
      const output: DesignTokens = {};

      for (const key in object) {
        const subOutput: DesignTokens = {};

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
      throw error;
    }
  },
};
