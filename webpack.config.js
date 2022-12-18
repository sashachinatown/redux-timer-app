const path = require( 'path' );

module.exports =  {
	mode: "development",
    entry: "./src/app.jsx",
    output: {
        path: path.resolve(__dirname, "./public"),
        publicPath: "/public/",
        filename: "bundle.js"
    },
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, "/"),
        },
        port: 3000,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-react"]
                }
            }
        ]
    }
};