var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/:id', function(req, res) {
  var mypipefs = req.mypipefs;

  var channelId = req.params.id;

  var channelInfo = mypipefs.getChannelInfo(channelId);
  
  res.json(channelInfo);
});

router.get('/:channelId/:resourceId', function(req, res) {
  var mypipefs = req.mypipefs;

  var relativePath = mypipefs.getFilePathByIds(req.params.channelId, req.params.resourceId);
  var absPath = path.join(__dirname, '../', relativePath);
  res.sendFile(absPath);  
});


module.exports = router;