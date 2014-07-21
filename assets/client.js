socket.on('chat message', function(messageObj) {
    console.log("message received:");
    console.log(messageObj);
	
	// Am I mentioned?
	var mentionedFlag = false;
	if (messageObj.contents.toLowerCase().indexOf(settingsObj.username.toLowerCase()) > -1) {
		mentionedFlag = true;
	}
	
	// display missed messages notification in tab
	if(isBlurred){
		numberOfMissedMessages++;
		var title = document.getElementsByTagName("title");
		title[0].innerHTML = "(" + numberOfMissedMessages + ") chatHub";
		
		// If mentioned and away then play notification sound
		if (mentionedFlag) {
			notificationSound();
		}
	}
	
	console.log('message contents: ' + messageObj.contents);
	var urlRegExp = /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/igm;

	messageObj.contents = messageObj.contents.replace(urlRegExp,'<a href="http://$1" target="_blank">$1</a>');
	
	var messageString = "<p class='messageP' style='color:" + messageObj.color + ";font-family:" + messageObj.font + ";'><span class='messageInfoSpan'>[" + messageObj.username + " " + messageObj.time + "]</span> " + messageObj.contents + "</p>";
		
	chatBoxDiv.innerHTML = chatBoxDiv.innerHTML + messageString;
	chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
});
		
socket.on('request username', function(msg) {
	socket.emit('receive username', usernameInput.value);
});
		
socket.on('join room', function(joinObj){

	console.log("Joining Room: " + selectedRoom);

	usernames = joinObj.usernames;
	
	roomMembersDiv.innerHTML = 'Users in "' + selectedRoom + '"<hr class="fadeout"><ul id="roomMembersUL"></ul>';
	
	for(var key in usernames){
		if(usernames.hasOwnProperty(key)){
			var listItem = document.getElementById(key);
	
			if(listItem == null)
				roomMembersUL.innerHTML = roomMembersUL.innerHTML + "<li id='" + key + "' class='noBullet'>" + usernames[key]  + "</li>";
		}
	}
		
	chatBoxDiv.innerHTML = chatBoxDiv.innerHTML + "<p class='chatBoxNotification'>" +  joinObj.username + " has joined the room.</p>";
	chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
});
	
socket.on('send bucketArray', function(buckets) {
	console.log("Bucket Array Received: " + buckets);
	bucket.contentsArray = buckets;
	bucket.dance();
});
	
	
socket.on('new bucketItem', function(bucketItem) {
	console.log("Bucket Item Received: " + bucketItem);
	bucket.contentsArray.push(bucketItem);
	
	var bucketTypeString = "an item";
	
	if(bucketItem.type == "youtube")
		bucketTypeString = "a Youtube video";
	else if(bucketItem.type == "imgur")
		bucketTypeString = "an Imgur image";
	
	chatBoxDiv.innerHTML = chatBoxDiv.innerHTML + "<p class='chatBoxNotification'>" +  usernames[bucketItem.id] + " has put " + bucketTypeString + " in the bucket.</p>";
	chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
	
	
	if(bucket.isExpanded){
		bucketNextSpan.style.color = "#00FF00";
		return;
	}
	
	bucket.dance();
});
	
socket.on('changed name', function(joinObj){

	console.log("Changing Name: " + joinObj.username);

	var oldName = usernames[joinObj.id];
	usernames[joinObj.id] = joinObj.username;
	
	chatBoxDiv.innerHTML = chatBoxDiv.innerHTML + "<p class='chatBoxNotification'>" + oldName + " has changed their name to " + joinObj.username + ".</p>";
	chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
	var listItem = document.getElementById(joinObj.id);
	listItem.innerHTML = joinObj.username;

});
	
socket.on('disconnected', function(userId){
	
	var name = usernames[userId];
	
	if(name == null)
		name = myUsername;
	else{
		delete usernames[userId];
		var node = document.getElementById(userId);
		node.parentNode.removeChild(node);
	}
		
	chatBoxDiv.innerHTML = chatBoxDiv.innerHTML + "<p class='chatBoxNotification'>" + name+ " has left the room.</p>";
	chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
});