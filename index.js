import { parseArgs } from "util";
import buildBundledCode from "./bundler";
/***********************************************/
// node fs partially supported by bun. 
// used here for exit directory path validation
/***********************************************/
const fs = require('fs/promises');


/***********************************************/
// GET END POINTS
/***********************************************/
const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    h: {
      type: 'boolean'
    },
    help: {
      type: 'boolean'
    },
    entryPoint: {
      type: 'string',
    },
    exitPoint: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});
export const endPoints = { entryPoint: values.entryPoint, exitPoint: values.exitPoint };

//  validate entry file
async function validateEndPoints() {
  const file = Bun.file(endPoints?.entryPoint);
  const entryPointExists = await file.exists();
  if (!entryPointExists) {
    throw new Error("Entry file does not exist\nAborting task.")
  }
  const exitDirectoryPath = endPoints.exitPoint;
  try {
    await fs.access(exitDirectoryPath, fs.constants.F_OK);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log("Exit Directory does not exist.");
    } else {
      console.error("An error occurred:", err);
    }
  }
};

function main() {
  if (values.h === true || values.help === true) {
    console.log("\nto use the bundler run: ")
    console.log(`"bun run index.js --entryPoint "absolute\\path\\to\\entry\\JS\\file" --exitPoint "absolute\\path\\to\\target\\directory""`)
    console.log("\nentryPoint flag represents the input .JS file from where the bundler will start mapping dependencies")
    console.log("exitPoint flag represents the output directory where the bundled file will be written to disk")
  }
  console.log("\n")
  validateEndPoints();
  buildBundledCode(endPoints)
  console.log("\n\nBuild has finished and file is stored at ", endPoints.exitPoint)
}
main();