setStatus = function(multiplier, dollars, total) {
  bet=0;
  spins +=1;
  state="ready";
  status = util.getStatus(multiplier, dollars, total);
  console.log("in setStatus");
  return status;
}

router.put('/pay/:multiplier', function(req, res, next) {
  console.log("inside PAY");
  spinsound.stop();
  win.stop();
  var dollars = 0;
  var multiplier = parseInt(req.params.multiplier);
  if(isNaN(multiplier)) {
    multiplier = 0;
  }

  if(multiplier == 0) {
    dollars = -bet;
  } else {
    dollars = bet * multiplier;
  }

  // add switch or function here to analyze multiplier and play more 
  // amped up music the higher the multiplier is.
  // Play looser music when multiplier = 0
  win.play();
  led.setTo("green",50);
  setTimeout(function(){ led.fadeTo("black",100,2000); }, 5000);

  updatewin.run(dollars, currentUser, function(err, row){
    if (err) {
      console.log(err);
      res.send("show|" + setStatus(multiplier, dollars, total));
    }
    else {
      util.getWinTotal(function(total) {
        winTotal = total;
        res.send("show|" + setStatus(multiplier, dollars, total));
      });
    }
  });
});

router.get('/winnings', function(req, res, next) {
  util.getWinTotal(function(winTotal) {
    console.log("Total Win:  " + winTotal);
    res.json({"total": winTotal});
  });
});

router.get('/paid/:userId', function(req, res, next) {
    updatewin.run(1000, userId, function(err, row){
      if (err) {
        console.log(err);
        res.json({"Error": err});
      }
      else {
        res.json({"Result": "success", "userId": userId});
      }
    });
});

module.exports = router;