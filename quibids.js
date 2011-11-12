/* Page responsibilities:
 - send data every time it changes
 - stop sending data when the auction ends
 - set timeDisplay to a "display time"
 - set currentTime 
 - determine whether the page has an active auction. Do not send data if not
 - expose "bid()". Other functions?
 */


var timerID;

function startRefresh() {
	timerID = setInterval('checkForDataChanged()', 100);
}

function stopRefresh() {
	clearInterval(timerID);
}

function bid() {
	var link = document.getElementById('button_' + auctionID);
	var event = document.createEvent("MouseEvents");
	event.initMouseEvent("click", true, true, window,
		0, 0, 0, 0, 0,
		false, false, false, false,
		0, null);
	cancelled = !link.dispatchEvent(event);	
}

var isAuction = true;
var auctionID = "";
var description = "";
var worthContainer = null;
var lastText = "";

function loadAuctionData() {
	isAuction = true;
	var url = window.location.href;
	var slashLoc = url.lastIndexOf('/');
	var shortUrl = url.substring(slashLoc + 1);
	var dashLoc = shortUrl.indexOf('-');	
	if (dashLoc < 0)
		isAuction = false;
	else {
		auctionID = shortUrl.substring(0, dashLoc);
		description = document.title;
		description = description.substr(10);
		worthContainer = document.getElementById('worth_' + auctionID);
		if (worthContainer == null)
			isAuction = false;
		
		var currentTime = document.getElementById('timer_' + auctionID).innerText;
		if (currentTime == "Ended")
			isAuction = false;
	}
}

loadAuctionData();
startRefresh();

function checkForDataChanged() {
	if (!isAuction)
		return;
		
	currentTime = document.getElementById('timer_' + auctionID).innerText;
	if (currentTime != lastText) {
		lastText = currentTime;
		sendDataToHUD();
	}
}

function sendDataToHUD() {
	var currentPrice = document.getElementById('price_' + auctionID).innerText;
	
	var itemWorth = null;
	if (worthContainer != null)
		itemWorth = worthContainer.innerText.replace('$', '').replace(',', '');
		
	var currentTime = document.getElementById('timer_' + auctionID).innerText;
	var hasEnded = currentTime == "Ended";
	var timeDisplay = '';

	if (!hasEnded) {
		currentTime = parseTime(currentTime);
		timeDisplay = toDisplayTime(currentTime);
	}
	else {
		currentTime = 0;
		timeDisplay = "Done";
	}

	var endDate = '';
	if (hasEnded) {
		var text = document.getElementById('auction-stats').childNodes[1].childNodes[5].innerText;
		text = text.replace('This auction ended ', '');
		text = text.replace(', at', '');
		text = text.replace('CST.', '');
		endDate = text;
	}
	
	if (hasEnded)
		stopRefresh();
	
	var priceHistory = [];
	
	for (var i = 1; i < 10; ++i) {
		var price = document.getElementById('bhp_' + i).innerText;
		var bidder = document.getElementById('bhb_' + i).innerText;	
		var bidType = document.getElementById('bht_' + i).innerText;		
		priceHistory.push({price: price, bidder: bidder, bidType: bidType});	
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
		timeDisplay: timeDisplay,
		tabID: tabID,
		bidPrice: 0.6
	};
	
	// Send the information back to the extension
	chrome.extension.sendRequest(info);
}