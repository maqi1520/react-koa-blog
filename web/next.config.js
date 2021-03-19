const fs = require('fs')
const path = require('path')
const withLess = require('@zeit/next-less')

const rewrites = [
  {
    source: '/page/:path*',
    destination: `/?pageNum=:path*`,
  },
  {
    source: '/archive/tag/:path*',
    destination: `/archive?tag=:path*`,
  },
  {
    source: '/post/:id/edit',
    destination: `/create`,
  },
]

let themeVariables = {}

const lessToJS = require('less-vars-to-js')
themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './src/styles/antd-custom.less'),
    'utf8'
  )
)
rewrites.push({
  source: '/api/:path*',
  destination: `http://localhost:4000/api/:path*`,
})

module.exports = withLess({
  async rewrites() {
    return rewrites
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
    importLoaders: 0,
  },
  cssLoaderOptions: {
    importLoaders: 3,
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack: (config, { isServer }) => {
    //Make Ant styles work with less
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }
    return config
  },
  distDir: 'build',
  target: 'serverless',
})
