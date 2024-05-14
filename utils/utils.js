
import dependancyGraph from "../classes/dependancyGraph";
import path from "path"
export function resolveRequest(filePath, requestedPath) {
    let resolvedPath= path.join(path.dirname(filePath), requestedPath);
    if (resolvedPath.slice(0,resolvedPath.length-3) !== ".js") resolvedPath+=".js"
    return resolvedPath
}

export function  createDependancyGraph(input) {
    return new dependancyGraph(input); 
}
