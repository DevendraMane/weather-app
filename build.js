const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier");
const postcss = require("postcss");
const cssnano = require("cssnano");
const terser = require("terser");

// Paths
const inputDir = path.resolve(__dirname);
const outputDir = path.join(__dirname, "dist");

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Minify HTML
const html = fs.readFileSync(path.join(inputDir, "index.html"), "utf-8");
const minifiedHtml = minify(html, {
  removeComments: true,
  collapseWhitespace: true,
});
fs.writeFileSync(path.join(outputDir, "index.html"), minifiedHtml);

// Minify CSS using PostCSS and CSSNano
(async () => {
  try {
    const css = fs.readFileSync(path.join(inputDir, "style.css"), "utf-8");
    const result = await postcss([cssnano()]).process(css, { from: undefined });
    fs.writeFileSync(path.join(outputDir, "style.css"), result.css);
    console.log("CSS successfully minified!");
  } catch (error) {
    console.error("Error while minifying CSS:", error);
  }
})();

// Minify JavaScript using Terser
(async () => {
  try {
    const js = fs.readFileSync(path.join(inputDir, "script.js"), "utf-8");
    const result = await terser.minify(js);
    if (result.error) throw result.error;
    fs.writeFileSync(path.join(outputDir, "script.js"), result.code);
    console.log("JavaScript successfully minified!");
  } catch (error) {
    console.error("Error while minifying JavaScript:", error);
  }
})();

console.log("Build process completed! Files are in the dist folder.");
