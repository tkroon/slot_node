util = require('./util.js');
express = require('express');
Media = require('simple-mplayer');
var sqlite3 = require('sqlite3').verbose();
router = express.Router();
require('./util.js');
//require('./light.js');
require('./sound.js');
require('./bet.js');
require('./user.js');
require('./winloose.js');

var dbfile = "./slot.db";
var db = new sqlite3.Database(dbfile);
putuser = db.prepare('INSERT into users (userId, winTotal) values (?, ?)');
getuser = db.prepare('SELECT userId, winTotal from users where userId = ?')
updatewin = db.prepare('UPDATE users set winTotal = winTotal + ? where userId = ?;')
//updateloss = db.prepare('UPDATE users set winTotal = winTotal - ? where userId = ?;')

/******************** Arm setup *************/
/* pressed = 0 open = 1                     */
/* champions, beep, inmoney, bell, arm      */
/********************************************
var Gpio = require('onoff').Gpio,
armdown = new Gpio(18, 'in', 'falling');
armup = new Gpio(17, 'in', 'falling');

armdown.watch(function(err,value) {
  console.log("Arm down gpio 18 value: " + value);
  if( state == "bet" && armstate == "moving" && value == 0 ){
    spin.play({loop: 1}); 
    state="spinning";
    armstate="down";
  }
  mySocket.sockets.emit('messages', 'spin|'+  bet);
});

armup.watch(function(err,value) {
  console.log("Arm up gpio 17 value: " + value);
  if (value == 0) { // up
    armstate="up"
    pull.stop();
  }
  if( state = "bet" && armstate == "up" && value == 0 ) { // not up
    armstate = "moving"
    pull.play();
  }
  //global.mySocket.sockets.emit('messages', 'spin');
});

/********************* Routes ****************/
router.get('/', function(req, res, next) {
  // should respond with list of api
  res.send('respond with a resource');
});

router.get('/status', function(req, res, next) {
  //user = JSON.parse(util.getuser());
  util.getWinTotal(function(winTotal){ 
    res.render('status', { 
      betIncrement: betIncrement, 
      currentUser: currentUser, 
      bet: bet, 
      state: state, 
      armstate: armstate, 
      won: winTotal
    })
  });
});

router.get('/selftest', function(req, res, next) {
  selftest();
  res.send('testing');
});

util.selftest();

module.exports = router;