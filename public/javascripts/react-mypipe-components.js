
var Channel = React.createClass({
  render: function () {
    return (
      <div>
        <div>{this.props.icon}</div>
        <span>{this.props.name}</span>
      </div>
    );
  }
});


var ChannelList = React.createClass({
  render: function() {
    var channels = this.props.ChannelList;
      return (
        <ul>
          {
            channels.map(function(channel) {
              return (
                <li>
                  <Channel name={channel.name} icon={channel.icon} />
                </li>
              )
            })
          }
        </ul>
      );
  }
});

window.createChannelList = function(container, channelData) {
  ReactDOM.render(
      <ChannelList ChannelList={channelData} />,
      container
    );
};