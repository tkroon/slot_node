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

exports.getSpinMessage = function(multiplier, dollars, total)  {
  dollarInt = parseInt(dollars);
  totalInt = parseInt(total);
  multiplierInt = parseInt(multiplier);
  if (multiplier == 0)
  {
    message = "<p>You LOOSE!</p>";
  } 
  else 
  {
    message = "<p>Won: $" + dollars + "</p>";
  }

  message = message +  "<p>Total: $" + total + "</p>";
  console.log(message);

  return message;
}
