docker-webhook
===

[![Greenkeeper badge](https://badges.greenkeeper.io/retrohacker/docker-webhook.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/docker-webhook.png)](https://nodei.co/npm/docker-webhook/)

A simple node.js library for responding to pushes to the docker registry.

# Usage

Simply:

```
var webhook = require('docker-webhook')
webhook(function cb(json) {
  cosole.log(JSON.stringify(json,null," "))
})
```

Parse the url to check against an AUTH_TOKEN:

```
var webhook = require('docker-webhook')
var URL = require('url')

webhook(function cb(json, url) {
  var url_auth_token = URL.parse(url).path.substr(1)
  if( url_auth_token === process.env.AUTH_TOKEN ){
    // authorized to run hook commands
    cosole.log(JSON.stringify(json,null," "))
  }else{
    // unauthorized, do nothing
  }
})
```

Default port is `8411`, and can be changed by setting the `DOCKER_WEBHOOK_PORT` environment variable.
