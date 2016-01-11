var model = (function(){
  var channelListUrl = '/channels/list';

  function loadChannelList(onSuccess) {
    $.getJSON(channelListUrl, onSuccess);
  }

  return {
    'loadChannelList': loadChannelList
  };
})();

var view = (function(m, componentRenderHelper) {
  var model = m;
  var channelListComponent = null;

  function refreshChannelList() {
    model.loadChannelList(onChannelListLoaded);
  }
  function getChannelListComponent() {
    if(!channelListComponent)
      channelListComponent = componentRenderHelper.renderChannelList('channelList', onChannelChanged);
    return channelListComponent;
  }
  function onChannelListLoaded(channelList) {
    var channelListComponent = getChannelListComponent();
    channelListComponent.update(channelList);
  }
  function onChannelChanged() {
    var activeChannel = channelListComponent.getActiveChannel();
    //model.loadChannelVideoList(onChannelListLoaded);
  }

  return {
    'refreshChannelList': refreshChannelList
  };
})(model, window.componentRenderHelper);

$(document).ready(function() {
  view.refreshChannelList();

});