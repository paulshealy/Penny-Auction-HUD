
var thresholds = {ActiveBidders: 4, LastSecondBidders: 3};

var myID = 'bidderz1';
var autoBidActive = false;
var numberOneSecondTicks = 0;
var numberAutoBids = 0;
var maxNumberAutoBids = 0;
var ticksToPauseFor = 0;

function isLastSecondBid(bid) {
	return bid.clickTime == "00:00:02" || bid.clickTime == "00:00:01";
}

function autoBid() {		
	if (currentPrice >= 0.5) {
		thresholds = {ActiveBidders: 6, LastSecondBidders: 4};
	}
	
	var numberActiveBidders = 0;
	var lastBidders = {};
	for (var x = bidHistory.length - 1; x > Math.max(0, bidHistory.length - 10); --x) {
		lastBidders[bidHistory[x].bidder] = lastBid[bidHistory[x].bidder];
	}
	for (var x in lastBidders) {
		numberActiveBidders++;
	}	
	var numberLastSecondBidders = 0;	
	for (var x = Math.max(0, bidHistory.length - 10); x > Math.max(0, bidHistory.length - 25); --x) {
		lastBidders[bidHistory[x].bidder] = lastBid[bidHistory[x].bidder];
	}
	for (var x in lastBidders) {
		if (isLastSecondBid(lastBidders[x]))
			numberLastSecondBidders++;
	}
	document.getElementById('AutoBidStatus1').innerText = ' Status: ' + numberActiveBidders + ' ' + numberLastSecondBidders + ' ' + numberAutoBids;

    if (ticksToPauseFor > 0) {
        ticksToPauseFor--;
		document.getElementById('AutoBidStatus2').innerText = ' Waiting';
        return;
    }	
	if (currentTime != '00:00:01') {
		document.getElementById('AutoBidStatus2').innerText = 'Not yet time';	
		return;
    }
    numberOneSecondTicks++;	
    if (numberOneSecondTicks < 8) {
		document.getElementById('AutoBidStatus2').innerText = ' On one second';
        return;
    }
    if (numberAutoBids >= maxNumberAutoBids) {
		document.getElementById('AutoBidStatus2').innerText = ' Out of bids';
        return;
    }
	// am I the current high bidder?
	if ((myID in lastBid) && lastBid[myID].price == currentPrice) {
		document.getElementById('AutoBidStatus2').innerText = 'Current high bidder';
        return;
	}
	if (numberActiveBidders >= thresholds.ActiveBidders) {	
		document.getElementById('AutoBidStatus2').innerText = 'Too many active bidders';
		return;
	}	
	if (numberLastSecondBidders >= thresholds.LastSecondBidders) {
		document.getElementById('AutoBidStatus2').innerText = 'Too many last-second bidders';
		return;
	}	
    
    // make an auto-bid
    document.getElementById('AutoBidStatus2').innerText = 'Bidding';
	bid();
    
    ticksToPauseFor = 15;
    numberAutoBids++;
    numberOneSecondTicks = 0;
	
	thresholds = {ActiveBidders: 5, LastSecondBidders: 4};
}


function bid() {
	var bg = chrome.extension.getBackgroundPage();			
    bg.bid(targetTabID, onPageInfo);
}

function startAutoBid() {
    maxNumberAutoBids = parseInt(document.getElementById('NumberAutoBids').value);    
    numberOneSecondTicks = 0;
    numberAutoBids = 0;
    ticksToPauseFor = 0;
    
    autoBidActive = true;
    stop();
    timerID = setInterval("retrieveData()", 100);	
}

function stopAutoBid() {
    autoBidActive = false;
    clearInterval(timerID);
}