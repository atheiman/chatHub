//Saves locally the user settings such as if the user would like
//to keep their name on re-entering the site and what theme
//the user would like to use. 
function saveSettings() {
  // save all settings to settingsObj
  settingsObj.theme = themeSelect.value;
  setUITheme(settingsObj.theme);
  settingsObj.ignoreColors = incomingColorsCheck.checked;
  settingsObj.ignoreFont = incomingFontCheck.checked;
  settingsObj.videoResSelect = videoResSelect.value;
  settingsObj.username = alphanumericUnderDash(usernameInput.value);
  settingsObj.persistentUsername = persistentUsernameCheck.checked;
  // settingsObj.lastRoom = selectedRoom;
  settingsObj.font = fontSelect.value;
  settingsObj.color = colorSelect.value;
  settingsObj.defaultRoom = defaultRoomSelect.value;
  localStorage.settingsJSON = JSON.stringify(settingsObj);
  console.log('saving settings to localStorage and JSON string: ' + localStorage.settingsJSON);
}

//Uses the local settings to affect the site on load up.
function configureSettings() {
  // set the settings saved from settingsObj obj
  themeSelect.value = settingsObj.theme;
  setUITheme(settingsObj.theme);
  incomingColorsCheck.checked = settingsObj.ignoreColors;
  incomingFontCheck.checked = settingsObj.ignoreFont;
  videoResSelect.value = settingsObj.videoResSelect;
  usernameInput.value = settingsObj.username;
  persistentUsernameCheck.checked = settingsObj.persistentUsername;
  defaultRoomSelect.value = settingsObj.defaultRoom;
  // selectedRoom = settingsObj.lastRoom;
  // if (selectedRoom != "DefaultLobby") {
  //   roomsArray.push(selectedRoom);
  //   selectedRoomElement = addRoomToList(selectedRoom);
  //   selectRoom(selectedRoomElement);
  // }
  fontSelect.value = settingsObj.font;
  colorSelect.value = settingsObj.color;
}

function displaySettings() {
  popupBackgroundDiv.style.display = "block";
  popupSettingsDiv.style.display = "block";
}

function fontColorChange() {
    myColor = colorSelect.value;
    messageTextarea.style.color = myColor;
}

function fontFamilyChange() {
    myFont = fontSelect.value;
    messageTextarea.style.fontFamily = myFont;
}

function setUITheme(uiTheme) {
	if (uiTheme === "Terminal") {
		var black = "#111";
		var white = "#eee";
		console.log("[LOG] [OPENING $VT_TERM1]...");
		var cardElementsLength = cardElements.length;
		for (var i=0 ; i < cardElementsLength ; i++) {
			cardElements[0].className = 'terminalCard';
		}
		myBody.style.backgroundColor = black;
		myBody.style.fontFamily = "monospace";
		// background-color:#eee;
		var inputElements = document.getElementsByTagName("input");
		var inputElementsLength = inputElements.length;
		for (var i=0 ; i<inputElementsLength ; i++) {
			inputElements[i].style.backgroundColor = black;
			inputElements[i].style.color = white;
			inputElements[i].style.fontFamily = 'monospace';
		}
		messageTextarea.style.backgroundColor = black;
		messageTextarea.style.color = white;
		messageTextarea.style.fontFamily = 'monospace';
	}
	if (uiTheme === "Cards") {
		console.log("going back to cards...");
		var terminalCardElements = document.getElementsByClassName("terminalCard");
		var terminalCardElementsLength = terminalCardElements.length;
		for (var i=0 ; i < terminalCardElementsLength ; i++) {
			terminalCardElements[0].className = 'card';
		}
		myBody.style.backgroundColor = 'initial';
		myBody.style.fontFamily = "arial";
		// background-color:#eee;
		var inputElements = document.getElementsByTagName("input");
		var inputElementsLength = inputElements.length;
		for (var i=0 ; i<inputElementsLength ; i++) {
			inputElements[i].style.backgroundColor = 'initial';
			inputElements[i].style.color = 'initial';
			inputElements[i].style.fontFamily = 'arial';
		}
		messageTextarea.style.backgroundColor = 'initial';
		messageTextarea.style.color = 'initial';
		messageTextarea.style.fontFamily = 'arial';
	}
}
