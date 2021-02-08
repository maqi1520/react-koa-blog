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
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
    modifyVars: themeVariables, // make your antd custom effective
  },
  distDir: 'build',
  target: 'serverless',
})
