//Selects a room, if the room is not the one the user is currently in
//then it will notifiy the server that the user wishes to switch rooms.
function selectRoom(element) {

	if(selectedRoom == element.innerHTML)
		return;
		
	//closeBucket();
	bucketArray = [];
	bucket.close();
	bucket.calm();
	
	var last = document.getElementById(selectedRoom);
	last.className = "inline room unselectedRoom";
	
	socket.emit('left room');
	chatBoxDiv.innerHTML += "<hr class='fadeout'>";
	
	element.className = "inline room selectedRoom";
	selectedRoom = element.innerHTML;

	roomMembersUL.innerHTML = ""
	
	usernames = socket.emit('request join room', selectedRoom);
}

//Removes room from the list of Available Rooms
function removeRoom(element){

	//Parse the room name out of the trash can span element.
	var elementParts = element.id.split(':');
	var elementName = elementParts[1];
	
	//Do not allow user to delete selected room.
	if(elementName == selectedRoom)
		return;
		
	//Find the room list item and the br list item.
	var listItem = document.getElementById(elementName);
	var brItem = document.getElementById("br:" + elementName);
	
	//Remove the trash can span, room list item, and br item associated with that room.
	element.parentNode.removeChild(element);
	listItem.parentNode.removeChild(listItem);
	brItem.parentNode.removeChild(brItem);
	
	//Delete the room from the rooms array.
	for (i = 0; i < roomsArray.length; i++) {

		if(roomsArray[i] == elementName){
			delete roomsArray[i];
			return;
		}
	
	}
}

//Checks the enter button on the new room input.
//This will trigger the creation and entering of a new room.
//This room will be added to the list of available rooms. 
function checkEnterRoom(e){
	
	var key = e.keyCode ? e.keyCode : e.which;
	
	if(key == 13) {
		var newRoomString = alphanumericUnderDashSpace(roomSearchInput.value);
		var room;
		
		roomSearchInput.blur();
		if(roomsArray.indexOf(newRoomString) > -1){
			room = document.getElementById(newRoomString);
			selectRoom(room);
			roomSearchInput.value = "";
			messageTextarea.focus();
			return;
		}
		
		roomsArray.push(newRoomString);
		
		room = addRoomToList(newRoomString);
		selectRoom(room);
		roomSearchInput.value = "";
		messageTextarea.focus();
	}
}

function addRoomToList(newRoomString) {
  roomsList.innerHTML = roomsList.innerHTML + "<li id='" + newRoomString + "' class='inline room unselectedRoom' onclick='selectRoom(this)'>" + newRoomString + "</li>" +
			"<span id='trash:" + newRoomString + "' class='icon octicon octicon-trashcan right large pointer block gray' onclick='removeRoom(this)' ></span><br id='br:" + newRoomString + "'>";
  return document.getElementById(newRoomString);
}
