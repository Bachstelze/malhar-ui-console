/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var gulp = require('gulp');

var connect = require('connect');
var http = require('http');
var opn = require('opn');
var livereload = require('connect-livereload');
var httpProxy = require('http-proxy');
var config = require('./../config');

// Set up the proxy that goes to the gateway
var proxy = httpProxy.createProxyServer({
  target: {
    host: config.gateway.host,
    port: config.gateway.port
  }
});


// proxy Gateway REST API calls
function gatewayMiddleware(req, res, next) {
  if (req.originalUrl.indexOf('/ws/') === 0) {
    proxy.proxyRequest(req, res);
  } else {
    next();
  }
}

function startServer(baseDirs, port, next) {
  var app = connect();

  //app.use(livereload({port: 35779}));
  //app.use(livereload());
  console.log('_used');

  baseDirs.forEach(function (dir) {
    app.use(connect.static(dir));
  });

  app.use(gatewayMiddleware);

  //app.use(livereload());

  var server = http.createServer(app);

  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  var url = 'http://localhost:' + port;

  server.listen(port, next)
    .on('listening', function () {
      console.log('Started connect web server on ' + url);
    });

  opn(url);
}

gulp.task('connect', function (next) {
  startServer(['app', '.tmp'], 9000, next);
});

gulp.task('connect:dist', function () {
  startServer(['dist'], 9001);
});



