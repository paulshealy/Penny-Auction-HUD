var url = window.location.href;
var slashLoc = url.lastIndexOf('/');
var shortUrl = url.substring(slashLoc + 1);
var dashLoc = shortUrl.indexOf('-');	
var auctionID = shortUrl.substring(0, dashLoc);
 
//alert(document.getElementById('button_' + auctionID));
var link = document.getElementById('button_' + auctionID);
 var event = document.createEvent("MouseEvents");
event.initMouseEvent("click", true, true, window,
	0, 0, 0, 0, 0,
	false, false, false, false,
	0, null);
cancelled = !link.dispatchEvent(event);	