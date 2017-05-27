router.put('/pay/:multiplier', function(req, res, next) {
  var multiplier = parseInt(req.params.multiplier);
  if(isNaN(multiplier)) {
    res.json({"Error": "Multiplier is not an integer"});
  }
  else {
    var dollars = bet * multiplier;
    updatewin.run(dollars, currentUser, function(err, row){
      if (err) {
        console.log(err);
        res.json({"Error": err});
      }
      else {
        util.getWinTotal(function(total) {
          winTotal = total;
          res.send(util.getSpinMessage(multiplier, dollars, total));
          bet=0;
          state="ready";
        });
      }
    })
  }
});

router.get('/winnings', function(req, res, next) {
  util.getWinTotal(function(winTotal) {
    console.log("Total Win:  " + winTotal);
    res.json({"win": winTotal});
  });
});

module.exports = router;