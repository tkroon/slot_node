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

module.exports = router;