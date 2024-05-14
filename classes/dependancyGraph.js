import { createDependancyGraph, resolveRequest } from "../utils/utils";

const babel = require("@babel/core");

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
        this.dependencies = this.getDependencies();
    }

    getDependencies() {
        // returns dependencies stored in a nested manner within an array
        return (
            this.ast.program.body
                .filter((nd) => nd.type === "ImportDeclarartion") // get import statements
                .map((nd) => nd.source.value) // extract souce path
                .map((currPath) => resolveRequest(this.path, currPath)) // resolve paths
                .map((absolutePath) => createDependancyGraph(absolutePath)) // recursively make further dependancyGraph classes and explore their dependencies 
        )
    }
}

module.exports = dependancyGraph;