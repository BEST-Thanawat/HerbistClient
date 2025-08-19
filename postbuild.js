const { PurgeCSS } = require("purgecss");
const fs = require("fs");
const path = require("path");

(async () => {
  console.log("🔥 postbuild.js running...");

  const DIST_PATH = path.join(__dirname, "dist/herbistclient/browser");

  // Helper to get file size in KB
  const getFilesizeInKB = (filename) => {
    const stats = fs.statSync(filename);
    return (stats.size / 1024).toFixed(2) + " KB";
  };

  // Find all CSS files in dist folder
  const cssFiles = fs.readdirSync(DIST_PATH).filter((f) => f.endsWith(".css"));

  if (cssFiles.length === 0) {
    console.warn("⚠️ No CSS files found in", DIST_PATH);
    return;
  }

  // Prepare original sizes
  const fileData = cssFiles.map((f) => ({
    file: f,
    originalSize: getFilesizeInKB(path.join(DIST_PATH, f)),
    purgedSize: null,
  }));

  console.log(`Found ${cssFiles.length} CSS file(s). Running PurgeCSS...`);

  // Run PurgeCSS on all files
  const purgeResults = await new PurgeCSS().purge({
    content: [
      "./src/**/*.html", // Angular templates
      "./src/**/*.ts", // TS files (ngClass, strings)
      path.join(DIST_PATH, "*.js"), // Angular inlined templates in JS
      path.join(DIST_PATH, "index.html"),
    ],
    css: cssFiles.map((f) => path.join(DIST_PATH, f)),
    safelist: {
      standard: [
        // Angular Material / Tailwind
        /^mat-/,
        /^cdk-/,
        /^bg-/,
        /^text-/,
        /^fa-/,
        "active",
        "show",
        "hidden",
        
        // ngx-bootstrap datepicker classes
        /^bs-datepicker/,       // keep all bs-datepicker-* classes
        /^datepicker/,          // keep datepicker classes
        /^theme-/,              // if you’re using themed variants
        "is-disabled",
        "is-active",
        "today",
        "disabled",
        "active",
        "in-range",
        "range-start",
        "range-end",

        // ngx-owl-carousel-o classes
        /^owl-/,
        "owl-carousel",
        "owl-stage",
        "owl-item",
        "owl-dots",
        "owl-nav",
        "owl-prev",
        "owl-next",
      ],
    },
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  });

  // Write purged CSS back and record new sizes
  purgeResults.forEach((result) => {
    fs.writeFileSync(result.file, result.css, "utf-8");
    const fileEntry = fileData.find(f => path.resolve(DIST_PATH, f.file) === path.resolve(result.file));
    if (fileEntry) {
      fileEntry.purgedSize = getFilesizeInKB(result.file);
    }
  });

  // Log table of sizes
  console.table(
    fileData.map((f) => ({
      File: f.file,
      "Original Size": f.originalSize,
      "Purged Size": f.purgedSize,
    }))
  );

  console.log("✅ PurgeCSS complete!");
})();

// const { exec } = require('child_process');
// const fs = require('fs');
// const path = require('path');

// const DIST_PATH = './dist/HerbistClient/browser'; // 👈 adjust this
// const files = getFilesFromPath(DIST_PATH, '.css');
// let data = files.map(f => ({
//   file: f,
//   originalSize: getFilesizeInKB(path.join(DIST_PATH, f)),
//   newSize: ''
// }));

// console.log('Running PurgeCSS...');
// exec(
//   `purgecss --content ${DIST_PATH}/index.html ${DIST_PATH}/*.js --css ${DIST_PATH}/*.css --output ${DIST_PATH}/`,
//   (err, stdout, stderr) => {
//     if (err) {
//       console.error('❌ PurgeCSS failed:', err);
//       return;
//     }
//     console.log('✅ PurgeCSS done');
//     data.forEach(d => {
//       d.newSize = getFilesizeInKB(path.join(DIST_PATH, d.file));
//     });
//     console.table(data);
//   }
// );

// function getFilesizeInKB(filename) {
//   const stats = fs.statSync(filename);
//   return (stats.size / 1024).toFixed(2) + 'kb';
// }

// function getFilesFromPath(dir, ext) {
//   return fs.readdirSync(dir).filter(e => path.extname(e).toLowerCase() === ext);
// }
