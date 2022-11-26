const { override, addBabelPreset } = require('customize-cra');
const path = require('path')
const paths = require('react-scripts/config/paths')
paths.appBuild = path.join(path.dirname(paths.appBuild),
    './dist')
module.exports = override(addBabelPreset('@emotion/babel-preset-css-prop'));
