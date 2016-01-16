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

  function renderVideoList(containerID, onVideoChoosenChanged) {
    return ReactDOM.render(
        <VideoList OnVideoChoosenChanged={onVideoChoosenChanged} />,
        getContainer(containerID)
      );
  }

  function renderVideoDashboard(containerID, onDelete, onViewed) {
    debugger;
    return ReactDOM.render(
        <VideoDashboard OnDelete={onDelete} />,
        getContainer(containerID)
      );
  }

  return {
    'renderChannelList': renderChannelList,
    'renderVideoList': renderVideoList,
    'renderVideoDashboard': renderVideoDashboard
  }
})();