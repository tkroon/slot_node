betNow = function(userId) {
  var message = "";
  //console.log("inside betNow");
  if(bet < (3 * betIncrement) && winTotal >= betIncrement) {
    bet += betIncrement;
    winTotal -= betIncrement;
    bell.play();
    state = "bet";
  }
  if (bet >= (3 * betIncrement) || winTotal <= 0) {
    message += '<font color="red">Maximum Bet  --  PULL PAW NOW!</font>';
    util.say('PULL PAW NOW')
  } else {
    message += 'Insert again pass -or- Pull paw'
  }
  mySocket.sockets.emit('messages', 'show|' + util.moneyFormat(bet) + "|" + util.moneyFormat(winTotal) + "|" + currentUser + "|" + message);
}

router.get('/bet/:userId', function(req, res, next) {
  var userId = req.param('userId');
  var message = "";
  win.stop();
  if(userId != 'none') {
    if(userId != currentUser) {
      util.initUser(userId, function(total) {
        winTotal = total;
        bet = 0;
        spins = 0;
        message += betNow(userId);
        //console.log("inside init callback");
      });
    } else if(spins >= maxSpins) {
      state = "gameover";
      message += '<font color="blue">Game Over, Cash-out -or- Play later</font>';
      mySocket.sockets.emit('messages', 'show|' + util.moneyFormat(bet) + "|" + util.moneyFormat(winTotal) + "|" + currentUser + "|" + message);
    } else {
      message += betNow(userId);
    }
  }
  res.json({"userId": userId, "bet": bet});
});

module.exports = router;