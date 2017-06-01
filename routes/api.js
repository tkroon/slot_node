util = require('./util.js');
led = require('./led.js');
express = require('express');
Media = require('simple-mplayer');
var sqlite3 = require('sqlite3').verbose();
router = express.Router();
require('./util.js');
//require('./led_test.js');
require('./sound.js');
require('./bet.js');
require('./user.js');
require('./winloose.js');

var dbfile = "./slot.db";
var db = new sqlite3.Database(dbfile);
putuser = db.prepare('INSERT into users (userId, winTotal, payout) values (?, ?, 0)');
getuser = db.prepare('SELECT userId, winTotal from users where userId = ?')
updatewin = db.prepare('UPDATE users set winTotal = winTotal + ? where userId = ?;')
payout = db.prepare('UPDATE users set winTotal = 500, payout = payout + winTotal where userId = ?;')

/******************** Arm setup *******************/
/* pressed = 0 (down or up) open = 1  in between  */
/* champions, beep, inmoney, bell, arm            */
/**************************************************
var Gpio = require('onoff').Gpio,
armdown = new Gpio(18, 'in', 'falling');
armup = new Gpio(17, 'in', 'both');

armdown.watch(function(err,value) {
  console.log("Arm down gpio 18 value: " + value);
  if(value == 0) {
    if( state == "bet" ){
      pullsound.stop();
      spinsound.stop();
      win.stop();
      spinsound.play({loop: 5}); 
      state="spinning";
      armstate="down";
      //spins += 1;
      mySocket.sockets.emit('messages', 'spin|'+  bet);
    } else if( state == "gameover") {
      util.say('Game over play again later');
    } else {
      win.stop();
      util.say('No bet, Insert Pass below then pull');
    }
  }
});

armup.watch(function(err,value) {
  console.log("Arm up gpio 17 value: " + value);
  if (value == 0) { // up
    armstate="up"
    pullsound.stop();
  }
  if( state = "bet" && armstate == "up" && value == 1 ) { // not up
    armstate = "moving"
    pullsound.stop();
    pullsound.play();
  }
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
      won: winTotal,
      spins: spins
    })
  });
});

router.get('/selftest', function(req, res, next) {
  selftest();
  res.send('testing');
});

util.selftest();

module.exports = router;