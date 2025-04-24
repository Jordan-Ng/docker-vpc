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
                  loader: 'babel-loader',
                  options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                }
            },            
            {
                test: /\.(scss|css)$/i,
                use: ["style-loader", "css-loader", "postcss-loader", {
                    loader: "sass-loader",
                    options: {
                        implementation: require("sass")
                    }
                }],
            },
            // Images: Copy image files to build folder
            { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: "asset/resource" },
        ]
    },
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.resolve(__dirname, "src"),
            publicPath: "/",            
        },
        port: 3000        
    }
}