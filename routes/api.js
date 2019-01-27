util = require('./util.js');
led = require('./led.js');
express = require('express');
Media = require('simple-mplayer');
var sqlite3 = require('sqlite3').verbose();
router = express.Router();
require('./util.js');
require('./led_test.js');
require('./sound.js');
require('./bet.js');
require('./user.js');
require('./winloose.js');

var dbfile = "./slot.db";
db = new sqlite3.Database(dbfile);
putuser = db.prepare('INSERT into users (userId, winTotal, payout, time) values (?, ?, 0, CURRENT_TIMESTAMP)');
getuser = db.prepare('SELECT userId, winTotal, time from users where userId = ?')
updatewin = db.prepare('UPDATE users set winTotal = winTotal + ?, time = CURRENT_TIMESTAMP where userId = ?;')
payout = db.prepare('UPDATE users set winTotal = 0, payout = payout + winTotal,time = CURRENT_TIMESTAMP where userId = ?;')
settotal = db.prepare('UPDATE users set winTotal = ?, time = CURRENT_TIMESTAMP where userId = ?;')
getuserimage = db.prepare('SELECT imageName from image_lookup where userId = ?')
gettopwinners = 'SELECT users.payout, image_lookup.imageName from users, image_lookup where users.userId = image_lookup.userId order by payout desc limit 5';

/******************** Arm setup *******************/
/* pressed = 0 (down or up) open = 1  in between  */
/* champions, beep, inmoney, bell, arm            */
/**************************************************/
var Gpio = require('onoff').Gpio,
armdown = new Gpio(18, 'in', 'falling');
armup = new Gpio(17, 'in', 'both');

armdown.watch(function(err,value) {
  //console.log("Arm down gpio 18 value: " + value);
  if(value == 0) {
    util.armspin();
  }
});

armup.watch(function(err,value) {
  //console.log("Arm up gpio 17 value: " + value);
  if (value == 0) { // up
    armstate="up"
    pullsound.stop();
  }
  if( state == "bet" && armstate == "up" && value == 1 ) { // not up
    pullsound.play();
    armstate = "moving"    
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

router.get('/leaders', function(req, res, next) {
  util.getLeaderBoard(function(result) { 
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  });
});

router.get('/selftest', function(req, res, next) {
  selftest();
  res.send('self test');
});

router.get('/spin', function(req, res, next) {
  util.armspin();
  res.send('spin');
});

util.selftest();

module.exports = router;