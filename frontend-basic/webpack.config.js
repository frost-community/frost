const VueLoaderPlugin = require('vue-loader/lib/plugin');

const isProduction = false;

module.exports = {
	mode: isProduction ? 'production' : 'development',
	entry: './src/client/mainEntry.ts',
	output: {
		path: `${__dirname}/built/client`,
		publicPath: '/', // base path of URL
		filename: 'bundle.js',
		chunkFilename: "bundle.[name].js",
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: [
					{ loader: 'vue-loader' },
				],
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: { configFile: 'tsconfig.client.json', appendTsSuffixTo: [/\.vue$/] },
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: 'vue-style-loader' },
					{ loader: 'css-loader' },
					{ loader: 'sass-loader' },
				],
			},
		]
	},
	resolve: {
		extensions: ['.ts'],
	},
	plugins: [
		new VueLoaderPlugin(),
	],
	// optimization: {
	// 	splitChunks: {
	// 		cacheGroups: {
	// 			vendor: {
	// 				name: "vendor",
	// 				test: /[\\/]node_modules[\\/]/,
	// 				chunks: "all",
	// 			}
	// 		},
	// 	},
	// },
};
