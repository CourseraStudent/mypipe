var model = (function(){
  var channelListUrl = '/channels/';
  var channelUrl = '/channel/';

  function loadChannelList(onSuccess) {
    $.getJSON(channelListUrl, function(args) {
      window.setTimeout(function(){
        onSuccess(args);
      }, 0);
    });
  }
  function loadChannelInfo(channelId, onSuccess) {
    var channelVideoListUrl = channelUrl + '/' + channelId;
    $.getJSON(channelVideoListUrl, onSuccess);
  }

  return {
    'loadChannelList': loadChannelList,
    'loadChannelInfo': loadChannelInfo
  };
})();

var view = (function(m, componentRenderHelper) {
  var model = m;
  var channelListComponent = null;
  var videoListComponent = null;
  var playerWrapperComponent = null;
  var videoDashboardComponent = null;

  function refreshChannelList() {
    model.loadChannelList(onChannelListLoaded);
  }
  function getChannelListComponent() {
    if(!channelListComponent)
      channelListComponent = componentRenderHelper.renderChannelList('channelList', onChannelChanged);
    return channelListComponent;
  }
  function getVideoListComponent() {
    if(!videoListComponent)
      videoListComponent = componentRenderHelper.renderVideoList('videoList', onVideoChanged);
    return videoListComponent;
  }
  function getPlayer() {
    if(!playerWrapperComponent)
      playerWrapperComponent = playerWrapper("#player", playedVideoChanged);
    return playerWrapperComponent;
  }
  function getVideoDashboardComponent() {
    if(!videoDashboardComponent){
      videoDashboardComponent = componentRenderHelper.renderVideoDashboard('videoDashboard',
       onVideoDelete, onVideoViewed);
    }
    return videoDashboardComponent;
  }
  function onChannelListLoaded(channelList) {
    var channelListComponent = getChannelListComponent();
    channelListComponent.update(channelList);
  }
  function getActiveChannelId() {
    var activeChannel = getChannelListComponent().getActiveChannel();
    var activeChannelId = activeChannel.id;
    return activeChannelId;
  }
  function onChannelChanged() {
    var activeChannelId = getActiveChannelId();
    model.loadChannelInfo(activeChannelId, onVideoListLoaded);
  }
  function onVideoListLoaded(channelInfo) {
    var videoListComponent = getVideoListComponent();
    videoListComponent.update(channelInfo);

    var playList = playListHelper.createPlayListFromChannelInfo(channelInfo);
    getPlayer().setPlayList(playList);
  }
  function onVideoChanged(){
    var channelId = getActiveChannelId();
    var choosenVideo = getVideoListComponent().getChoosenVideo();
    var videoId = choosenVideo.id;
    var videoSrc = '/channel/' + channelId + '/' + videoId;
    var playList = playListHelper.createSingleVideoPlayList(channelId, choosenVideo);
    playSingle(playList);

  }
  function playSingle(videoSrc) {
    getPlayer().playSingle(videoSrc);
  }
  function playedVideoChanged(videoInfo){
    var videoDashboardComponent = getVideoDashboardComponent();
    videoDashboardComponent.update(videoInfo);
  }


  function onVideoDelete() {}
  function onVideoViewed() {}

  return {
    'refreshChannelList': refreshChannelList
  };
})(model, window.componentRenderHelper);

var playListHelper = (function(){
  function createPlayListFromChannelInfo(channelInfo) {
    var playList = [];
    var videos = channelInfo.videos;
    var channelId = channelInfo.channelId;

    for(var i = 0; i < videos.length; i++)
      playList.push(createSingleVideoPlayList(channelId, videos[i]));
    return playList;
  }
  function createSingleVideoPlayList(channelId, video) {
    var baseUrl = "/channel/" + channelId + "/";
    video.src = baseUrl + video.videoId;
    video.channelId = channelId;
    return video;
  }

  return {
    'createPlayListFromChannelInfo': createPlayListFromChannelInfo,
    'createSingleVideoPlayList': createSingleVideoPlayList
  };  
})()


var playerWrapper = (function(playerElementSelector, onPlayerVideoChanged){
  var player = null;
  var customPlayerReadyHandler = function(){};
  function setCustomPlayerReadyHandler(handler) {
    customPlayerReadyHandler = (function(p) {
      handler(p);
      customPlayerReadyHandler = function(){};
    });
  }
  function createPlayer(){
    projekktor(playerElementSelector, {
      // poster: 'media/intro.png',
      title: 'my pipe',
      // autoplay: true,
      // continuous: true,
      // controls: true,
      // volume: 0.5,
      playerFlashMP4: 'swf/StrobeMediaPlayback/StrobeMediaPlayback.swf',
      playerFlashMP3: 'swf/StrobeMediaPlayback/StrobeMediaPlayback.swf',
      width: 854,
      height: 480,
      keys: [{
          // 32: function(player) {player.setPlayPause();},
          // 27: function(player) {player.setFullscreen(false);},
          // 13: function(player) {player.setFullscreen(true);},
          // 39: function(player) {player.setPlayhead('+5');},
          // 37: function(player) {player.setPlayhead('-5');},
          // 38: function(player) {player.setVolume('+5');},
          // 40: function(player) {player.setVolume('-5');},
          68: function(player) {player.setDebug();},
          67: function(player) {console.log('Config Dump', player.config);},
          80: function(player) {console.log('Schedule Dump', player.media);}//,
          // 78: function(player) {console.log('player.setNex()'); player.setNex();}
      }],
      }, function(p) { 
        player = p;
        player.addListener('*',function(data) {
            if(data && data.file) {
              onPlayerVideoChanged(data.file[0]);
            }
          }
        );
        customPlayerReadyHandler(p);
      });
  }
  function ensurePlayer(onPlayerReady){
    if(player) {
      onPlayerReady(player);
    } else {
      setCustomPlayerReadyHandler(onPlayerReady)
      createPlayer();
    }
  }

  function createPlayList(videos) {
    videos = videos instanceof Array ? videos : [videos];
    return createPlayListFromVideoArray(videos);
  }
  function createPlayListFromVideoArray(videos) {
    var playList = [];
    for(var i = 0; i < videos.length; i++) {
      var playFromYoutube = false;
      var src = playFromYoutube ? 
        'http://www.youtube.com/watch?v=' + videos[i].video.youtubeCode :
        videos[i].src;
      var type = playFromYoutube ? 
        'video/youtube' : 
        'video/mp4';
      playList.push( 
        {0:{
          'src': src, 
          'type': type,
          'video': videos[i]
        }});
    }
    return playList;
  }

  function play(videos, playStrategy) {
    ensurePlayer(function(player){
      var playList = createPlayList(videos);
      playStrategy(player, playList);
    });
  }
  function setSingleVideoAndPlayNow(player, playList) {
    player.reset();
    player.setItem(playList[0], 0, true);
    player.setPlay();
  }
  function setPlayListAndPlayNow(player, playList){
    console.log("set playlist", playList);

    if(player.getSource())
      player.reset();

    player.setFile(playList);
    console.log("get playlist", player.getPlaylist());
    player.setPlay();
  }

  function playSingle(videosInfo) {
    play(videosInfo, setSingleVideoAndPlayNow);
  }
  function setPlayList(videosInfos) {
    play(videosInfos, setPlayListAndPlayNow);
  }

  return {
    'playSingle': playSingle,
    'setPlayList': setPlayList
  };
})/*("#player")*/;

$(document).ready(function() {
  view.refreshChannelList();
});