var util = require('./util.js');

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
    util.wait(3000);
  }
  stripled.setRgb(black);
  res.json({"result": "test done"})
});

router.get('/off', function(req, res, next) {
  stripled.setRgb(black);
  res.json({"result":"off"})
});

process.on('SIGINT', function () {
  stripled.close();
});

module.exports = router;