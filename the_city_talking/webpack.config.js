const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "client.js",
    resolve: {
        root: path.resolve("src/js")
    },
    output: {
        path: path.join(__dirname,'html/js'),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/, // compiles jsx+ES6 into browser compatible ES5
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpg)$/, // transforms require("imgpath") into urls
                loader: 'url?limit=25000'
            },
            {
                test: /\.s[a|c]ss$/, // must have scss to css compiler
                loader: 'style!css!sass'
            }
        ]
    },
};
