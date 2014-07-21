bucket = {
	contentsArray:[],
	dance:function() { bucketSpan.className = "icon octicon octicon-paintcan right larger pointer block black dance"; this.isDancing=true; },
	calm:function() { bucketSpan.className = "icon octicon octicon-paintcan right larger pointer block gray"; this.isDancing=false; },
	isDancing:false,
	isExpanded:false,
	send: function(link){
	
		if(isShowingBucketInput){
			bucket.collapseInput();
			isShowingBucketInput = false;
		}
		socket.emit('send bucket', link );
	},
	showInput: function() {
	  // show input box
	  
	  if(isShowingBucketInput || this.isExpanded)
		return;
		
	  isShowingBucketInput = true;
	  
	  bucketInput.style.width = "200px";
	  bucketInput.style.borderWidth="1px";
	  bucketInputSendSpan.style.opacity=1;
	  bucketInputXSpan.style.opacity=1;
	  
	},
	collapseInput: function() {
	  // hide input box
	  
	  if(!isShowingBucketInput)
		return;
		
	  isShowingBucketInput = false;
	  
	  bucketInput.style.width = "0px";
	  bucketInputXSpan.style.opacity=0.1;
	  setTimeout(function(){bucketInput.blur();},1500);
	  setTimeout(function(){bucketInput.style.borderWidth="0px";}, 1550);
	  bucketInputSendSpan.style.opacity=0.1;
	},
	open: function() {
		if(!this.isDancing)
			return;
			
		bucketInputSendSpan.style.display="none";
		bucketInputXSpan.style.display="none";
		bucketInput.style.display="none";
		this.collapseInput();
		isShowingBucketInput = false;
		bucket.isExpanded = true;
		
		var item = this.contentsArray.shift();
			
		bucketSpan.style.display = "none";
		bucketXSpan.style.display = "inline";
		bucketNextSpan.style.display = "inline";
		bucketPlusSpan.style.display = "inline";
		bucketMinusSpan.style.display = "inline";
		
		if(this.contentsArray.length > 0)
			bucketNextSpan.style.color = "#00FF00";
			
		if(item.type == "youtube"){
			iFrame.src = item.src;
			setTimeout(function(){iFrame.style.width = setVideoResolutions[videoResolutionsPointer].width;},100);
			setTimeout(function(){iFrame.style.height = setVideoResolutions[videoResolutionsPointer].height;},100);
		}
		
		else if (item.type == "imgur"){
			var tempImg = new Image();
			tempImg.src = item.src;
			iFrame.src = item.src;
			
			//var ratio = tempImg.height / setVideoResolutions[videoResolutionsPointer].height;
			//var width = tempImg.width * ratio;
			
			setTimeout(function(){iFrame.style.width = tempImg.width*.5+"px";},100);
			setTimeout(function(){iFrame.style.height = tempImg.height*.5+"px";},100);
		}
	},
	expand: function() {
	
		if(videoResolutionsPointer + 1 == setVideoResolutions.length)
			return;
		var size = setVideoResolutions[++videoResolutionsPointer];
		setTimeout(function(){iFrame.style.width = size.width},100);
		setTimeout(function(){iFrame.style.height = size.height;},100);
		
	},
	contract: function() {
	
		if(videoResolutionsPointer - 1 < 0)
			return;
		var size = setVideoResolutions[--videoResolutionsPointer];
		setTimeout(function(){iFrame.style.width = size.width;},100);
		setTimeout(function(){iFrame.style.height = size.height;},100);
	},
	next: function() {
	
		if(this.contentsArray.length === 0) {
			return;
		}
	
		var item = this.contentsArray.shift();
		
		if(this.contentsArray.length === 0) {
			bucketNextSpan.style.color = "#BDBDBD";
		}
		
		if(item.type == "youtube"){
				var size = setVideoResolutions[videoResolutionsPointer];
				setTimeout(function(){iFrame.style.width = "0px";},100);
				setTimeout(function(){iFrame.style.height = "0px";},100);
				setTimeout(function(){iFrame.src = item.src;},1000);
				setTimeout(function(){iFrame.style.width = size.width;},1000);
				setTimeout(function(){iFrame.style.height = size.height;},1000);
				
			}
			
		else if (item.type == "imgur"){
			var tempImg = new Image();
			tempImg.src = item.src;
			setTimeout(function(){iFrame.style.width = "0px";},100);
			setTimeout(function(){iFrame.style.height = "0px";},100);
			setTimeout(function(){iFrame.src = item.src;},1000);
			setTimeout(function(){iFrame.style.width = tempImg.width+"px";},1000);
			setTimeout(function(){iFrame.style.height = tempImg.height+"px";},1000);
			
		}
	},
	close: function() {
		iFrame.style.width = "0px";
		iFrame.style.height = "0px";
		bucketXSpan.style.display = "none";
		bucketNextSpan.style.display = "none";
		bucketPlusSpan.style.display = "none";
		bucketMinusSpan.style.display = "none";
		bucketSpan.style.display = "inline";
		bucket.isExpanded = false;
		
		bucketInputSendSpan.style.display="inline";
		bucketInputXSpan.style.display="inline";
		bucketInput.style.display="inline";
		
		if(this.contentsArray.length === 0)
			this.calm();
		else
			this.dance();
	}
};