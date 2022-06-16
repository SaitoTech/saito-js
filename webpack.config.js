const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
    entry: "./index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    plugins: [
        new HtmlWebpackPlugin(),
        // new WasmPackPlugin({
        //     crateDirectory: path.resolve(__dirname, "../saito-cargo-workspace/saito-wasm"),
        // }),
        new webpack.ProvidePlugin({
            TextDecoder: ['text-encoding', 'TextDecoder'],
            TextEncoder: ['text-encoding', 'TextEncoder']
        })
    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /(node_modules)/
        }, {
            test: /\.wasm$/,
            type: "javascript/auto",
            loader: "file-loader",
            options: {
                publicPath: "dist/"
            }
        }]
    },
    experiments: {
        asyncWebAssembly: true,
        // syncWebAssembly: true
    },
    // target: "web",
    mode: "development"
};
