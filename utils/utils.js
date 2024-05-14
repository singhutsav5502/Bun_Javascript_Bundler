
import dependancyGraph from "../classes/dependancyGraph";
import path from "path"
const fs = require('fs')
function resolveRequest(filePath, requestedPath) {
    let resolvedPath = path.join(path.dirname(filePath), requestedPath);
    return resolvedPath
}

export function checkJsFileExistsAndResolveRequest(filePath, requestedPath) {
    let absolutePath = resolveRequest(filePath, requestedPath)

    try {
        if (!absolutePath.endsWith('.js')) absolutePath += '.js'
        // Check if the file exists
        const stats = fs.statSync(absolutePath);

        // Check if it's a file and has a ".js" extension
        if (stats.isFile()) {
            return { absolutePath, fileExists: true };
        }
    } catch (err) {
        // Handle errors (e.g., file not found)
        if(err.code === 'ENOENT') console.log(`${absolutePath} does not exist`)
        return { absolutePath: null, fileExists: false };
    }

    return { absolutePath: null, fileExists: false };
}


export function createDependancyGraph(input) {
    return new dependancyGraph(input);
}
