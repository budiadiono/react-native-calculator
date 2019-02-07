const path = require('path')
const root = process.cwd()

module.exports = {
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.join(root, `node_modules/${name}`)
      }
    )
  },
  watchFolders: [path.join(root, '../dist')]
}
