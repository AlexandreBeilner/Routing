require('dotenv').config();
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/Main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname + '/src', 'dist'),
    },
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY)
        })
    ]
};
