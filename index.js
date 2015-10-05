var http = require('http')
var attempt = require('attempt')
var port = process.env.DOCKER_WEBHOOK_PORT || 8411
var url = require('url')
var exec = require('child_process').exec

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
      if(body.callback_url)
        callback(body.callback_url)
      cb(body, req.url)
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

var attemptOpts = {
  retries: 150,
  interval: 2000,
  factor: 1.2
}
function callback(cb_url) {
  var scrub_url = url.parse(cb_url)
  var opts = {
    host: scrub_url.hostname,
    port: scrub_url.port || 80,
    path: scrub_url.path
  }
  if( opts.host !== "registry.hub.docker.com" ||
      opts.port !== 80 ||
      opts.path.indexOf("/u/iojs/build/hook/") !== 0) {
      return; //callback url is not valid.
  }
  attempt(function() {
    var cb = this
    var json = '{\\"state\\":\\"success\\"}'
    exec('curl -d '+json+' -X POST '+cb_url,function(e,stdout,stderr) {
      if(e) return cb(e)
      cb()
    })
  },attemptOpts,function(e) {
    if(e) {
      console.log(e)
      process.exit(1)
    }
  })
}
