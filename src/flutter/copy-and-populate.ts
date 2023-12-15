import fs from "fs-extra";
import path from "path";
import _ from "style-dictionary/lib/utils/es6_";

const copyDirectory = async (source: string, destination: string) => {
  try {
    // Clear destination directory
    await fs.emptyDir(destination);

    // Copy everything from source to destination
    await fs.copy(source, destination);
  } catch (error) {
    console.error("Error while copying directory:", error);
    throw error;
  }
};

const updateMoonTokensFile = async (sourceDir: string, targetFile: string) => {
  try {
    // Clear the file content
    await fs.writeFile(targetFile, "");

    // Write the initial line
    await fs.appendFile(targetFile, "library moon_tokens;\n\n");

    // Read the subfolders from the source directory
    const subfolders = await fs.readdir(sourceDir);

    for (const folder of subfolders) {
      const stats = await fs.stat(path.join(sourceDir, folder));
      if (stats.isDirectory()) {
        // Convert folder name to snake case and append to the file
        const snakeCaseName = _.snakeCase(folder);
        const exportLine = `export "src/brands/${folder}/${snakeCaseName}_colors.dart";\n`;
        console.log(exportLine);
        await fs.appendFile(targetFile, exportLine);
      }
    }
  } catch (error) {
    console.error("Error while updating moon_tokens.dart file:", error);
    throw error;
  }
};

(async () => {
  const buildFlutterDir = path.resolve("./build/flutter");
  const flutterLibSrcDir = path.resolve("./flutter/lib/src/brands");
  const moonTokensFile = path.resolve("./flutter/lib/moon_tokens.dart");

  await copyDirectory(buildFlutterDir, flutterLibSrcDir);
  await updateMoonTokensFile(buildFlutterDir, moonTokensFile);
})();
