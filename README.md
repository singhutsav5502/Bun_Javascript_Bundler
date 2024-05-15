# bun_js_bundler

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.js --entryPoint "absolute\path\to\entry\JS\file" --exitPoint "absolute\path\to\target\directory"
```

bundlerOptions.json:
```
{
    "onlyLocalImports" (bool)    [default:true] {set to false to add **dummy** processes for external imports}
    "targetFileName"   (string)  [default:"bundled_index.js"] {target file name to be saved to disk}
}
```
