window.componentRenderHelper = (function() {
  function getContainer(id) {
    return document.getElementById(id);
  }

  function renderChannelList(containerID, onChannelChanged) {
    return ReactDOM.render(
        <ChannelList OnChannelChanged={onChannelChanged} />,
        getContainer(containerID)
      );
  }

  function renderVideoList(containerID, OnVideoChoosenChanged) {
    return ReactDOM.render(
        <VideoList OnVideoChoosenChanged={OnVideoChoosenChanged} />,
        getContainer(containerID)
      );
  }

  return {
    'renderChannelList': renderChannelList,
    'renderVideoList': renderVideoList
  }
})();