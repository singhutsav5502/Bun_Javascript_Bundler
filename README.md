# Javascript Bundler using Bun

## Overview:

This is a JavaScript bundler designed to streamline the process of combining multiple JavaScript files into a single, cohesive bundle. It's built on top of Bun, offering robust support for both require and import statements. enabling efficient management of dependencies within their projects.

## Key Features:

1. **Support for `require` and `import` Statements:** It seamlessly handles both `require` and `import` statements, ensuring that all dependencies are accurately resolved and included in the final bundle.

2. **Circular Dependency Detection:** It identifies and warns developers about any circular dependencies within their codebase, helping to prevent runtime errors and maintain code integrity.

3. **Proper Code Ordering:** It intelligently analyzes the dependencies between JavaScript files and arranges them in topological order. This ensures that modules are loaded and executed in the appropriate sequence, avoiding any potential issues related to undefined variables or functions (temporal dead zones).

4. **Single Bundle Output:** It consolidates all JavaScript files into a single bundle.

### Currently only has dummy console.log() for External Modules (using npm etc.)

To install dependencies:

```bash
bun install
```
For help:
```bash
bun run index.js --help
```
To run:

```bash
bun run index.js --entryPoint "absolute\path\to\entry\JS\file" --exitPoint "absolute\path\to\target\directory"
```

bundlerOptions.json:
```
{
    "onlyLocalImports" (bool)    [default:true] {set to false to add dummy processes for external imports}
    "targetFileName"   (string)  [default:"bundled_index.js"] {target file name to be saved to disk}
}
```
