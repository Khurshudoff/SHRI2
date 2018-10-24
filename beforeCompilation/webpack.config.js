const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js',
    },
    //entry: ['PEP', './src/index.js'],
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',//your ip address
        contentBase: './dist'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({template: './src/index.html'})
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
        {
            test: /\.html$/,
            use: {
                loader: 'html-loader',
                options: {
                    attrs: ['img:src', 'link:href']
                }
            }
        },
        {
            test: /\.sass$/,
            use: [
                'style-loader', // creates style nodes from JS strings
                'css-loader', // translates CSS into CommonJS
                'sass-loader' // compiles Sass to CSS, using Node Sass by default
            ]
        },
        {//css
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },
        {//images
            test: /\.(pdf|png|svg|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/'
                }
            }]
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }
     ]
   }
};