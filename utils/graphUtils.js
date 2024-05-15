import { endPoints } from "../index";
import dependancyGraph from "../dependancyGraph/dependancyGraph";

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