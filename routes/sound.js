var util = require('./util.js');
var Media = require('simple-mplayer');

global.win = new Media('public/sounds/champions_short.mp3');
global.beep = new Media('public/sounds/beep-07.mp3');
global.inmoney = new Media('public/sounds/wereinthemoney.mp3');
global.bell = new Media('public/sounds/1bell.mp3');
global.pullsound  = new Media('public/sounds/slot-machine-daniel_simon.mp3');
global.spinsound = new Media('public/sounds/spin.mp3');
global.winwoop = new Media('public/sounds/Woop Woop-SoundBible.com-198943467.mp3');
global.loose = new Media('public/sounds/the-price-is-right-losing-horn.mp3');
global.loose2 = new Media('public/sounds/gsmart01.mp3');
global.bugsgold = new Media('public/sounds/bugs30.mp3');
global.byebye = new Media('public/sounds/byebye.mp3');

// Routes for playing audio
router.get('/play/stop', function(req, res, next) {
  champions.stop();
});

router.get('/play', function(req, res, next) {
  champions.stop();
  champions.play();
});

// Routes for playing audio
router.get('/play/money', function(req, res, next) {
  inmoney.stop();
  inmoney.play();
});

module.exports = router;

/*
music.play({loop: 0}); // send "-loop 0" to MPlayer to loop the soundtrack forever 
 
setTimeout(function () {
    music.pause(); // pause the music after one seconds 
}, 1000);
 
setTimeout(function () {
    music.resume(); // and resume it two seconds after pausing 
}, 3000);
 
setTimeout(function () {
    music.stop(); // and stop definitely seven seconds after resuming 
}, 10000);

*/