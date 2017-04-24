var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

var Gpio = require('onoff').Gpio,
arm = new Gpio(18, 'in', 'falling');

var RgbChannel = require('rpi-rgb').Channel;
var Colour = require('rpi-rgb').Colour;
var stripled = new RgbChannel(2,5,4);
 
var red = new Colour(0,100,100);
var green = new Colour(100,0,100);
var blue = new Colour(100,100,0);
var white = new Colour(0,0,0);
var yellow = new Colour(0,0,100);
var black = new Colour(100,100,100);
var violet = new Colour(42,100,17);
var indigo = new Colour(71,100,49);
var orange = new Colour(0,50,100);
var rainbow = [violet,indigo,blue,green,yellow,orange,red];
var rainbow_names = ["violet","indigo","blue","green","yellow","orange","red"];

arm.watch(function(err,value) {
  console.log("Arm gpio 18 pressed");
  global.mySocket.sockets.emit('messages', 'spin');
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

router.get('/red', function(req, res, next) {
  stripled.setRgb(red);
  res.json({"result": "test done"})
});

router.get('/blue', function(req, res, next) {
  stripled.setRgb(blue);
  res.json({"result": "test done"})
});

router.get('/green', function(req, res, next) {
  stripled.setRgb(green);
  res.json({"result": "test done"})
});

router.get('/white', function(req, res, next) {
  stripled.setRgb(white);
  res.json({"result": "test done"})
});

router.get('/rainbow', function(req, res, next) {
  for(i=0; i < rainbow.length; i++) {
    stripled.setRgb(rainbow[i]);
    console.log(rainbow_names[i]);
    wait(3000);
  }
  stripled.setRgb(black);
  res.json({"result": "test done"})
});

router.get('/talk', function(req, res, next) {
  var cp = require("child_process");
  var process = cp.spawn('/usr/bin/python',['routes/talk.py']);
  res.json({"result": "test done"})
});

router.get('/test', function(req, res, next) {
  var util  = require('util'),
      spawn = require('child_process').spawn,
      ls    = spawn('ls', ['-lh', '/usr']);

  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  ls.on('exit', function (code) {
    console.log('child process exited with code ' + code);
  });
});

router.get('/off', function(req, res, next) {
  stripled.setRgb(black);
  res.json({"result":"off"})
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

process.on('SIGINT', function () {
  stripled.close();
});

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

/*
function setColor(color) {
  var colors = color.rgb().array();
  var pwm;
  for (thisColor in colors) {
    pwm[0++] = red.red.writeSync((thisColor/255)*100)
  }
  return pwm
}
*/ 

module.exports = router;