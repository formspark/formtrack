import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  globalName: "Formtrack",
  minify: true,
  outDir: "dist",
  platform: "browser",
  sourcemap: true,
  splitting: false,
  footer: ({ format }) => {
    if (format === "iife") {
      return { js: "Formtrack=Object.assign(Formtrack.default,Formtrack);" };
    }
    if (format === "cjs") {
      return {
        js: "module.exports=Object.assign(module.exports.default,module.exports);",
      };
    }
    return {};
  },
});
