const autoprefixer = require('autoprefixer');

const path = require('path');

function tryResolve_(url, sourceFilename) {
  // Put require.resolve in a try/catch to avoid node-sass failing with cryptic libsass errors
  // when the importer throws
  try {
    return require.resolve(url, {paths: [path.dirname(sourceFilename)]});
  } catch (e) {
    return '';
  }
}

function tryResolveScss(url, sourceFilename) {
  // Support omission of .scss and leading _
  const normalizedUrl = url.endsWith('.scss') ? url : `${url}.scss`;
  return tryResolve_(normalizedUrl, sourceFilename) ||
    tryResolve_(path.join(path.dirname(normalizedUrl), `_${path.basename(normalizedUrl)}`),
      sourceFilename);
}

function materialImporter(url, prev) {
  if (url.startsWith('@material')) {
    const resolved = tryResolveScss(url, prev);
    return {file: resolved || url};
  }
  return {file: url};
}

module.exports = [{
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './client/static/css/'
    },

    entry: {
      material : [
        './client/static/scss/material-theme.scss',
        './client/static/js/material.js',
        
        // <---->
        './client/static/scss/style_common.scss',
        './client/static/scss/style_register.scss',
        './client/static/scss/style_home.scss',
        './client/static/scss/style_pin.scss'
      ],
      lobby : [
        './client/static/scss/material-lobby.scss',
        './client/static/js/material-lobby.js',
      ],
      portfolioBundle : [
        './client/static/scss/portfolio-bundle.scss',
        './client/static/js/portfolio-bundle.js',
      ]
    },
    output: {
      // This is necessary for webpack to compile
      // But we never use style-bundle.js
      filename: '[name].js',
      path: __dirname + '/client/static/css'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].css',
              },
            },
            { loader: 'extract-loader' },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                 plugins: () => [autoprefixer()]
              }
            },
            { loader: 'sass-loader', 
              options: {
                sassOptions: {
                  includePaths: ['./node_modules'],
                  importer: materialImporter
                }
              } 
            },
          ]
        }, 
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env'],
          },
        }
      ]
    },
  }
];