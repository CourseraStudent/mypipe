
var Channel = React.createClass({
  onClickInternal: function() {
    this.props.onClick(this.props.dataMember);
  },

  render: function () {
    var onClickInternal = this.onClickInternal;
    return (
      <div onClick={onClickInternal}>
        <div>{this.props.icon}</div>
        <span>{this.props.name}</span>
        <span>[{this.props.active}]</span>
      </div>
    );
  }
});


var ChannelList = React.createClass({
  getInitialState: function() {
    return { 
      'ActiveChannel': null
    }
  },
  getDefaultProps: function() {
    return {
      'ChannelList': [],
      'OnChannelChanged': function(){ console.log('click was not handled'); }
    };
  },

  update: function(ChannelList) {
    this.setProps({'ChannelList': ChannelList});
    this.props.OnChannelChanged();
  },
  setActiveChannelSilently: function(channel) {
    this.state.ActiveChannel = channel;
  },
  getActiveChannel: function() {
    return this.state.ActiveChannel;
  },
  onChannelClicked: function(channel) {
    this.setState({ 'ActiveChannel': channel});
    this.props.OnChannelChanged(channel);

  },
  areChannelEqual: function(channel1, channel2) {
    var eq = channel1 == channel2 || 
        channel1.name == channel2.name;
    return eq;
  },
  isChannelActive: function(channel) {
    return this.areChannelEqual(this.state.ActiveChannel, channel) ?
      'active' : '';
  },

  render: function() {
    if(!this.state.ActiveChannel && this.props.ChannelList.length > 0)
      this.setActiveChannelSilently(this.props.ChannelList[0]);
    
    var onChannelClicked = this.onChannelClicked;
    var that = this; // TODO find a better solution
    var list = this.props.ChannelList.map(function(channel) {
      return (
        <li>
          <Channel 
            name={channel.name} 
            icon={channel.icon} 
            active={that.isChannelActive(channel)}
            onClick={that.onChannelClicked} 
            dataMember={channel} />
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

window.componentRenderHelper = (function() {
  function getContainer(id) {
    return document.getElementById(id);
  }

  function renderChannelList(containerID, onChannelChanged) {
    return ReactDOM.render(
        <ChannelList OnChannelChanged={onChannelChanged} />,
        getContainer(containerID)
      );
  };

  return {
    'renderChannelList': renderChannelList
  }
})();