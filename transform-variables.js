const fs = require("fs-extra");
const path = require("path");
const inputData = require("./figma/variables.json");
const outputDirectory = "./tokens/brands";

const createDirectory = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
};

const transformFigmaVariables = async () => {
  const transformedData = {};

  /**
   * Loop through each variable and mode and create a new object.
   */
  Object.values(inputData.meta.variables).forEach((variable) => {
    const { name, valuesByMode, variableCollectionId, resolvedType } = variable;

    const { defaultModeId } =
      inputData.meta.variableCollections[variableCollectionId];

    const defaultModeValue = valuesByMode && valuesByMode[defaultModeId];

    /**
     * Group variables by resolved type.
     */
    Object.values(
      inputData.meta.variableCollections[variableCollectionId].modes
    ).forEach((mode) => {
      const { id: modeId, name: modeName } = mode;
      const modeValue = valuesByMode && valuesByMode[modeId];

      if (!transformedData[modeName]) {
        transformedData[modeName] = {};
      }

      if (!transformedData[modeName][resolvedType]) {
        transformedData[modeName][resolvedType] = {};
      }

      /**
       * If a variable is not defined for a given mode, we'll fall back to the default mode.
       */
      transformedData[modeName][resolvedType][name.toLowerCase()] = {
        value: modeValue || defaultModeValue,
      };
    });
  });

  /**
   * Generates files for each mode and type.
   */
  await Promise.all(
    Object.entries(transformedData).map(async ([modeName, modeData]) => {
      const sanitizedModeName = modeName.toLowerCase().replace(/\s+/g, "-");
      const modeDirectory = path.join(outputDirectory, sanitizedModeName);

      await createDirectory(modeDirectory);

      await Promise.all(
        Object.entries(modeData).map(async ([resolvedType, data]) => {
          const resolvedTypeTitle = resolvedType.toLowerCase();
          const outputFilePath = path.join(
            modeDirectory,
            `${resolvedTypeTitle}.json`
          );

          await fs.writeFile(
            outputFilePath,
            JSON.stringify({
              [resolvedTypeTitle]: { ...data },
            })
          );
        })
      );
    })
  );
};

transformFigmaVariables();
