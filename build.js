const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier");
const cssnano = require("cssnano");
const terser = require("terser");

// Paths
const inputDir = path.resolve(__dirname);
const outputDir = path.join(__dirname, "dist");

// Create dist folder
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Minify HTML
const html = fs.readFileSync(path.join(inputDir, "index.html"), "utf-8");
const minifiedHtml = minify(html, {
  removeComments: true,
  collapseWhitespace: true,
});
fs.writeFileSync(path.join(outputDir, "index.html"), minifiedHtml);

// Minify CSS
const css = fs.readFileSync(path.join(inputDir, "style.css"), "utf-8");
cssnano.process(css, { from: undefined }).then((result) => {
  fs.writeFileSync(path.join(outputDir, "style.css"), result.css);
});

// Minify JavaScript
const js = fs.readFileSync(path.join(inputDir, "script.js"), "utf-8");
terser.minify(js).then((result) => {
  fs.writeFileSync(path.join(outputDir, "script.js"), result.code);
});

console.log("Build completed! Files are in the dist folder.");
