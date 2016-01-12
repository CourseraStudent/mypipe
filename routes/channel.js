var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {
  var mypipefs = req.mypipefs;

  var channelId = req.params.id;

  var videos = mypipefs.getChannelVideos(channelId);
  
  res.json(videos);
});


module.exports = router;