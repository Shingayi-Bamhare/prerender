#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender({
    workers: process.env.PRERENDER_NUM_WORKERS,
    iterations: process.env.PRERENDER_NUM_ITERATIONS
});

server.use(prerender.sendPrerenderHeader());
// server.use(prerender.basicAuth());

if (process.env.ALLOWED_DOMAINS) {
  console.log('Whitelist enabled for domains', process.env.ALLOWED_DOMAINS);
  server.use(prerender.whitelist());
}

server.use(prerender.blacklist());
server.use(prerender.logger());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
// server.use(prerender.inMemoryHtmlCache());

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.S3_BUCKET_NAME) {
  console.log('S3 cache enabled, Using bucket', process.env.S3_BUCKET_NAME);
  server.use(prerender.s3HtmlCache());
}


server.start();
