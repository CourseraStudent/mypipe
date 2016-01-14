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
  }
  function onVideoChanged(){
    var activeChannelId = getActiveChannelId();
    var choosenVideo = getVideoListComponent().getChoosenVideo();
    var choosenVideoId = choosenVideo.id;
    var videoSrc = 'channel/' + activeChannelId + '/' + choosenVideoId
    playVideo(videoSrc);
  }
  function playVideo(videoSrc) {
    playerWrapper.setVideoSrc(videoSrc);
  }

  return {
    'refreshChannelList': refreshChannelList
  };
})(model, window.componentRenderHelper);

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

  function setVideoSrc(src) {
    ensurePlayer(function(player){
      var video = { 
        0:{
         'src': src, 
         'type': 'video/mp4'
        } 
      };
      setSingleVideoAndPlayNow(player, video)
    });
  }
  function setSingleVideoAndPlayNow(player, video) {
    player.setItem(video, 0, true);
    player.setPlay();
  }
  function setPlayList(videos) {
  }

  return {
    'setVideoSrc': setVideoSrc,
    'setPlayList': setPlayList
  };
})("#player");

$(document).ready(function() {
  view.refreshChannelList();
});