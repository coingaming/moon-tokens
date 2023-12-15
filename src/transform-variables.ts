import fs from "fs-extra";
import path from "path";

interface IFigmaData {
  meta: {
    variables: {
      [key: string]: {
        name: string;
        remote: boolean;
        valuesByMode: { [key: string]: any };
        variableCollectionId: string;
        resolvedType: string;
      };
    };
    variableCollections: {
      [key: string]: {
        defaultModeId: string;
        modes: {
          [key: string]: {
            modeId: string;
            name: string;
          };
        };
      };
    };
  };
}

interface IData {
  [key: string]: any;
}

// Load input data from a JSON file
const inputData: IFigmaData = require("../figma/variables.json");

const tokensDirectory = path.resolve(__dirname, "../tokens");
const outputDirectory = path.resolve(__dirname, "../tokens/brands");

const createDirectory = async (dirPath: string): Promise<void> => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err: any) {
    if (err.code !== "EEXIST") throw err;
  }
};

const transformFigmaVariables = async (): Promise<void> => {
  const transformedData: {
    [modeName: string]: { [resolvedType: string]: IData };
  } = {};

  // Loop through each variable and mode and create a new object
  Object.values(inputData.meta.variables).forEach((variable) => {
    const { name, remote, valuesByMode, variableCollectionId, resolvedType } =
      variable;

    const { defaultModeId } =
      inputData.meta.variableCollections[variableCollectionId];
    const defaultModeValue = valuesByMode && valuesByMode[defaultModeId];

    // Group variables by resolved type
    Object.values(
      inputData.meta.variableCollections[variableCollectionId].modes
    ).forEach((mode) => {
      if (remote) return;
      const { modeId: modeId, name: modeName } = mode;
      const modeValue = valuesByMode && valuesByMode[modeId];

      if (!transformedData[modeName]) {
        transformedData[modeName] = {};
      }

      if (!transformedData[modeName][resolvedType]) {
        transformedData[modeName][resolvedType] = {};
      }

      // If a variable is not defined for a given mode, fall back to the default mode
      transformedData[modeName][resolvedType][name.toLowerCase()] = {
        value: modeValue || defaultModeValue,
      };
    });
  });

  // Generates files for each mode and type
  await Promise.all(
    Object.entries(transformedData).map(async ([modeName, modeData]) => {
      const sanitizedModeName = modeName.toLowerCase().replace(/\s+/g, "-");
      const modeDirectory = path.join(outputDirectory, sanitizedModeName);

      fs.emptyDirSync(tokensDirectory);
      await createDirectory(modeDirectory);

      await Promise.all(
        Object.entries(modeData).map(async ([resolvedType, data]) => {
          // Ensure data is an object before spreading it
          if (typeof data === "object" && data !== null) {
            const resolvedTypeTitle = resolvedType.toLowerCase();
            const outputFilePath = path.join(
              modeDirectory,
              `${resolvedTypeTitle}.json`
            );

            await fs.writeFile(
              outputFilePath,
              JSON.stringify({ [resolvedTypeTitle]: { ...data } })
            );
          }
        })
      );
    })
  );
};

transformFigmaVariables();
