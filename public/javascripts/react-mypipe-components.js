
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
  getInitialState: function() {
    return { 
      'ActiveChannelIndex': 0,
    }
  },
  getDefaultProps: function() {
    return {
      'ChannelList': [ { name: 'loading...', icon: '' } ],
      'OnChannelChanged': function(){}
    };
  },

  getActiveChannel: function() {
    return this.props.ChannelList[this.state.ActiveChannelIndex];
  },
  update: function(ChannelList) {
    this.setProps({'ChannelList': ChannelList});
    this.props.onChannelChanged();
  },

  render: function() {
    console.log('render', this.props)
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

window.componentRenderHelper = (function() {
  function getContainer(id) {
    return document.getElementById(id);
  }

  function renderChannelList(containerID, onChannelChanged) {
    return ReactDOM.render(
        <ChannelList onChannelChanged={onChannelChanged} />,
        getContainer(containerID)
      );
  };

  return {
    'renderChannelList': renderChannelList
  }
})();