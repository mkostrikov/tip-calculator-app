import path from 'path';
import HtmlBundlerPlugin from "html-bundler-webpack-plugin";

export default {
    mode: 'development',

    output: {
        path: path.resolve(path.dirname('.'), 'dist'),
        clean: true,
    },

    resolve: {
        alias: {
            '@styles': path.resolve(path.dirname('.'), 'src', 'assets', 'styles'),
            '@scripts': path.resolve(path.dirname('.'), 'src', 'assets', 'scripts'),
            '@images': path.resolve(path.dirname('.'), 'src', 'assets', 'images'),
        },
    },

    plugins: [
        new HtmlBundlerPlugin({
            entry: {
                index: "src/index.pug",
            },
            js: {
                filename: 'js/[name].[contenthash:8].js',
            },
            css: {
                filename: 'css/[name].[contenthash:8].css',
            },
            preprocessor: 'pug',
        }),
    ],

    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                use: ['css-loader', 'sass-loader'],
            },
            {
                test: /\.(ico|png|jp?g|webp|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name].[hash:8][ext][query]',
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 2 * 1024, // inline images < 2 KB
                    },
                },
            },
        ],
    },

    devServer: {
        static: path.resolve(path.dirname('.'), 'dist'),
        watchFiles: {
            paths: ['src/**/*.*'],
            options: {
                usePolling: true,
            },
        },
    },

    stats: 'errors-only',
}