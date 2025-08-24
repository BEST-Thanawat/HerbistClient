const { PurgeCSS } = require("purgecss");
const fs = require("fs");
const path = require("path");

(async () => {
  console.log("🔥 postbuild.js running...");

  const DIST_PATH = path.join(__dirname, "dist/herbistclient/browser");
  const SKIP_CSS = [/cookieconsent/i]; // anything matching gets skipped

  const getFilesizeInKB = (filename) => {
    const stats = fs.statSync(filename);
    return (stats.size / 1024).toFixed(2) + " KB";
  };

  const allCss = fs.readdirSync(DIST_PATH).filter((f) => f.endsWith(".css"));
  const skippedCss = allCss.filter((f) => SKIP_CSS.some((rx) => rx.test(f)));
  const cssFiles = allCss.filter((f) => !SKIP_CSS.some((rx) => rx.test(f)));

  if (!allCss.length) {
    console.warn("⚠️ No CSS files found in", DIST_PATH);
    return;
  }

  if (skippedCss.length) {
    console.log("⏭️ Skipping from PurgeCSS:", skippedCss.join(", "));
  }

  const fileData = allCss.map((f) => ({
    file: f,
    originalSize: getFilesizeInKB(path.join(DIST_PATH, f)),
    purgedSize: SKIP_CSS.some((rx) => rx.test(f)) ? "(skipped)" : null,
  }));

  if (!cssFiles.length) {
    console.log("ℹ️ Nothing to purge (all CSS skipped by rule).");
  } else {
    console.log(`Found ${cssFiles.length} CSS file(s) to purge. Running PurgeCSS...`);
    const purgeResults = await new PurgeCSS().purge({
      content: ["./src/**/*.html", "./src/**/*.ts", path.join(DIST_PATH, "*.js"), path.join(DIST_PATH, "index.html")],
      css: cssFiles.map((f) => path.join(DIST_PATH, f)),
      safelist: {
        standard: [
          // your existing safelist…
          /^mat-/,
          /^cdk-/,
          /^bg-/,
          /^text-/,
          /^fa-/,
          "active",
          "show",
          "hidden",
          /^bs-datepicker/,
          /^datepicker/,
          /^theme-/,
          "is-disabled",
          "is-active",
          "today",
          "disabled",
          "active",
          "in-range",
          "range-start",
          "range-end",
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

    purgeResults.forEach((result) => {
      fs.writeFileSync(result.file, result.css, "utf-8");
      const entry = fileData.find((f) => path.resolve(DIST_PATH, f.file) === path.resolve(result.file));
      if (entry) entry.purgedSize = getFilesizeInKB(result.file);
    });
  }

  console.table(
    fileData.map((f) => ({
      File: f.file,
      "Original Size": f.originalSize,
      "Purged Size": f.purgedSize,
    }))
  );

  console.log("✅ Postbuild complete!");
})();

// const { PurgeCSS } = require("purgecss");
// const fs = require("fs");
// const path = require("path");

// (async () => {
//   console.log("🔥 postbuild.js running...");

//   const DIST_PATH = path.join(__dirname, "dist/herbistclient/browser");

//   // Helper to get file size in KB
//   const getFilesizeInKB = (filename) => {
//     const stats = fs.statSync(filename);
//     return (stats.size / 1024).toFixed(2) + " KB";
//   };

//   // Find all CSS files in dist folder
//   const cssFiles = fs.readdirSync(DIST_PATH).filter((f) => f.endsWith(".css"));
//   // const cssFiles = fs.readdirSync(DIST_PATH).filter((f) => f.endsWith(".css") && !f.includes("cookieconsent.min.css"));

//   if (cssFiles.length === 0) {
//     console.warn("⚠️ No CSS files found in", DIST_PATH);
//     return;
//   }

//   // Prepare original sizes
//   const fileData = cssFiles.map((f) => ({
//     file: f,
//     originalSize: getFilesizeInKB(path.join(DIST_PATH, f)),
//     purgedSize: null,
//   }));

//   console.log(`Found ${cssFiles.length} CSS file(s). Running PurgeCSS...`);

//   // Run PurgeCSS on all files
//   const purgeResults = await new PurgeCSS().purge({
//     content: [
//       "./src/**/*.html", // Angular templates
//       "./src/**/*.ts", // TS files (ngClass, strings)
//       path.join(DIST_PATH, "*.js"), // Angular inlined templates in JS
//       path.join(DIST_PATH, "index.html"),
//     ],
//     css: cssFiles.map((f) => path.join(DIST_PATH, f)),
//     safelist: {
//       standard: [
//         // Angular Material / Tailwind
//         /^mat-/,
//         /^cdk-/,
//         /^bg-/,
//         /^text-/,
//         /^fa-/,
//         "active",
//         "show",
//         "hidden",

//         // ngx-bootstrap datepicker classes
//         /^bs-datepicker/, // keep all bs-datepicker-* classes
//         /^datepicker/, // keep datepicker classes
//         /^theme-/, // if you’re using themed variants
//         "is-disabled",
//         "is-active",
//         "today",
//         "disabled",
//         "active",
//         "in-range",
//         "range-start",
//         "range-end",

//         // ngx-owl-carousel-o classes
//         /^owl-/,
//         "owl-carousel",
//         "owl-stage",
//         "owl-item",
//         "owl-dots",
//         "owl-nav",
//         "owl-prev",
//         "owl-next",

//         // CookieConsent classes (explicit list)
//         "cc-window",
//         "cc-banner",
//         "cc-floating",
//         "cc-top",
//         "cc-bottom",
//         "cc-left",
//         "cc-right",
//         "cc-message",
//         "cc-compliance",
//         "cc-btn",
//         "cc-link",
//         "cc-highlight",
//         "cc-dismiss",
//         "cc-revoke",
//         "cc-center",
//         "cc-top-left",
//         "cc-top-right",
//         "cc-bottom-left",
//         "cc-bottom-right",

//         // compound selectors
//         "cc-banner.cc-bottom",
//         "cc-window.cc-banner",
//         "cc-window.cc-floating",
//         "cc-window.cc-top",
//         "cc-window.cc-bottom",
//         "cc-window.cc-left",
//         "cc-window.cc-right",
//         "cc-window.cc-floating.cc-left",
//         "cc-window.cc-floating.cc-right",
//         "cc-revoke.cc-top",
//         "cc-revoke.cc-bottom",
//         "cc-revoke.cc-left",
//         "cc-revoke.cc-right",
//         "cc-revoke.cc-top.cc-left",
//         "cc-revoke.cc-top.cc-right",
//         "cc-revoke.cc-bottom.cc-left",
//         "cc-revoke.cc-bottom.cc-right",
//       ],
//       deep: [/cc-/], // keep all compound selectors that contain cc-
//       greedy: [/cc-/], // extra protection for multi-class selectors
//     },
//     defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
//   });

//   // Write purged CSS back and record new sizes
//   purgeResults.forEach((result) => {
//     fs.writeFileSync(result.file, result.css, "utf-8");
//     const fileEntry = fileData.find((f) => path.resolve(DIST_PATH, f.file) === path.resolve(result.file));
//     if (fileEntry) {
//       fileEntry.purgedSize = getFilesizeInKB(result.file);
//     }
//   });

//   // Log table of sizes
//   console.table(
//     fileData.map((f) => ({
//       File: f.file,
//       "Original Size": f.originalSize,
//       "Purged Size": f.purgedSize,
//     }))
//   );

//   console.log("✅ PurgeCSS complete!");
// })();

// // const { exec } = require('child_process');
// // const fs = require('fs');
// // const path = require('path');

// // const DIST_PATH = './dist/HerbistClient/browser'; // 👈 adjust this
// // const files = getFilesFromPath(DIST_PATH, '.css');
// // let data = files.map(f => ({
// //   file: f,
// //   originalSize: getFilesizeInKB(path.join(DIST_PATH, f)),
// //   newSize: ''
// // }));

// // console.log('Running PurgeCSS...');
// // exec(
// //   `purgecss --content ${DIST_PATH}/index.html ${DIST_PATH}/*.js --css ${DIST_PATH}/*.css --output ${DIST_PATH}/`,
// //   (err, stdout, stderr) => {
// //     if (err) {
// //       console.error('❌ PurgeCSS failed:', err);
// //       return;
// //     }
// //     console.log('✅ PurgeCSS done');
// //     data.forEach(d => {
// //       d.newSize = getFilesizeInKB(path.join(DIST_PATH, d.file));
// //     });
// //     console.table(data);
// //   }
// // );

// // function getFilesizeInKB(filename) {
// //   const stats = fs.statSync(filename);
// //   return (stats.size / 1024).toFixed(2) + 'kb';
// // }

// // function getFilesFromPath(dir, ext) {
// //   return fs.readdirSync(dir).filter(e => path.extname(e).toLowerCase() === ext);
// // }
