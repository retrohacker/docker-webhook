docker-webhook
===

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

Default port is `8411`, and can be changed by setting the `DOCKER_WEBHOOK_PORT` environment variable.
