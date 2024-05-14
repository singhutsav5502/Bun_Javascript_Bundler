
import dependancyGraph from "../classes/dependancyGraph";

export function resolveRequest(filePath, requestedPath) {
    return path.join(path.dirname(filePath), requestedPath);
}

export function createDependancyGraph(input) {
    const dependancyGraphInstance = new dependancyGraph(input); // creates instance with set path
    dependancyGraphInstance.init(); // initialise dependancy graph
    return dependancyGraphInstance;
}
