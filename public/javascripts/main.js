var model = (function(){
  var channelListUrl = '/channels';
  var channelUrl = '/channel';

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
    playerWrapper.setPlayList(playList);
  }
  function onVideoChanged(){
    var activeChannelId = getActiveChannelId();
    var choosenVideo = getVideoListComponent().getChoosenVideo();
    var choosenVideoId = choosenVideo.id;
    var videoSrc = '/channel/' + activeChannelId + '/' + choosenVideoId
    playSingle(videoSrc);
  }
  function playSingle(videoSrc) {
    playerWrapper.playSingle(videoSrc);
  }

  return {
    'refreshChannelList': refreshChannelList
  };
})(model, window.componentRenderHelper);

var playListHelper = (function(){
  function createPlayListFromChannelInfo(channelInfo) {
    var playList = [];
    var videos = channelInfo.videos;
    var baseUrl = "/channel/" + channelInfo.channelId + "/";
    for(var i = 0; i < videos.length; i++) {
      playList.push(baseUrl + videos[i].fileId);
    }
    return playList;
  }
  return {
    'createPlayListFromChannelInfo': createPlayListFromChannelInfo
  };  
})()


var playerWrapper = (function(playerElementSelector){
  var player = null;
  function create(onPlayerReady){
    projekktor(playerElementSelector, {
      // poster: 'media/intro.png',
      title: 'this is projekktor',
      playerFlashMP4: 'swf/StrobeMediaPlayback/StrobeMediaPlayback.swf',
      width: 854,
      height: 480,   
      }, onPlayerReady);
  }
  function ensurePlayer(onPlayerReady){
    if(player) {
      onPlayerReady(player);
    } else {
      create(function(p) { 
        player = p;
        onPlayerReady(player);
      });
    }
  }

  function createPlayList(src) {
    src = src instanceof Array ? src : [src];
    return createPlayListFromArray(src);
  }
  function createPlayListFromArray(src) {
    var playList = [];
    for(var i = 0; i < src.length; i++) {
      playList.push( 
        {0:{
          'src': src[i], 
          'type': 'video/mp4'
        }});
    }
    return playList;
  }

  function play(src, playStrategy) {
    ensurePlayer(function(player){
      var video = createPlayList(src);
      playStrategy(player, video)
    });
  }
  function setSingleVideoAndPlayNow(player, video) {
    player.reset();
    player.setItem(video[0], 0, true);
    // player.setPlay();
  }
  function setPlayListAndPlayNow(player, playList){
    if(player.getSource())
      player.reset();
    for(var i = 0; i < playList.length; i++) {
      player.setItem(playList[i]);
    }
    // player.setPlay();
  }

  function playSingle(src) {
    play(src, setSingleVideoAndPlayNow);
  }
  function setPlayList(playList) {
    play(playList, setPlayListAndPlayNow);
  }

  return {
    'playSingle': playSingle,
    'setPlayList': setPlayList
  };
})("#player");

$(document).ready(function() {
  view.refreshChannelList();
});