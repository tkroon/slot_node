betNow = function(userId) {
  var message = "";
  //console.log("inside betNow");
  if(bet < (3 * betIncrement) && winTotal >= betIncrement) {
    bet += betIncrement;
    if (bet == betIncrement) {
      // only reset lastCash if this is the first bet of a spin
      lastCash = winTotal;
    }
    winTotal -= betIncrement;
    //bell.play();
    state = "bet";
  }
  if (bet >= (3 * betIncrement) || winTotal <= 0) {
    message += '<font color="red">Maximum Bet  --  PULL PAW!</font>'; // (bet: ' + util.moneyFormat(bet) + ')';
    util.say('MAX BET ' + bet + ' PULL PAW')
  } else {
    util.say('BET ' + bet)
    message += 'Insert ' + lanyardName + ' again -or- PULL PAW'; //  (bet: ' + util.moneyFormat(bet) + ")";
  }
  mySocket.sockets.emit('messages', 'show|' + util.moneyFormat(bet) + "|" + util.moneyFormat(winTotal) + "|" + currentUser + "|" + message + "|" + util.moneyFormat(lastCash) + "|0");
}

router.get('/bet/:userId', function(req, res, next) {
  var userId = req.param('userId');
  var message = "";
  win.stop();
  util.resetPromo();
  if(userId != 'none') {
    if(userId != currentUser) {
      util.initUser(userId, function(total) {
        winTotal = total;
        lastCash = total;
        bet = 0;
        spins = 0;
        message += betNow(userId);
        //console.log("inside init callback");
      });
    } else if(spins >= maxSpins) {
      lastCash = winTotal;
      state = "gameover";
      message += '<font color="blue">Game Over - Cashout ' + util.moneyFormat(winTotal) + ' at bank</font>';
      byebye.stop();
      byebye.play();
      mySocket.sockets.emit('messages', 'over|' + util.moneyFormat(bet) + "|" + util.moneyFormat(winTotal) + "|" + currentUser + "|" + message + "|" + util.moneyFormat(lastCash) + "|0");
    } else {
      message += betNow(userId);
    }
  }
  res.json({"userId": userId, "bet": bet});
});

module.exports = router;