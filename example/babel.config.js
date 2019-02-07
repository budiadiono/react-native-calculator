const path = require('path')
const root = process.cwd()

module.exports = function(api) {
  api.cache(true)
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'react-native-calculator': path.join(root, '../dist')
          }
        }
      ]
    ]
  }
}
