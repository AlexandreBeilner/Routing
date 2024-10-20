require('dotenv').config();
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/Main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname + '/src', 'dist'),
        assetModuleFilename: 'images/[hash][ext][query]',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
        }),
    ],
    resolve: {
        alias: {
            images: path.resolve(__dirname, 'src/assets/images/'),
        },
    },
};
