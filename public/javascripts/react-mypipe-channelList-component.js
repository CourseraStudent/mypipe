var Channel = React.createClass({
  onClickInternal: function() {
    this.props.onClick(this.props.dataMember);
  },

  render: function () {
    var onClickInternal = this.onClickInternal;
    return (
            <li className={this.props.active}>
              <div onClick={onClickInternal}>
                <div>{this.props.icon}</div>
                <span>{this.props.name}</span>
              </div>
            </li>
            );
  }
});

window.ChannelList = React.createClass({
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
    this.setState({ 'ActiveChannel': channel}, function() {
      this.props.OnChannelChanged(channel);
    });
  },
  areChannelsEqual: function(channel1, channel2) {
    var eq = channel1 == channel2 || 
    channel1.name == channel2.name;
    return eq;
  },
  isChannelActive: function(channel) {
    return this.areChannelsEqual(this.state.ActiveChannel, channel) ?
    'active' : '';
  },

  render: function() {
    if(!this.state.ActiveChannel && this.props.ChannelList.length > 0)
      this.setActiveChannelSilently(this.props.ChannelList[0]);
    
    var that = this; // TODO find a better solution
    var list = this.props.ChannelList.map(function(channel) {
      return (
              <Channel 
                name={channel.name} 
                icon={channel.icon} 
                active={that.isChannelActive(channel)}
                onClick={that.onChannelClicked} 
                dataMember={channel} />
              )
    });

    return (
            <ul className={"nav nav-sidebar"}>
              {list}
            </ul>
            );
  }
});