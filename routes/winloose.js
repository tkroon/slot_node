setStatus = function(multiplier, dollars, total) {
  spins +=1;
  state="ready";
  status = util.getStatus(multiplier, dollars, total);
  bet=0;
  return status;
}

router.put('/pay/:multiplier', function(req, res, next) {
  //console.log("inside PAY");
  led.stopRandomFade(timer);
  spinsound.stop();
  win.stop();
  var dollars = 0;
  var multiplier = parseInt(req.params.multiplier);
  if(isNaN(multiplier)) {
    multiplier = 0;
  }

  // LOOSER
  if(multiplier == 0) {
    dollars = -bet;
        // price is right horn
    loose.stop();
    loose.play();
    led.setTo("blue", 100);
    util.wait(1000);
    led.fadeTo("black", 100, 4500);
  } else {
    dollars += bet;
    dollars = bet * multiplier;
        // JACKPOT
    if( multiplier > 99) {
      jackpot.stop();
      jackpot.play();
      util.wait(1000);
      champions.stop();
      champions.play();
      led.playLedSequence(celebrateseq.sequence);
    } else if (multiplier > 5) { // REGULAR WIN
      if (Math.round(Math.random())==1) {
        celebrate.stop();
        celebrate.play();
        led.playLedSequence(celebrateseq.sequence);
      } else {
        happy.stop();
        happy.play();
        led.playLedSequence(happyseq.sequence);
      } 
    } else { // BREAK EVEN
        winwoop.stop();
        winwoop.play();
        led.fadeTo("indigo",100,3000);
        led.fadeTo("black",100,2000);
      }
  }
  setTimeout(function(){ led.fadeTo("black",100,2000); }, 5000);
  util.resetPromo();

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
    //console.log("Total Win:  " + winTotal);
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