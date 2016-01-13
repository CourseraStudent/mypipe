var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {
  var mypipefs = req.mypipefs;

  var channelId = req.params.id;

  var channelInfo = mypipefs.getChannelInfo(channelId);
  
  res.json(channelInfo);
});


module.exports = router;