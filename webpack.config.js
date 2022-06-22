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
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /(node_modules)/
            },
            // {
            //     test: /\.wasm$/,
            //     type: "javascript/auto",
            //     loader: "file-loader",
            //     options: {
            //         publicPath: "dist/"
            //     }
            // },
            {
                test: /\.wasm$/,
                type: "asset/inline",
            },
        ],
        parser: {
            javascript: {
                dynamicImportMode: 'eager'
            }
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "url": require.resolve("url/"),
            "path": require.resolve("path-browserify"),
            "zlib": false,
            "http": false,
            "https": false,
            // "stream": require.resolve("stream-browserify"),
            // "buffer": require.resolve("buffer"),
            // "crypto": require.resolve("crypto-browserify"),
            // "crypto-browserify": require.resolve("crypto-browserify")
        }
    },
    experiments: {
        asyncWebAssembly: true,
        syncWebAssembly: true
    },
    target: "web",
    mode: "development"
};
