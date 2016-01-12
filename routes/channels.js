var express = require('express');
var router = express.Router();

//youtube route examples:
//https://www.youtube.com/channel/UC6EjqyJwE1JXEgff-jrrxZw
//https://www.youtube.com/user/SERSHANT2/videos
//https://www.youtube.com/user/SERSHANT2/playlists    

router.get('/', function(req, res) {
  var mypipefs = req.mypipefs;
  var channelList = mypipefs.getChannelList()
  res.json(channelList);
});

// res.send
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// res.render
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// res.json
/* 
 * GET userlist 
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;
