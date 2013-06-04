var request = require('request')
  , express = require('express')
  , routes = require('./routes')
  , cons = require('consolidate')
  , http = require('http')
  , path = require('path')
;

request('https://api.mongolab.com/api/1/databases?apiKey=TOyfmKVcgZnJ_818MLeRH9H4sX5zwSTL', function (error, response) {
  if (!error && response.statusCode == 200) {
    console.log(response);
  }
});

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
  });
  send();
});


function send(){
  var totalBikeAvailable = 0;
  var totalStandAvailable = 0;
  var totalStand = 0;
  var temp = eval("{"+DATAVELIB+"}");
  for(velib in temp){
    totalBikeAvailable = totalBikeAvailable + temp[velib].available_bikes;
    totalStandAvailable = totalStandAvailable + temp[velib].available_bike_stands;
    totalStand = totalStand + temp[velib].bike_stands;
  }
  var percentBike = Math.round(100 * totalBikeAvailable / totalStand);
  var percentStand = Math.round(100 * totalStandAvailable / totalStand);
  var percentBroken = 100 - percentBike - percentStand;
  var obj = {
    totalBikeAvailable : totalBikeAvailable,
    totalStandAvailable : totalStandAvailable,
    totalStand : totalStand,
    percentBike: percentBike,
    percentStand : percentStand,
    percentBroken : percentBroken
  }
  io.sockets.emit('nb',obj);
}
DATAVELIB = apiVelib();

function apiVelib(){
  request('https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      DATAVELIB = body;
      return body;
    }
  })
}
apiVelib();
setInterval(send, 10000);
setInterval(apiVelib, 6000);