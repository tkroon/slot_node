exports.wait = function(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
}

exports.say = function(words){
  var cp = require("child_process");
  var process = cp.spawn('/usr/bin/python',['util/talk.py','-s '+ words]);
}

exports.selftest = function(){
  //bugsgold.play();
  console.log("**** Self Test complete ****");
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
  var message = "0|" + util.moneyFormat(total) + "|" + util.getSpinMessage(multiplier, dollars, total);
  return message;
}

exports.getSpinMessage = function(multiplier, dollars, total)  {
  var dollarInt = parseInt(dollars);
  var totalInt = parseInt(total);
  var multiplierInt = parseInt(multiplier);
  var message = "";
  if (multiplier == 0)
  {
    message = "Lost $" + util.moneyFormat(bet) + " Bet Sorry";
  } 
  else 
  {
    message = "Winner! " + multiplier + " x " + util.moneyFormat(bet) + " = <font color='green'>" + util.moneyFormat(dollars) + "</font>";
  }
  //message = message +  "<br/>Total: $" + util.moneyFormat(total);
  console.log("<p>" + message + "</p>");

  return message;
}

exports.initUser = function(userId) {
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
    });
}

exports.moneyFormat = function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "$" + parts.join(".");
}