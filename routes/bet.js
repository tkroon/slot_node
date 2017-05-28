router.get('/bet/:userId', function(req, res, next) {
  var userId = req.param('userId');
  var message = "";
  if(userId != 'none' && userId != currentUser)
  {
    util.initUser(userId);
    bet = 0;
  }
  if(userId != 'none' && bet < (3 * betIncrement) && winTotal >= betIncrement) {
    bet += betIncrement;
    winTotal -= betIncrement;
    //tjk bell.play();
    state = "bet";
  }
  //message ='<p>Current Bet: $' +  bet + '</p>';
  if (bet >= (3 * betIncrement) || winTotal <= 0) {
    message += '<p><font color="red">Maximum Bet<p>PULL PAW NOW TO PLAY!</font></p>';
    //tjk util.say('PULL PAW NOW TO PLAY')
  } else {
    message += '<p>Insert lanyard to bet - or pull paw to spin.</p>'
  }
  mySocket.sockets.emit('messages', 'show|' + util.moneyFormat(bet) + "|" + util.moneyFormat(winTotal) + "|" + message)
  res.json({"userId": userId, "bet": bet});
});

module.exports = router;