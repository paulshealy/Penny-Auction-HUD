
// map from tab ID to auction data
var auctionData = {};

// var dataSent = false;

// the last row with data
var lastItem = -1;

var numberGridRows = 5;

var dataChanged = false;

// map from row # in the grid to tab ID
var auctionRows = {};

function emptyData(rowNumber) {
	var data = {
			currentPrice: 0,
			hasEnded: false,
			description: "",
			endDate: "",
			itemWorth: null,
			bidHistory: [],
			currentTime: null,
			timeDisplay: "",
			userBids: {},	// how many bids has this user made?
			bidsSeen: {},	// has a bid at a given price point already been seen? 
			lastBid: {},		// what is the price of the user's last bid?
			times: [],
			active: false,		// is this the active auction?
			rowNumber: rowNumber,
			auctionID: -1,
			bidPrice: -1,
			isDirty: true,
			tabID: -1
		};   
	dataChanged = true;
		return data;
		
}

function savePageInfo(o) {   
	dataChanged = true;
	var auctionID = parseInt(o.auctionID);
	var tabID = parseInt(o.tabID);
	if (auctionData[tabID] == null) {
		lastItem = lastItem + 1;
		auctionData[tabID] = {
			currentPrice: 0,
			hasEnded: false,
			description: "",
			endDate: "",
			itemWorth: null,
			bidHistory: [],
			currentTime: null,
			timeDisplay: "",
			userBids: {},	// how many bids has this user made?
			bidsSeen: {},	// has a bid at a given price point already been seen? 
			lastBid: {},		// what is the price of the user's last bid?
			times: [],
			active: false,		// is this the active auction?
			rowNumber: lastItem,
			auctionID: auctionID,
			bidPrice: o.bidPrice,
			isDirty: false,
			tabID: tabID
		};
		auctionRows[lastItem] = tabID;
	}
	var data = auctionData[tabID];
    data.hasEnded = o.hasEnded;
    data.timeDisplay = o.timeDisplay;
    
    if (data.hasEnded) {	
    
            stop(auctionID);		
            data.isDirty = true;
			dataChanged = true;
            /*if (hasCompleteBidHistory()) {
					if (!dataSent) {
                            dataSent = true;
                            saveData();
                    }
					
            }
			*/
            return;
    }
    
    data.currentPrice = parseFloat(o.currentPrice.replace('$', ''));
    if (o.itemWorth != null)
            data.itemWorth = parseFloat(o.itemWorth.replace('$', ''));
    data.description = o.description;
    data.endDate = o.endDate;
	data.currentTime = o.currentTime;		
	data.priceHistory = o.priceHistory;
	
	// get the "click" time
	var ticks = new Date().getTime();
	data.times.push({ClockTime: ticks, AuctionTime: data.currentTime});
	while (data.times.length > 0 && ticks - data.times[0].ClockTime > 1000) {
		data.times.shift();
	}			

    data.isDirty = true;
	dataChanged = true;
	
    /*if (autoBidActive) {
        autoBid();
    }
	*/
} 