router.get('/led/:color/setrgb', function(req, res, next) {
  led.setRgb(req.params.color);
  res.json({"result": "setrgb done"})
});

router.get('/led/:color/setto/:bright', function(req, res, next) {
  led.setTo(req.params.color,req.params.bright);
  res.json({"result": "setTo done"})
});

router.get('/led/:color/fadeto/:bright/fade/:time', function(req, res, next) {
  led.fadeTo(req.params.color,req.params.bright,req.params.time);
  res.json({"result": "fadeTo to done"})
});

router.get('/led/rainbow', function(req, res, next) {
  led.rainbow();
  res.json({"result": "rainbow done"})
});

router.get('/led/off', function(req, res, next) {
  led.off();
  res.json({"result":"off"})
});

// Routes for playing audio
router.post('/led/sequence', function(req, res, next) {
  sequence=req.body.sequence;
  happy.stop();
  happy.play();
  //console.log(happyseq);
  led.playLedSequence(0,happyseq.sequence);
  res.json({});
});

module.exports = router;