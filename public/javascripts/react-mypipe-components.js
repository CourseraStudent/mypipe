
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
    var list = this.props.ChannelList.map(function(channel) {
      return (
        <li>
          <Channel name={channel.name} icon={channel.icon} />
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

window.createChannelList = function(container, channelData) {
  ReactDOM.render(
      <ChannelList ChannelList={channelData} />,
      container
    );
};