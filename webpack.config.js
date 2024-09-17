const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const mode = "development"

module.exports= {
    entry: "./src/index.js",
    mode: "development",
    output: mode == "production" ? {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"        
    } : {publicPath: "/"},
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
    },
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, "src")
        },
        port: 3000
    }
}