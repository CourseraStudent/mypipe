
window.VideoDashboard = React.createClass({
  update: function(currentPlayedVideoInfo) {
    this.setProps(
      {
        'channelInfo': currentPlayedVideoInfo,
        'video': currentPlayedVideoInfo.video,
      });
  },
  render: function () {
    if(this.props.video) {
      var headline = this.props.video.name;

      var propsDate = this.props.video.date;
      var postDate = new Date(propsDate.year, propsDate.month - 1, propsDate.day);
      var timeDiff = Math.abs((new Date()).getTime() - postDate.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + " days ago";    
      var date = propsDate.year + '.' + propsDate.month + '.' + propsDate.day;

      return (
        <div>
          <span className='headline'>{headline}</span>
          <span className='date'>{date}</span>
          <span className='diffDaysate'>{diffDays}</span>
          <buttom value="delete"/>
          <buttom value="viewed"/>
        </div>
      );
    } else 
      return (<div></div>);
  }
});