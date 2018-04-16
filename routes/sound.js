var util = require('./util.js');
var Media = require('simple-mplayer');

global.champions = new Media('public/sounds/champions_short.mp3');
global.win = new Media('public/sounds/champions_short.mp3');
global.beep = new Media('public/sounds/beep-07.mp3');
global.inmoney = new Media('public/sounds/wereinthemoney.mp3');
global.bell = new Media('public/sounds/1bell.mp3');
global.pullsound  = new Media('public/sounds/slot-machine-daniel_simon.mp3');
//global.spinsound = new Media('public/sounds/spin.mp3');
global.winwoop = new Media('public/sounds/Woop Woop-SoundBible.com-198943467.mp3');
global.loose = new Media('public/sounds/the-price-is-right-losing-horn.mp3');
global.loose2 = new Media('public/sounds/gsmart01.mp3');
global.bugsgold = new Media('public/sounds/bugs30.mp3');
global.byebye = new Media('public/sounds/byebye.mp3');
global.celebrate = new Media('public/sounds/celebrate.mp3');
global.happy = new Media('public/sounds/happy.mp3');
global.jackpot = new Media('public/sounds/jackpot.mp3');
global.background = new Media('public/sounds/background_casino.mp3')

// Routes for playing audio
router.get('/play/stop', function(req, res, next) {
  champions.stop();
});

router.get('/play', function(req, res, next) {
  jackpot.stop();
  jackpot.play();
  util.wait(1000);
  champions.stop();
  champions.play();
});

// Routes for playing audio
router.get('/play/woop', function(req, res, next) {
  winwoop.stop();
  winwoop.play();
});

// Routes for playing audio
router.get('/sound/:sound/:action', function(req, res, next) {
  var soundname = req.params.sound;
  var action = req.params.action;

  var sound = eval(soundname);
  sound.stop();

  if (action.indexOf('loop') !== -1) {
      sound.play({loop: 0}); // sound.play({loop: 0}) //send "-loop 0" to MPlayer to loop the soundtrack forever 
  } else if (action.indexOf('play') !== -1) {
      sound.play();
  }
});

module.exports = router;