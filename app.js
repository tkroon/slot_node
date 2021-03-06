process.title = 'slotMachine';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var index = require('./routes/index');
var api = require('./routes/api');
var ip = require("ip");
var app = express();

// slot machines
allHosts = ['192.168.1.200', '192.168.1.201'];
activeHosts = allHosts.slice();
port = 3000;

// configured values 
betIncrement = 100;
initialBank = betIncrement * 10;
resetBank = betIncrement * 3;
maxSpins = 5;
lanyardName = "Ticket";

//initialize
currentUser = 0;
spins = 0;
bet = 0;
state = "ready";
armstate = "up";
winTotal = 0;
lastCash = 0;
randomfadetimer = null;
seqTimer = null;
promoTimer = null;
hostTimer = null;
promoDelay = 1000 * 60 * 1.5; // 1000ms/sec * 60 sec/min * minutes delay before casino promo sounds
hostDelay = 1000 * 60 * 7; // 1000ms/sec * 60 sec/min * minutes delay before hosts are rescanned

// save socket variables
mySocket = io;
app.set('socketio', io);
app.set('server', server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api)
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io-client/dist')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

myIp = ip.address();

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', function(client) {  
    console.log('Client connected...');
    global.slotUi = client;
    util.promo();
    util.scanRemoteHosts();
});

server.listen(4200); 
module.exports = app;
