//引入express中间件
var express = require('express')
var proxyMiddleWare = require('http-proxy-middleware')
var app = express()
var proxyPath = 'http://192.168.133.27:3001' //目标后端服务地址
var proxyOption = {
  target: proxyPath,
  changeOrigoin: true,
  ws: true,
  pathRewrite: { '^/api_dev': '/' }
}

//指定启动服务器到哪个文件夹，我这边指的是dist文件夹
app.use(express.static('./dist'))

app.use(proxyMiddleWare(proxyOption))

//监听端口为9528
var server = app.listen(9528, function() {
  var host = server.address().address
  var port = server.address().port
  // console.log('Example app listening at http://%s:%s', host, port)
})
