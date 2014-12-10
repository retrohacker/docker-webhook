var http = require('http')
var port = process.env.DOCKER_WEBHOOK_PORT || 8411

var m = module.exports = function init(cb) {
  this.cb = cb || function() {}
  var server = http.createServer(function endpoint(req,res) {
    var body = ""
    req.on('data',function(data) {
      body+=data
    })
    req.on('end',function() {
      res.end()
      try {
        body = JSON.parse(body)
      } catch(e) {return null}
      cb(body)
    })
  })
  server.on('close', function() {
    console.log("Docker webhook shutdown")
  })
  server.listen(port)
  console.log("Docker webhook started on "+port)
}

m.prototype = new Object(Object.prototype)
m.prototype.constructor = m
