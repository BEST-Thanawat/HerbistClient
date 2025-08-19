const path = require("path");

module.exports = {
  optimization: {
    runtimeChunk: "single", // separates runtime
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 20000, // minimum size before creating a new chunk
      cacheGroups: {
        // Angular core and router
        angular: {
          test: /[\\/]node_modules[\\/]@angular[\\/]/,
          name: "angular",
          chunks: "all",
          priority: 30,
        },
        // RxJS
        rxjs: {
          test: /[\\/]node_modules[\\/]rxjs[\\/]/,
          name: "rxjs",
          chunks: "all",
          priority: 25,
        },
        // Other node_modules
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the package name
            const packageNameMatch = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            if (!packageNameMatch) return "vendor";
            return `npm.${packageNameMatch[1].replace("@", "")}`;
          },
          chunks: "all",
          priority: 10,
        },
        // Your app code (optional: can force separate large modules)
        default: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
