router.get('/bet/:userId', function(req, res, next) {
  var userId = req.param('userId');

  if(userId != 'none' && bet < (3 * betIncrement)) {
    if(userId != currentUser) {
      bet = betIncrement;
      currentUser = userId;
    } else {
      bet += betIncrement;
    }
    bell.play();
    state = "bet";
  }
  message ='<p>Current Bet: $' +  bet + '</p>';
  if (bet >= (3 * betIncrement)) {
    message += '<p><font color="red">Maximum Bet<p>PULL PAW NOW TO PLAY!</font></p>';
    util.say('PULL PAW NOW TO PLAY')
  } else {
    message += '<p>Insert lanyard again to bet more - or pull paw to spin.</p>'
  }
  mySocket.sockets.emit('messages', 'show|' + message +"|" + bet)
  res.json({"userId": userId, "bet": bet});
});

module.exports = router;