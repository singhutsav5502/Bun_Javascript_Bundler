import { createDependencyGraph, buildGraph } from "./utils/graphUtils";
import * as babel from "@babel/core"
import * as fs from "fs"
import * as path from "path"

const bundlerOptions = require('./bundlerOptions.json')
function makeExitFolder(exitDirectory) {
    const folders = exitDirectory.split(path.sep);
    if (folders.length) {
        // create folder path if it doesn't exist
        folders.reduce((last, folder) => {
            const folderPath = last ? last + path.sep + folder : folder;
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }
            return folderPath;
        });
    }
}
function bundle(exitPoint, graph) {
    const modules = buildGraph(graph);
    // create target directory if it doesn't exist
    makeExitFolder(exitPoint);

    const file = Bun.file(`${path.join(exitPoint,bundlerOptions.targetFileName)}`);
    const writer = file.writer();

    // rebuild code from ast and write it to file in order
    modules.reverse().forEach((module) => {
        const codeFromAst = babel.transformFromAstSync(module?.ast, module?.content, {
            ast: true,
            plugins: [
                function () {
                    return {
                        visitor: {
                            ImportDeclaration(path) {
                                path.remove(); // remove import declarations
                            },
                            ExportDefaultDeclaration(path) {
                                if (!module?.isEntryPoint) path.remove(); // removes "export default" declaration
                                // doesn't remove export default for entry point
                            },
                        }
                    }
                }
            ]
        });
        writer.write(`${codeFromAst.code}\n`);
        writer.flush();
    })
    writer.end();

    return;
}

function buildBundledCode({ entryPoint, exitPoint }) {
    // Responsible for reading entry file and building final output


    // Create dependency graph recursively
    const dependancyGraph = createDependencyGraph(entryPoint);
    // Bundle code based on graph
    // and writes output to file 
    bundle(exitPoint, dependancyGraph);

}


export default buildBundledCode;