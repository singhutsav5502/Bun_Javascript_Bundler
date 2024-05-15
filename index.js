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
export const { values: endPoints, positionals } = parseArgs({
  args: Bun.argv,
  options: {
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
  validateEndPoints();
  buildBundledCode(endPoints)
}
main();