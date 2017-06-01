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
        putuser.run(userId, initialBank);
        winTotal = initialBank;
        currentUser = userId;
        res.json({"userId": userId, "winTotal": 0, "currentUserId": currentUserId});
        global.mySocket.sockets.emit('messages', 'spin');
    } else {
      res.json({"userId": row.userId, "winTotal": row.winTotal, "currentUserId": currentUserId});
      global.mySocket.sockets.emit('messages', 'spin');
    }
  })
});

router.put('/user/markpaid/:userId', function(req, res, next) {
  var userId = req.param('userId');
  payout.run(userId);
  res.send("Payment Complete");
});

router.get('/user/payout/:userId', function(req, res, next) {
  var userId = req.param('userId');
    getuser.get(userId, function(err, row){
      console.log(row);
      if (err || row == undefined) {
        console.log("can't find gambler");
        mySocket.sockets.emit("messages", "message|Can't find student ID -- scan another pass");
        res.json({'message': 'failed to find student id'});
      } else {
        mySocket.sockets.emit('messages', 'payout|' + userId + "|" + util.moneyFormat(row.winTotal));
        res.json({'message': 'gambler payout returned'});
      }
    })
});

module.exports = router;