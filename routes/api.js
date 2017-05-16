express = require('express');
var sqlite3 = require('sqlite3').verbose();
router = express.Router();
require('./util.js');
require('./light.js');
require('./sound.js');

var Gpio = require('onoff').Gpio,
arm = new Gpio(18, 'in', 'falling');
armstart = new Gpio(17, 'in', 'falling');

arm.watch(function(err,value) {
  console.log("Arm down gpio 18 pressed");
  global.mySocket.sockets.emit('messages', 'spin');
});

armstart.watch(function(err,value) {
  console.log("Arm UPDATE gpio 17 pressed");
  //global.mySocket.sockets.emit('messages', 'spin');
});

var dbfile = "./slot.db";
var db = new sqlite3.Database(dbfile);
var putuser = db.prepare('INSERT into users (userId, winTotal) values (?, 0)');
var getuser = db.prepare('SELECT userId, winTotal from users where userId = ?')
var updatewin = db.prepare('UPDATE users set winTotal = winTotal + ? where userId = ?;')
var currentUserId = 0;

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/user/:userId', function(req, res, next) {
  var userId = req.param('userId');
  currentUserId = userId;
  getuser.get(userId, function(err, row){
    console.log(row);
    if (err) {
      console.log(err);
      res.json({"Error": err});
    }
    else if(row === undefined) {
        putuser.run(userId);
        currentUserId = userId;
        res.json({"userId": userId, "winTotal": 0, "currentUserId": currentUserId});
        global.mySocket.sockets.emit('messages', 'spin');
    } else {
      res.json({"userId": row.userId, "winTotal": row.winTotal, "currentUserId": currentUserId});
      global.mySocket.sockets.emit('messages', 'spin');
    }
  })
});

router.put('/winnings/:userId/win/:dollars', function(req, res, next) {
  var userId = req.param('userId');
  if (userId == undefined) {
    userId = currentUserId;
  }
  var dollars = parseInt(req.param('dollars'));
  if(isNaN(dollars)) {
    res.json({"Error": "Dollars is not an integer"});
  }
  else {
    updatewin.run(dollars, userId, function(err, row){
      if (err) {
        console.log(err);
        res.json({"Error": err});
      }
      else {
        res.json({"userId": userId});
      }
    })
  }
});

router.get('/winnings/:userId', function(req, res, next) {
  var userId = req.param('userId');
  if (userId == undefined) {
    userId = currentUserId;
  }
  getuser.get(userId, function(err, row){
    if (err) {
      console.log(err);
      res.json({"Error": err});
    }
    else if(row === undefined) {
        res.json({"userId": userId, "winTotal": 0});
    } else {
      res.json({"userId": row.userId, "winTotal": row.winTotal});
    }
  })
});

module.exports = router;