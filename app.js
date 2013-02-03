/**
 * Read dropbox key and secret from the command line.
 */

var app_key    = process.argv[2],
    app_secret = process.argv[3];

if (!app_key || !app_secret) {
  console.log("Usage: node app.js <dropbox key> <dropbox secret>");
  process.exit(1);
}

/**
 * Module dependencies.
 */

var express = require('express')
  , http    = require('http')
  , stylus  = require('stylus')
  , nib     = require('nib')
  , path    = require('path')
  , dbox    = require('dbox');

var app = express();

/**
 * Use nib, a set of mixins for stylus
 */

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

/**
 * Application configuration
 */

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(stylus.middleware({
      src: __dirname + '/public'
    , compile: compile
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.set('url', 'http://localhost:3000')
});

/**
 * Dropbox client
 */

dropbox = dbox.app({ "app_key": app_key, "app_secret": app_secret });

/**
 * Routes
 */

require('./routes')(app, dropbox);

/**
 * Server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
