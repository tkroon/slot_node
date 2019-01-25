
var Promise = require('es6-promise').Promise;
http = require('http');
util = require('./util.js');

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

setRemotePaid = function(userId, host, port) {
  // Return a new promise.
    console.log("setRemotePaid - host: " + host);
    return new Promise(function(resolve, reject) {
      var options = {
        host: host,
        path: '/api/user/markPaid/' + userId,
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
          resolve('Done');
        })
      });
      req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
        resolve('Error');
      });
    });
  }
  
router.get('/user/markRemotePaid/:userId', function(req, res, next) {
  var userId = req.params.userId;
  var promises = [];
  activeHosts.forEach(function(host){
    promises.push(setRemotePaid(userId,host,port));
  });
  Promise.all(promises)
    .then(function(results) {
      res.send("Payment Complete -- scan a new ticket");
    })
  . catch(function(e) {
      console.log("An Error marking paid");
      res.send("Payment Error");
  })
});

router.get('/user/getTotal/:userId', function(req, res, next) {
  console.log("getting user total");
  var userId = req.params.userId;
  // add this requester to activeHosts if not already there
  if(activeHosts.indexOf(req.host) == -1)
    activeHosts.push(req.host);
  getuser.get(userId, function(err, row) {
    console.log(row);
    if (err) {
      console.log(err);
      res.json({"total": 0,"time": 0});
    }
    else if(row != undefined) {
      res.json({"total": row.winTotal,"time": row.time});
      if(currentUser == userId) {
        state="ready";
        bet=0;
        currentUser = 0;
      }
    } else {res.json({"total": 0, "time": 0});}
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
  mySocket.sockets.emit('messages', 'found|' + userId 
    + '|0|<span class="alert"><img v-align="middle" height="30" width="30" src="../../images/progress.gif"/> getting Total</span>');
  beep.play();
  var promises = [];
  activeHosts.forEach(function(host){
    promises.push(util.getRemoteTotal(userId,host,port));
  });
  Promise.all(promises)
    .then(function(results) {
      console.log("All done", results);
      var total = 0;
      var timestamp = 0;
      results.forEach(function(result){
        // get the max winnings from machine whith newest timestamp
        var intTotal = parseInt(result.total);
        var timestampRes = Date.parse(result.time);
        console.log("Timestamp: " + timestampRes);
        if (timestampRes > timestamp) {
          timestamp = timestampRes
          total = intTotal;
        }
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
       
router.get('/user/leaders', function(req, res, next) {
  util.getLeaderBoard()
});

module.exports = router;
