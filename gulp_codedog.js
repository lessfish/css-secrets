const through = require('through2')
const codedog = require('codedog')
const path = require('path')

module.exports = function() {
  var stream = through.obj(function(file, encoding, callback) {
    // 修改内容
    file.contents = new Buffer(codedog(file.contents.toString()))

    // 修改后缀
    let filePath = path.parse(file.path)
    filePath.base = filePath.base.replace(/md/, 'html')
    file.path = path.format(filePath)

    // 确保文件会传给下一个插件
    this.push(file)

    // 告诉 stream 引擎，已经处理完成
    callback()
  })
  
  return stream
}