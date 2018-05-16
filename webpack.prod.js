const path = require('path');

module.exports = {
  mode: "production",
  entry: "./browser",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "robonomics.min.js",
		library: "Robonomics",
    libraryTarget: "umd",
    libraryExport: "default",
  }
}
