// Userlist data array for filling in info box
var userListData = [];
var msgListData = [];


// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);
    
    // Edit Post link click
    $('#userList table tbody').on('click', 'td a.linkeditpost', editPost);

    // Delete Post link click
    $('#userList table tbody').on('click', 'td a.linkdeletepost', deleteUser);


});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        
        console.log(data);
      
        // Stick our user data array into a userlist variable in the global object
        //userListData = data;
        userListData = [];
        //clear all
        msgListData = [];
       
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function (index, element){
            var latitude = this.latitude;
            var longitude = this.longitude;
            var id = this._id;
            var username = this.username;
            
            if (typeof latitude != 'undefined' && typeof longitude != 'undefined') {
                $.getJSON('/users/messagelist/' + id, function (data) {
                    
                    if (data.length > 0) {
                        
                        userListData.push(element);
                        var msgData = data[data.length - 1].message;                        
                        msgListData.push(msgData);
                        
                        tableContent += '<tr>';
                        tableContent += '<td><a href="#" class="linkshowuser" rel="' + username + '" title="Show Details">' + username + '</a></td>';
                        tableContent += '<td>' + latitude + '</td>';
                        tableContent += '<td>' + longitude + '</td>';
                        tableContent += '<td>' + msgData + '</td>';
                        tableContent += '<td><a href="#" class="linkeditpost" rel="' + id + '">Edit</a></td>';
                        tableContent += '<td><a href="#" class="linkdeletepost" rel="' + id + '">Remove</a></td>';
                        tableContent += '</tr>';
                        
                        // Inject the whole content string into our existing HTML table
                        $('#userList table tbody').html(tableContent);
                    }
              
                });
                
                $.getJSON('/users/landmarklist/' + id, function (data) {
                    console.log(data);
                });     
            }               
                     
        });        
              
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.username);
    $('#userInfoLatitude').text(thisUserObject.latitude);
    $('#userInfoLongitude').text(thisUserObject.longitude);
    $('#userInfoMessage').text(msgListData[arrayPosition]);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'latitude': $('#addUser fieldset input#inputUserLocationLat').val(),
            'longitude': $('#addUser fieldset input#inputUserLocationLng').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'phone': $('#addUser fieldset input#inputUserPhone').val(),
            'chat': $('#addUser fieldset select#inputChatAllowed').val()                     
        }
        var postMessage = {          
            'message': $('#addUser fieldset textarea#inputUserLatestPost').val(),
            'messageType': $('#addUser fieldset select#inputPostType').val(),
            'messageLocation': $('#addUser fieldset select#inputPostLocation').val()                
        }
        
        newUser.postMessage = JSON.stringify(postMessage);
        
        console.log(newUser);

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg.indexOf("{result:-1}")=='-1') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');
                $('#addUser fieldset textarea').val('');
                $('#addUser fieldset select').val(0);
                                
                $('#userInfoName,#userInfoLatitude,#userInfoLongitude,#userInfoMessage').text('');
               
                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: Something went wrong!');
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Post
function deletePost(event) {

    event.preventDefault();
    
    alert("vm");
    return;

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this post?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'POST',
            url: '/users/deletepost/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Delete User
function deleteUser(event) {
    
    event.preventDefault();
    
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');
    
    // Check and make sure the user confirmed
    if (confirmation === true) {
        
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function (response) {
            
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            
            // Update the table
            populateTable();

        });

    }
    else {
        
        // If they said no to the confirm, do nothing
        return false;

    }

};

//Edit User
function editPost(event) {
    
    event.preventDefault();
    
    alert('Yet to be implemented!')

};