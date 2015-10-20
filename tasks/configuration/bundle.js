import fs from 'fs'
import path from 'path'
import rollup from 'rollup'

export default (function scripts () {
  let entryFile = path.resolve('./src/scripts/index.js')
  let outputFile = path.resolve('./dist/ranger-es6.js')
  let options = {
    entry: entryFile
  }

  rollup.rollup(options).then(bundle => {
    let result = bundle.generate({
      format: 'umd',
      moduleName: 'Ranger',
      moduleId: 'ranger',
      sourceMap: true,
      sourceMapFile: entryFile
    })

    result.map.file
    result.map.sources

    fs.writeFileSync( outputFile, result.code +
      '\n//# sourceMappingURL=bundle.js.map' )
    fs.writeFileSync(outputFile + '.map', result.map.toString())
  })
})()
