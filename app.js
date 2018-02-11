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
var app = express();

// slot machines
slotHosts = ['192.168.1.200', '192.168.1.201'];
port = 3000;

// configured values 
initialBank = 1000;
betIncrement = 100;
maxSpins = 1;
lanyardName = "Ticket";

//initialize
currentUser = 0;
spins = 0;
bet = 0;
state = "ready";
armstate = "up";
winTotal = 0;
lastCash = 0;
timer = null;
seqTimer = null;

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
});

server.listen(4200); 
module.exports = app;