async function buildBundledCode({ entryPoint, exitPoint }) {
    // Responsible for reading entry file and building final output


    // Create dependancy graph recursively
    const dependancyGraph = createDependancyGraph(entryPoint);

    // Bundle code based on graph
    const bundledCode = bundle(dependancyGraph);

    // write output to target directory
    Bun.write(`${exitPoint}\bundled_index.js`, bundledCode);
} 


export default buildBundledCode;