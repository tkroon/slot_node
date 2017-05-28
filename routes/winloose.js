router.put('/pay/:multiplier', function(req, res, next) {
  var dollars = 0;
  var multiplier = parseInt(req.params.multiplier);
  if(isNaN(multiplier)) {
    res.json({"Error": "Multiplier is not an integer"});
  }
  else {
    if(multiplier == 0) {
      dollars = -bet;
    } else {
      dollars = bet * multiplier;
      updatewin.run(dollars, currentUser, function(err, row){
        if (err) {
          console.log(err);
          res.json({"Error": err});
        }
        else {
          util.getWinTotal(function(total) {
            winTotal = total;
            status = util.getStatus(multiplier, dollars, total);
            res.send("show|" + status);
            bet=0;
            state="ready";
          });
        }
      })
    }
  }
});

router.get('/winnings', function(req, res, next) {
  util.getWinTotal(function(winTotal) {
    console.log("Total Win:  " + winTotal);
    res.json({"win": winTotal});
  });
});

module.exports = router;