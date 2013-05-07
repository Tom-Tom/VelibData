var request = require('request')
  , express = require('express')
  , routes = require('./routes')
  , cons = require('consolidate')
  , http = require('http')
  , path = require('path')
;

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./tmp'}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/',routes.index);

io.sockets.on('connection', function (socket) { 
  request('https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      socket.emit('data', body);
    }
  })
});