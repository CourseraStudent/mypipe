$(document).ready(function() {
	createChannelListReact();
});

function createChannelListReact() {
    $.getJSON( '/channels/list', function( data ) {    
        var container = document.getElementById('channelList');
            window.createChannelList(container, data);
    });
}