
import dependancyGraph from "../classes/dependancyGraph";

export function resolveRequest(filePath, requestedPath) {
    return path.join(path.dirname(filePath), requestedPath);
}

export async function  createDependancyGraph(input) {
    const dependancyGraphInstance = new dependancyGraph(input); // creates instance with set path
    await dependancyGraphInstance.init(); // initialise dependancy graph
    return dependancyGraphInstance;
}
