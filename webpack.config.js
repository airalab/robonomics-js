const path = require('path');

module.exports = {
  mode: "development",
  entry: "./browser",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "robonomics.js",
		library: "Robonomics",
    libraryTarget: "umd",
    libraryExport: "default",
  }
}
