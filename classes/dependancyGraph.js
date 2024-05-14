import { createDependancyGraph, resolveRequest } from "../utils/utils";
import * as babel from "@babel/core";
const fs = require('fs');

let visited = new Set(); // Set to track visited paths
let currentlyVisiting = new Set(); // Set to track currently visiting paths
class dependencyGraph {
    constructor(input) {
        this.path = input;
        this.content = fs.readFileSync(input, "utf-8");
        this.ast = babel.parseSync(this.content);
        this.dependencies = this.getDependencies();
    }

    getDependencies() {
        const dependencies = [];

        for (const node of this.ast.program.body) {
            if (node.type === "ImportDeclaration") {
                const currPath = node.source.value;
                if (!currPath.startsWith('.') && !currPath.startsWith('/')) {
                    // Not a local import, ignore
                    continue;
                }

                const absolutePath = resolveRequest(this.path, currPath);

                // Check for circular dependency
                if (currentlyVisiting.has(absolutePath)) {
                    console.warn(`Circular dependency detected at path: ${absolutePath} from ${this.path}`);
                    continue;
                }
                if (visited.has(absolutePath)) continue;

                // Update currently visiting set
                currentlyVisiting.add(absolutePath);

                // Recursively resolve dependencies
                const dependencyGraph = createDependancyGraph(absolutePath);
                dependencies.push(dependencyGraph);

                // Update currently visiting set after exploring dependencies
                currentlyVisiting.delete(absolutePath);

                // Update visited paths to reflect that this dependencyGraph has been explored
                visited.add(absolutePath);
            }
        }

        return dependencies;
    }
}

export default dependencyGraph;
