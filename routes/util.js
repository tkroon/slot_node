var Promise = require('es6-promise').Promise;

exports.wait = function(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
}

exports.say = function(words){
  var cp = require("child_process");
  var process = cp.spawn('/usr/bin/python',['util/talk.py','-t "' + words + '"']);
}

exports.selftest = function(){
  console.log("**** Self Test START ****");
  //bugsgold.play();
  led.fadeTo("red",100,5000);
  led.fadeTo("black",100,1000);
  led.fadeTo("green",50,2000);
  led.setTo("blue",50,2000);
  led.fadeTo("off",100,2000);
  console.log("**** Self Test COMPLETE ****");
}

exports.getWinTotal = function(callback) {
  getuser.get(currentUser, function(err, row){
    var total = 0;
    if (err) {
      console.log(err);
      return err;
    }
    else if(row === undefined) {
      console.log("can't find user data");
    } else {
      console.log("currentUser: " + currentUser + " Result: " + row.userId  + " - " + row.winTotal);
      total = row.winTotal;
    }
    winTotal = total;
    callback(total);
  })
  console.log("wintotal: " + global.winTotal)
}

exports.getStatus = function(multiplier, dollars, total)  {
  // bet|total|message
  var message = "0|" + util.moneyFormat(total) + "|" + currentUser + "|" + util.getSpinMessage(multiplier, dollars, total) + "|" + util.moneyFormat(lastCash) + "|" + util.moneyFormat(dollars);
  //console.log("debug: " + message);
  return message;
}

exports.getSpinMessage = function(multiplier, dollars, total)  {
  var dollarInt = parseInt(dollars);
  var totalInt = parseInt(total);
  var multiplierInt = parseInt(multiplier);
  var message = "";
  if (multiplier == 0)
  {
    message = "Lost " + util.moneyFormat(bet);
  } 
  else 
  {
    message = "Winner! " + multiplier + " x " + util.moneyFormat(bet) + " = <font color='green'>" + util.moneyFormat(dollars) + "</font>";
  }
  if (spins == maxSpins) {
    message = message + " - game over";
  } else {
    message = message + " (pull: " + spins + " of " + maxSpins + ")";
  }
  //console.log("<p>" + message + "</p>");
  return message;
}

exports.initUser = function(userId, callback) {
  currentUser = userId;
  getuser.get(userId, function(err, row){
    console.log(row);
    if (err) {
      console.log(err);
    }
    else if(row === undefined) {
      winTotal = initialBank;
      putuser.run(userId,winTotal);
      console.log("Inserted New User: " + userId)
    } else if(row.winTotal == 0) {
      winTotal = resetBank;
      updatewin.run(winTotal, userId);
    } else {
      winTotal = row.winTotal;
    }
    //console.log("inside initUser winTotal: " + winTotal);
    callback(winTotal);
  });
}

exports.moneyFormat = function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "$" + parts.join(".");
}

exports.armspin = function() {
  //console.log("bet: " + bet + " state: " + state);
  if( state == "bet" ){
    spinsound.stop();
    win.stop();
    spinsound.play(); 
    state="spinning";
    armstate="down";
    led.startRandomFade();
    mySocket.sockets.emit('messages', 'spin|'+  bet);
  } else if( state == "gameover") {
    util.say('Game over');
  } else if( state != "spinning" && bet ==0) {
    win.stop();
    util.resetPromo();
    util.say('Insert ' + lanyardName);
    mySocket.sockets.emit('messages', 'over||||Insert ' + lanyardName);
  }
}

exports.resetPromo = function() {
  background.stop();
  led.stopRandomFade();
  clearTimeout(promoTimer);
  promoTimer = setTimeout(function() {util.promo();}, promoDelay);
}

exports.promo = function() {
  util.resetPromo();
  background.play();
  led.startRandomFade(50,2000); // default is max bright 100, fade delay 500 so this is dimmer and slower
}

exports.getRemoteTotal = function(userId, host, port) {
  // Return a new promise.
    console.log("getRemoteTotal - host: " + host + ":"+ port + "-" + userId);
    return new Promise(function(resolve, reject) {
      var options = {
        host: host,
        path: '/api/user/getTotal/' + userId,
        port: port
      };
  
      var req =  http.get(options, function(res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
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

exports.maxRemoteWinnings = function(userId, callback) {
  var promises = [];
  var total = 0;
  slotHosts.forEach(function(host){
    if (host != myIp)
      promises.push(util.getRemoteTotal(userId,host,port));
  });
  Promise.all(promises)
    .then(function(results) {
      results.forEach(function(result){
        var intTotal = parseInt(result.total);
        if (intTotal > total) total = intTotal;
      })
      console.log("maxRemoteWinnings: " + total);
      callback(total);
    })
  . catch(function(e) {
      console.log("An Error");
  });
}