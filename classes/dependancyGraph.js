import { createDependancyGraph, resolveRequest } from "../utils/utils";
import * as babel from "@babel/core";

class dependancyGraph {
    constructor(input) {
        this.path = input;
        this.content = "run <class instance>.init() to run async operations and intialise data";
        this.ast = "";
        this.dependencies = ""
    }
    async init() {
        // used to make sure constructor isn't async in nature
        this.content = await Bun.file(this.path).text();
        this.ast = await babel.parseAsync(this.content);
        this.dependencies = await this.getDependencies();
    }

    async getDependencies() {
        // returns dependencies stored in a nested manner within an array
        return (
            this.ast.program.body
                .filter((nd) => nd.type === "ImportDeclaration") // get import statements
                .map((nd) => nd.source.value) // extract souce path
                .map((currPath) => resolveRequest(this.path, currPath)) // resolve paths
                .map(async (absolutePath) => await createDependancyGraph(absolutePath)) // recursively make further dependancyGraph classes and explore their dependencies 
        )
    }
}

export default dependancyGraph;