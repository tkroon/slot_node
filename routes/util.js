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
  var message = "0|" + util.moneyFormat(total) + "|" + currentUser + "|" + util.getSpinMessage(multiplier, dollars, total);
  return message;
}

exports.getSpinMessage = function(multiplier, dollars, total)  {
  var dollarInt = parseInt(dollars);
  var totalInt = parseInt(total);
  var multiplierInt = parseInt(multiplier);
  var message = "";
  if (multiplier == 0)
  {
    message = "Lost " + util.moneyFormat(bet) + " bet SORRY";
  } 
  else 
  {
    message = "Winner! " + multiplier + " x " + util.moneyFormat(bet) + " = <font color='green'>" + util.moneyFormat(dollars) + "</font>";
  }
  message = message + " (spins: " + (maxSpins - spins) + ")";
  console.log("<p>" + message + "</p>");

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