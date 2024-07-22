const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")

module.exports= {
    entry: "./src/index.js",
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    plugins : [
        new HTMLWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader'
                }
            },
            {
                test: /\.(scss|css)$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            // Images: Copy image files to build folder
            { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: "asset/resource" },
        ]
    }
}