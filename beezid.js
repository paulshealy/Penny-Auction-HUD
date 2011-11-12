
var timerID;

function startRefresh() {
	timerID = setInterval('checkForDataChanged()', 100);
}

function stopRefresh() {
	clearInterval(timerID);
}

function bid() {
	var link = document.getElementById('btn_bid_' + auctionID);
	var event = document.createEvent("MouseEvents");
	event.initMouseEvent("click", true, true, window,
		0, 0, 0, 0, 0,
		false, false, false, false,
		0, null);
	cancelled = !link.dispatchEvent(event);	
}

var auctionID;
var title;
var description;
var retailPrice;

function loadAuctionData() {

	try {
		auctionID = document.getElementsByTagName("body")[0].childNodes[4].childNodes[39].childNodes[3].childNodes[1].childNodes[1].childNodes[2].innerText;
		auctionID = auctionID.substr(12);
		
		title = $('#pin_' + auctionID).parentNode.childNodes[3].innerText;
		description = $('#pin_' + auctionID).parentNode.childNodes[7].innerText;
		retailPrice = $('#retPriceLine').cells[1].innerText;
	}
	catch (err) {
		setTimeout('loadAuctionData()', 500);
	}
}

loadAuctionData();

function checkForDataChanged() {
	if (currentTimeNode.innerText != lastText) {
		lastText = currentTimeNode.innerText;
		lastGoingText = goingNode.innerText;
		sendDataToHUD();
	}
}

function sendDataToHUD() {
	var timeLeft = $('#timer_' + auctionID).innerText;
	var currentPrice = $('#amount_' + auctionID).innerText;


	var hasEnded = $('#bidder_text' + auctionID).innerText == "Winner Is:";
	
	if (hasEnded) {
		timeDisplay = "Done";
		timeLeft = 0;
	}
	else {
		timeDisplay = toDisplayTime(currentTime);
	}

	var endDate = '';
	if (hasEnded) {
		endDate = timeLeft;
	}

	if (hasEnded)
		stopRefresh();
		
	var priceHistory = [];
	var historyTable = $('#history');
	for (var i = 5; i < 15; ++i) {
		try {
			var row = history.childNodes[i];
			var price = row[0].innerText;
			var bidder = row[1].innerText;	
			var bidType = row[2].innerText;		
			priceHistory.push({price: price, bidder: bidder, bidType: bidType});
		}
	}

	var info = {
    	auctionID: auctionID,
		currentPrice: currentPrice,
		itemWorth: retailPrice,
   	 	priceHistory: priceHistory, 
		hasEnded: hasEnded,	
		description: description,
		endDate: endDate,
		currentTime: timeLeft,
		tabID: tabID,
		timeDisplay: timeDisplay,
		bidPrice: 0.60
	};
	
	// Send the information back to the extension
	chrome.extension.sendRequest(info);

}