$(document).ready(function() {
    debugger;
	createChannelList();
});

function createChannelList() {

    var tableContent = '';

    $.getJSON( '/channels/list', function( data ) {


        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<p>name:';
            tableContent += this.name;
            tableContent += '</p><p>icon:';
            tableContent += this.icon;
            tableContent += '</p><p>newVideosCount:';
            tableContent += this.newVideosCount;
        });
        
        // Inject the whole content string into our existing HTML table
        $('#channelList ul ').html(tableContent);

    });
};