import path from 'path'
import fs from 'fs'
import less from 'less'
import autoprefixer from 'autoprefixer'

export default function compileLess (options, callback) {
  let env = process.env.NODE_ENV || 'development'
  let lessFile = path.resolve('./src/styles/index.less')
  let cssFile = path.resolve('./dist/ranger.css')
  let lessOptions = {
    filename: lessFile,
    globalVariables: {},
    sourceMap: {
      sourceMapFileInline: env === 'development'
    }
  }

  fs.readFile(lessFile, 'utf-8', (err, data) => {
    if (err) throw err

    less.render(data.toString('utf-8'), lessOptions, (err, css) => {
      if (err) throw err
      let results = autoprefixer.process(css.css).css

      fs.writeFile(cssFile, results, 'utf-8', (err) => {
        if (err) throw err
        console.log('CSS was successfully generated')
      })
    })

  })
};

compileLess();
