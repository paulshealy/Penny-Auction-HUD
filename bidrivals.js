
var timerID;

function startRefresh() {
	timerID = setInterval('checkForDataChanged()', 100);
}

function stopRefresh() {
	clearInterval(timerID);
}

function bid() {
	var event = document.createEvent("MouseEvents");
	event.initMouseEvent("click", true, true, window,
		0, 0, 0, 0, 0,
		false, false, false, false,
		0, null);
	cancelled = !bidButton.dispatchEvent(event);	
}

var lastText = "";
var lastGoingText = "";

var description;
var auctionID;
var rightTable;
var middleContainer;

var bidButton;
var currentTimeNode;

var goingNode;


function loadAuctionData() {	
	try {
		lastText = "";
		lastGoingText = "";
		
		description = document.getElementsByTagName("body")[0].childNodes[6].childNodes[1].childNodes[1].childNodes[5].childNodes[1].childNodes[1].childNodes[1].innerText;		
		auctionID = document.getElementsByTagName("body")[0].childNodes[6].childNodes[1].childNodes[1].childNodes[5].childNodes[1].childNodes[3].innerText.substr(9);
		
		rightTable = document.getElementsByTagName("body")[0].childNodes[6].childNodes[1].childNodes[1].childNodes[5].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[5].childNodes[1].childNodes[3];	
		middleContainer = document.getElementsByTagName("body")[0].childNodes[6].childNodes[1].childNodes[1].childNodes[5].childNodes[3].childNodes[1].childNodes[3].childNodes[1];
	
		bidButton = document.getElementsByTagName("body")[0].childNodes[6].childNodes[1].childNodes[1].childNodes[5].childNodes[3].childNodes[1].childNodes[3].childNodes[3];
		currentTimeNode = middleContainer.childNodes[1].childNodes[3];
	
		goingNode = middleContainer.childNodes[1].childNodes[5];
		startRefresh();
	}
	catch (err) {
		setTimeout('loadAuctionData()', 500);
	}
}

loadAuctionData();

function shortenGoingText(text) {
	if (text == "Going once")
		return "Once";
	if (text == "Going twice")
		return "Twice";
	if (text == "Going third")
		return "Third";
	return text;
}

function checkForDataChanged() {
	if (currentTimeNode.innerText != lastText) {
		lastText = currentTimeNode.innerText;
		lastGoingText = goingNode.innerText;
		sendDataToHUD();
	}
	if (goingNode.innerText != lastGoingText) {
		lastText = currentTimeNode.innerText;
		lastGoingText = goingNode.innerText;
		sendDataToHUD();
	}
}

function sendDataToHUD() {
	var currentPrice = middleContainer.childNodes[5].childNodes[1].innerText;
	var itemWorth = middleContainer.childNodes[7].childNodes[4].innerText;

	var timeLeft = currentTimeNode.innerText;
	
	var going = (goingNode.style.cssText != "display: none; ");
	
	var hasEnded = (timeLeft.substring(0, 13) == "Auction ended");

	var currentTime = '';
	var timeDisplay = '';

	if (going) {
		currentTime = 1;
		timeDisplay = shortenGoingText(goingNode.innerText);
	}
	else if (!hasEnded) {
		timeLeft = parseTime(timeLeft);	
		if (timeLeft < 1)
			timeLeft = 1;
		currentTime = timeLeft;	
		timeDisplay = toDisplayTime(currentTime);	
	}
	else {
		currentTime = 0;
		timeDisplay = "Done";
	}

	var endDate = '';
	if (hasEnded) {
		endDate = timeLeft.substring(14);
	}

	if (hasEnded)
		stopRefresh();
		
	var priceHistory = [];
	
	for (var i = 1; i < 10; ++i) {
		// there might not be any child nodes for a row...
		if (rightTable.childNodes[i].childNodes.length >= 2) { 
			var price = rightTable.childNodes[i].childNodes[0].innerText;
			var bidder = rightTable.childNodes[i].childNodes[1].innerText;	
			var bidType = rightTable.childNodes[i].childNodes[2].innerText;		
			priceHistory.push({price: price, bidder: bidder, bidType: bidType});	
		}
	}

	var info = {
    	auctionID: auctionID,
		currentPrice: currentPrice,
		itemWorth: itemWorth,
   	 	priceHistory: priceHistory,
		hasEnded: hasEnded,
		description: description,
		endDate: endDate,
		currentTime: currentTime,
		tabID: tabID,
		timeDisplay: timeDisplay,
		bidPrice: 0.75
	};
	
	// Send the information back to the extension
	chrome.extension.sendRequest(info);

}
