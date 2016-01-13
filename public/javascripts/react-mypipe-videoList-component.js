
var Video = React.createClass({
  onClickInternal: function() {
    this.props.onClick(this.props.dataMember);
  },

  render: function () {
    var onClickInternal = this.onClickInternal;
    var iconUrl = this.props.channelDirectory + "/" + this.props.icon;
    return (
      <div onClick={onClickInternal} className={this.props.active}>
        <img src={iconUrl}/>
        <span>{this.props.name}</span>
      </div>
    );
  }
});


window.VideoList = React.createClass({
  getInitialState: function() {
    return { 
      'ChoosenVideo': null
    }
  },
  getDefaultProps: function() {
    return {
      'VideoList': [],
      'channelInfo': {},
      'OnVideoChoosenChanged': function(){ console.log('click was not handled'); }
    };
  },

  update: function(channelInfo) {
    this.setProps({'channelInfo': channelInfo});
    this.setProps({'VideoList': channelInfo.videos});
    var defaultVideo = channelInfo.videos[0];
    this.props.OnVideoChoosenChanged(defaultVideo);
  },
  setChoosenVideoSilently: function(video) {
    this.state.ChoosenVideo = video;
  },
  getChoosenVideo: function() {
    return this.state.ChoosenVideo;
  },
  onVideoClicked: function(video) {
    this.setState({ 'ChoosenVideo': video}, function(){
      this.props.OnVideoChoosenChanged(video);
    });
  },
  areVideosEqual: function(video1, video2) {
    var eq = video1 == video2 || 
        video1.name == video2.name;
    return eq;
  },
  isVideoActive: function(video) {
    return this.areVideosEqual(this.state.ChoosenVideo, video) ?
      'active' : '';
  },

  render: function() {
    if(!this.state.ChoosenVideo && this.props.VideoList.length > 0)
      this.setChoosenVideoSilently(this.props.VideoList[0]);
    
    var onVideoClicked = this.onVideoClicked;
    var channelDirectory = this.props.channelInfo.channelDirectory;
    console.log(channelDirectory);
    var that = this; // TODO find a better solution
    var list = this.props.VideoList.map(function(video) {
      return (
        <li>
          <Video 
            name={video.name} 
            icon={video.icon} 
            active={that.isVideoActive(video)}
            onClick={that.onVideoClicked} 
            dataMember={video}
            channelDirectory = {channelDirectory} />
        </li>
      )
    });

    return (
      <ul>
        {list}
      </ul>
    );
  }
});