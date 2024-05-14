import { createDependancyGraph, checkJsFileExistsAndResolveRequest } from "../utils/utils";
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
    }


    resolvePathDependencies(currPath, dependenciesStore) {

        if (bundlerOptions.onlyLocalImports) {
            // only local imports, ignore
            return;
        }
        else if (!currPath.startsWith('.') && !currPath.startsWith('/')) {
            // external module import
            console.log(`handle external module import for ${currPath}`)
            return
        }

        const { absolutePath, fileExists } = checkJsFileExistsAndResolveRequest(this.path, currPath);
        if (!fileExists) return;
        // Check for circular dependency
        if (currentlyVisiting.has(absolutePath)) {
            console.warn(`Circular dependency detected at path: ${absolutePath} from ${this.path}`);
            return;
        }
        if (visited.has(absolutePath)) return;

        // Update currently visiting set
        currentlyVisiting.add(absolutePath);

        // Recursively resolve dependencies
        const dependencyGraph = createDependancyGraph(absolutePath);
        dependenciesStore.push(dependencyGraph);

        // Update currently visiting set after exploring dependencies
        currentlyVisiting.delete(absolutePath);

        // Update visited paths to reflect that this dependencyGraph has been explored
        visited.add(absolutePath);
    }

    getDependencies() {
        const dependencies = [];

        for (const node of this.ast.program.body) {
            if (node.type === "ImportDeclaration") {
                const currPath = node.source.value;
                this.resolvePathDependencies(currPath, dependencies);
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
                        this.resolvePathDependencies(currPath, dependencies);
                    }
                }
            }
        }

        return dependencies;
    }
}

export default dependencyGraph;
