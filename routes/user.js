var http = require('http');

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

getRemoteTotal = function(userId, host, port) {
// Return a new promise.
  console.log("getRemoteTotal - host: " + host);
  return new Promise(function(resolve, reject) {
    var options = {
      host: host,
      path: '/api/user/getTotal/' + userId,
      port: port
    };

    var req =  http.get(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks);
        console.log('RESPONSE: ' + body);
        var parsed = JSON.parse(body);
        resolve(parsed);
      })
    });

    req.on('error', function(e) {
      console.log('ERROR: ' + e.message);
      resolve(JSON.parse('{"total": 0}'));
    });
  });
}

router.get('/user/getTotal/:userId', function(req, res, next) {
  console.log("getting user total");
  var userId = req.param('userId');
  getuser.get(userId, function(err, row){
    console.log(row);
    if (err) {
      console.log(err);
      res.json({"total": 0});
    }
    else if(row != undefined) {
      res.json({"total": row.winTotal});
    } else {res.json({"total": 0});}
  });
});

router.get('/user/markPaid/:userId', function(req, res, next) {
  var userId = req.params.userId;
  payout.run(userId);
  res.send("Payment Complete");
});

router.get('/user/payout/:userId', function(req, res, next) {
  console.log("inside payout");
  var userId = req.params.userId;
  beep.play();
  var promises = [];
  slotHosts.forEach(function(host){
    promises.push(getRemoteTotal(userId,host,port));
  });
  Promise.all(promises)
    .then(function(results) {
      console.log("All done", results);
      var total = 0;
      results.forEach(function(result){
        var intTotal = parseInt(result.total);
        total += intTotal;
      })
      console.log("Total: " + total);
      if(total > 0) {
        mySocket.sockets.emit('messages', 'payout|' + userId + "|" + util.moneyFormat(total));
        res.json({'message': 'gambler payout returned'});
      } else if(total == 0) {
        mySocket.sockets.emit('messages', 'message|' + userId + "|" + util.moneyFormat(total) + "|No winnings found -- Scan another pass");
        res.json({'message': 'No winnings found -- Scan another pass'});
      } else {
        mySocket.sockets.emit('messages', 'message|-|0|No winnings found -- Scan another pass');
        res.json({'message': 'No winnings found -- Scan another pass'});
      }
    })
  . catch(function(e) {
      console.log("An Error");
      res.json({'message': 'No Slot winnings found'});
  });
  
});      
        
module.exports = router;
