
function clearRow(rowNumber) {
	document.getElementById("P" + rowNumber).innerText = "";
	document.getElementById("D" + rowNumber).innerText = "";
	document.getElementById("T" + rowNumber).innerText = "";

	var row = $('#a' + rowNumber);
	
	$('#im' + rowNumber).attr("src", "run.png");
	
	// update the handlers
	$('#B' + rowNumber).unbind('click');
	$('#S' + rowNumber).unbind('click');
	
	row.css("background-color", "");
}

function updateDisplay() {
	for (tabID in auctionData) 
	{
		var data = auctionData[tabID];
		if (data.isDirty)
			displayAuctionShort(data);
	}
	
	for (tabID in auctionData) 
	{
		var data = auctionData[tabID];		
		if (data.isDirty && data.active)
		{
			displayAuctionLong(data);
			data.isDirty = false;
		}
	}
}

function displayUser(data, user) {	
	return data.lastBid[user].price > (data.currentPrice - 1.0);
}

function displayAuctionShort(data) {
	var row = $('#a' + data.rowNumber);

	if (data.hasEnded) {
		$('#im' + data.rowNumber).attr("src", "end.png");
		$('B' + data.rowNumber).attr("enabled", false);
		$('S' + data.rowNumber).attr("enabled", false);
	}
	else if (data.currentTime <= 5) {
		$('#im' + data.rowNumber).attr("src", "em" + data.currentTime + ".png");
	}
	else {
		$('#im' + data.rowNumber).attr("src", "run.png");
	}
	if (data.active) 
		row.css("background-color", "#FFE0F7");
	else {
		row.css("background-color", "");
		row.removeClass();
		if (data.rowNumber % 2 == 1)
			row.addClass("alt");
	}
	
	document.getElementById("P" + data.rowNumber).innerText = "$" + data.currentPrice.toFixed(2);		
	if (data.description.length > 30)
	    document.getElementById("D" + data.rowNumber).innerText = data.description.substr(0, 30) + '...';	
	else
	    document.getElementById("D" + data.rowNumber).innerText = data.description;	
    if (data.hasEnded)
    	document.getElementById("T" + data.rowNumber).innerText = "Done";	
	else    	
    	document.getElementById("T" + data.rowNumber).innerText = data.timeDisplay;
		
	$('#B' + data.rowNumber).click(function() { 
		for (var row in auctionData) {
			if (auctionData[row].active)
			{
				auctionData[row].active = false;
				auctionData[row].isDirty = true;
			}
		}
		auctionData[auctionRows[data.rowNumber]].active = true; 
		auctionData[auctionRows[data.rowNumber]].isDirty = true; 
		});
		
	$('#S' + data.rowNumber).click(function() { 
		var tabID = auctionRows[data.rowNumber];
	   	chrome.tabs.executeScript(tabID, { code: "bid();" }); 
	});
}

function displayAuctionLong(data) {

	var clickTime = data.times[0].AuctionTime;
	
	for (var i = 0; i < data.priceHistory.length; ++i) {
			var bid = data.priceHistory[i];
			var price = parseFloat(bid.price.replace('$', ''));
			bid.price = price;
			var bidder = bid.bidder;
			bidder = jQuery.trim(bidder);
			if (bidder.length == 0)
					continue;
			var bidType = bid.bidType;      
		
			var priceSeen = typeof(data.bidsSeen[price]) != 'undefined';
			if (priceSeen)
					continue;
			data.bidsSeen[price] = 0;
			bid.clickTime = clickTime;			
			data.lastBid[bidder] = bid;
			data.bidHistory.push(bid);
	
			var userSeen = typeof(data.userBids[bidder]) != 'undefined';
			if (!userSeen)
				data.userBids[bidder] = 0;
			data.userBids[bidder] = data.userBids[bidder] + 1;					
	}
	var userBidsArray = [];

	for (var user in data.userBids) {
			if (displayUser(data, user))
			userBidsArray.push({user: user, 
									lastBid: data.lastBid[user].price,
									bids: data.userBids[user],
									clickTime: data.lastBid[user].clickTime,
									profit: data.itemWorth - data.bidPrice * data.userBids[user]});			
	}

	userBidsArray.sort(function(a, b){ if (b.bids == a.bids) return b.lastBid - a.lastBid; return b.bids - a.bids });
	
	for (var i = 0; i < Math.min(15, userBidsArray.length); ++i) {
			document.getElementById("ud" + i).innerText = userBidsArray[i].user;
			document.getElementById("ub" + i).innerText = userBidsArray[i].bids;
			document.getElementById("up" + i).innerText = "$" + userBidsArray[i].profit.toFixed(2);
	}

	for (var i = Math.min(15, userBidsArray.length); i < 15; ++i) {
			document.getElementById("ud" + i).innerText = "";
			document.getElementById("ub" + i).innerText = "";	
			document.getElementById("up" + i).innerText = "";	
	}


	
	/*for (var user in data.lastBid) {
			if (data.lastBid[user].price > data.currentPrice - 0.09) 
					for (var i = 0; i < Math.min(20, userBidsArray.length); ++i) {
						if (userBidsArray[i].user == user)
							document.getElementById("users_a_" + i).innerText = "X";
					}
	}*/
	
}
