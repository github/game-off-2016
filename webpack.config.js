module.exports = {
    entry: './f5',
    output: {
	    path: `${__dirname}/build`,
	    filename: 'f5.js',
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
        ],
    },
    externals: {
        phaser: 'Phaser',
    },
};
