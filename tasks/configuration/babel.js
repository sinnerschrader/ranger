import path from 'path'
import fs from 'fs'

export default (function transform () {
  let srcFile = path.resolve('./dist/ranger-es6.js')
  let transformedFile = path.resolve('./dist/ranger.js')
  let babel = require('babel-core')
  let options = {
    sourceRoot: path.resolve('./dist')
  }

  babel.transformFile(srcFile, options, (err, result) => {
    if (err) console.error(err)

    fs.writeFile(transformedFile, result.code, err => {
      if (err) console.error(err)

      console.log('The script file was successfully transformed')
    })

  })
})()
