const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');


module.exports = {

    entry: ['./src/index.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(s*)css$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'sass-loader', // compiles Sass to CSS
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: 'url-loader?name=[name].[ext]',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            },
            title: 'test',
            template: 'src/index.html'
        }),
        new MiniCssExtractPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
