const { override, addBabelPlugin, addWebpackPlugin } = require('customize-cra');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

// These aliases allow us to import directly from the given directories.
// !!! Make sure to add these aliases to the jsconfig.json for autocompletion.
// !!! And make sure to add them to the .eslintrc.json so eslint can resolve the path.
module.exports = override(
  addBabelPlugin([
    'module-resolver', {
      root: ['.'],
      alias: {
        '@assets': './src/assets',
        '@components': './src/components',
        '@context': './src/context',
        '@elements': './src/elements',
        '@forms': './src/forms',
        '@hooks': './src/hooks',
        '@screens': './src/screens',
        '@styles': './src/styles',
        '@utils': './src/utils',
        '@tests': './src/tests',
        '@serviceWorkers': './src/serviceWorkers',
      },
    },
  ]),
  addWebpackPlugin(
    (new MonacoWebpackPlugin({
      languages: ['javascript']
    }))
  )
);
