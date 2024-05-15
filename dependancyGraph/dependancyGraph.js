import { endPoints } from "..";
import { validateFileAndResolvePath } from "../utils/utils";
import { createDependencyGraph } from "../utils/graphUtils";
import * as babel from "@babel/core";
const fs = require('fs');
const bundlerOptions = require('../bundlerOptions.json')

let visited = new Set(); // Set to track visited paths
let currentlyVisiting = new Set(); // Set to track currently visiting paths

class dependencyGraph {
    constructor(input) {
        this.path = input;
        this.content = fs.readFileSync(input, "utf-8");
        this.ast = babel.parseSync(this.content);
        this.dependencies = this.getDependencies();
        this.isEntryPoint = false; // used to mark the entry file and retain its "default exports"
    }
    isExternalModule(currPath) {
        if (bundlerOptions.onlyLocalImports === true && !currPath.startsWith('.') && !currPath.startsWith('/')) {
            // only local imports, ignore
            return true;
        }
        else if (!currPath.startsWith('.') && !currPath.startsWith('/')) {
            // external module import
            console.log(`handle external module import for ${currPath}`)
            return true;
        }
        return false;
    }


    getDependencies() {
        visited.add(endPoints.entryPoint)
        let dependencies = [];

        for (const node of this.ast.program.body) {
            if (node.type === "ImportDeclaration") {
                const currPath = node.source.value;
                const isExternalModule = this.isExternalModule(currPath);

                if (isExternalModule) continue;
                const { absolutePath, fileExists } = validateFileAndResolvePath(this.path, currPath);
                if (!fileExists) continue
                // Check for circular dependency
                if (currentlyVisiting.has(absolutePath)) {
                    console.warn(`Circular dependency detected at path: ${absolutePath} from ${this.path}`);
                    continue;
                }
                if (visited.has(absolutePath)) continue;
                // in case of non looping revisit we would want this dependency tree to be stored as well 
                // can save time by using DP

                // Update currently visiting set
                currentlyVisiting.add(absolutePath);

                // Recursively resolve dependencies
                const dependencyGraph = createDependencyGraph(absolutePath);
                dependencies.push(dependencyGraph);

                // Update currently visiting set after exploring dependencies
                currentlyVisiting.delete(absolutePath);

                // Update visited paths to reflect that this dependencyGraph has been explored
                visited.add(absolutePath);
            }
            else if (node.type === "VariableDeclaration") {
                //  DESIRED STRUCTURE 
                /* const node.declarations
                            |
                            V
                        list object of type VairableDeclarator
                            |
                            V
                        init of type CallExpression
                            |
                            V
                        callee of type Identifier and name require
                            |
                            V
                        arguments (list of objects)
                            |
                            V
                        type Literal -> raw field contains path name
                */
                for (const declaration of node.declarations) {
                    if (declaration.type === "VariableDeclarator"
                        && declaration.init.type === "CallExpression"
                        && declaration.init.callee.type === "Identifier"
                        && declaration.init.callee.name === "require"
                        // && declaration.init.arguments[0].type === "Literal" based on astexplorer structure
                        && declaration.init.arguments[0].type === "StringLiteral"
                        // babels parsed AST has type StringLiteral instead of Literal
                    ) {
                        const currPath = declaration.init.arguments[0].value;
                        const isExternalModule = this.isExternalModule(currPath);
                        if (isExternalModule) continue;
                        const { absolutePath, fileExists } = validateFileAndResolvePath(this.path, currPath);
                        if (!fileExists) continue;
                        // Check for circular dependency
                        if (currentlyVisiting.has(absolutePath)) {
                            console.warn(`Circular dependency detected at path: ${absolutePath} from ${this.path}`);
                            continue;
                        }
                        if (visited.has(absolutePath)) continue;
                        // in case of non looping revisit we would want this dependency tree to be stored as well 
                        // can save time by using DP

                        // Update currently visiting set
                        currentlyVisiting.add(absolutePath);

                        // Recursively resolve dependencies
                        const dependencyGraph = createDependencyGraph(absolutePath);
                        dependencies.push(dependencyGraph);
                        // Update currently visiting set after exploring dependencies
                        currentlyVisiting.delete(absolutePath);

                        // Update visited paths to reflect that this dependencyGraph has been explored
                        visited.add(absolutePath);
                    }
                }
            }
        }
        return dependencies;
    }
}

export default dependencyGraph;
