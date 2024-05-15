
import { endPoints } from "../index";
import dependancyGraph from "../classes/dependancyGraph";
import path from "path"
const fs = require('fs')
const chalk = require("chalk");





export function resolveRequest(filePath, requestedPath) {
    let resolvedPath = path.join(path.dirname(filePath), requestedPath);
    return resolvedPath
}

export function validateFileAndResolvePath(filePath, requestedPath) {
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
        if (err.code === 'ENOENT') console.log(`${absolutePath} does not exist`)
        return { absolutePath: null, fileExists: false };
    }

    return { absolutePath: null, fileExists: false };
}


export function createDependencyGraph(input) {
    const dependancyInstance = new dependancyGraph(input);
    if (input === endPoints.entryPoint) dependancyInstance.isEntryPoint = true;
    return dependancyInstance;
}


function dfs(dependancyGraph) {
    const modules = []
    collect(dependancyGraph, modules);
    return modules
}
function collect(dependancyGraph, moduleStore) {
    moduleStore.push(dependancyGraph);
    dependancyGraph?.dependencies?.forEach((dependency) => collect(dependency, moduleStore))
}
export function buildGraph(dependancyGraph) {
    let modules = dfs(dependancyGraph);
    return modules;
}