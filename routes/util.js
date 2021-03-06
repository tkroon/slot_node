var fs = require('fs');
var im = require('imagemagick');
var cp = require("child_process");
var Promise = require('es6-promise').Promise;

var imgpath = 'public/images/';
var mugpath = imgpath + 'seniors/'

exports.wait = function(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
}

exports.say = function(words){
  cp.spawn('/usr/bin/python',['util/talk.py','-t "' + words + '"']);
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
  getuser.get(currentUser, function(err, row) {
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

    var mugimage = "";
    var slot_tape_default = imgpath + 'slot_tape_2019.png';
    var slot_tape = imgpath + "slot_tape.png";

    getuserimage.get(userId, function(err, row){
      //console.log("Mug row: " + row);
      if (err) {
        console.log(err.message);
        callback(winTotal);
      }
      else if(row != undefined) {
        mugimage = row.imageName;
        var playermug = mugpath + mugimage;
        console.log("playermug: " + playermug);
      }
      if (mugimage != "" && fs.existsSync(playermug)) {
        // use player's shield image
        child = cp.spawn('cp',[playermug, slot_tape]);
      } else {
        // copy default image into tape
        child = cp.spawn('cp',[slot_tape_default, slot_tape]);
      }
      child.on('exit', function (code, signal) {
        console.log('child process exited with');
        callback(winTotal);
      });
    });
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
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks);
          console.log('RESPONSE: ' + body);
          var parsed = JSON.parse(body);
          parsed.host = host;
          resolve(parsed);
        })
      });
  
      req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
        resolve(JSON.parse('{"total": 0, "inactivehost": "' + host +'"}'));
      });
    });
  }

// called from each bet when user changes
exports.maxRemoteWinnings = function(userId, callback) {
  var promises = [];
  var total = 0;
  activeHosts.forEach(function(host){
    if (host != myIp)
      promises.push(util.getRemoteTotal(userId,host,port));
  });
  Promise.all(promises)
    .then(function(results) {
      results.forEach(function(result){
        var intTotal = parseInt(result.total);
        if (intTotal > total) total = intTotal;
        // remove inactive host
        if (total == 0 && result.hasOwnProperty('inactivehost')) {
          const index = activeHosts.indexOf(result.inactivehost)
          activeHosts.splice(index, 1);
        }
      })
      //console.log("maxRemoteWinnings: " + total);
      //console.log("All Hosts: " + allHosts.toString());
      //console.log("Active Hosts: " + activeHosts.toString());
      callback(total);
    })
  . catch(function(e) {
      console.log("An Error");
      callback(0);
  });
}


exports.getLeaderBoard = function(callback) {
  db.all(gettopwinners, function(err, rows) {
    var leaders = '{"leaders":[';
    rows.forEach(function (row) {
      var playermug = mugpath + row.imageName; 
      console.log("Payout: " + row.payout + " Player: " + playermug);
      leaders += '{"payout": "' + row.payout + '", "image": "' + playermug +'"},';
    })
    leaders = leaders.substring(0,leaders.length-1);
    leaders += ']}'
    callback(JSON.parse(leaders))
  });	
}

exports.scanRemoteHosts = function() {
  setTimeout(function() {util.scanRemoteHosts();}, hostDelay);
  var promises = [];
  allHosts.forEach(function(host){
    if (host != myIp)
        promises.push(util.getRemoteTotal(1,host,port));
  });
  Promise.all(promises)
    .then(function(results) {
        //console.log("check1");
        results.forEach(function(result){
          //console.log("check2");
          if (result.hasOwnProperty('inactivehost')) {
            const index = activeHosts.indexOf(result.inactivehost)
            if(index != -1)
              activeHosts.splice(index, 1);
          }  else {
            if(activeHosts.indexOf(result.host) == -1)
              activeHosts.push(result.host);
          }
        })
        //console.log("All Hosts: " + allHosts.toString());
        //console.log("Active Hosts: " + activeHosts.toString());
      return 1;
    })
    .catch(function(e) {
      console.log("An Error: " + e.message);
      return 0;
  });
}
