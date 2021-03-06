
var Video = React.createClass({
  onClickInternal: function() {
    this.props.onClick(this.props.dataMember);
  },

  render: function () {
    var onClickInternal = this.onClickInternal;
    var iconUrl = '/channel' + '/' + this.props.channelId + '/' + this.props.iconId;
    var postDate = new Date(this.props.date.year, this.props.date.month - 1, this.props.date.day);
    var timeDiff = Math.abs((new Date()).getTime() - postDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + " days ago";    
    var date = this.props.date.year + '.' + this.props.date.month + '.' + this.props.date.day;
    var mainClassName = "item " + this.props.active;
    return (
      <div onClick={onClickInternal} className={mainClassName} title={this.props.name}>
        <img src={iconUrl}/>
        <span className='name'>{this.props.name}</span>
        <span className='diffDate'>{diffDays} </span>
        <span className='date'>{diffDays}>{date}</span>
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
    this.setProps(
      {
        'channelInfo': channelInfo,
        'VideoList': channelInfo.videos
      }, function(){
          var defaultVideo = channelInfo.videos[0];
          // this.props.OnVideoChoosenChanged(defaultVideo);
        }
      );
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
    var that = this; // TODO find a better solution
    var list = this.props.VideoList.map(function(video) {
      return (
        <li>
          <Video 
            name={video.name} 
            iconId={video.iconId} 
            active={that.isVideoActive(video)}
            onClick={that.onVideoClicked} 
            dataMember={video}
            channelId = {that.props.channelInfo.channelId}
            date={video.date} />
        </li>
      );
    });

    return (
      <ul>
        {list}
      </ul>
    );
  }
});