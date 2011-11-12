
function parseTime(time)
{
	var times = time.split(':');

	if (times[0] == "00" && times[1] == "00")
		return parseInt(times[2], 10);

	if (times.length == 0)
		return parseInt(time, 10);
	if (times.length == 1)
		return parseInt(time, 10);
	if (times.length == 2) 
		return parseInt(times[1], 10) + parseInt(times[0], 10) * 60;

	if (times.length == 3)
		return parseInt(times[2], 10) + parseInt(times[1], 10) * 60 + parseInt(times[0], 10) * 60 * 60;
	alert('Invalid time ' + time);
}

function twoDigitString(value)
{
	if (value < 10)
		return "0" + value;
	return value;
}

function toDisplayTime(time)
{
	if (time < 60)
		return "00:" + twoDigitString(time);
	if (time < 60 * 60) {
		var minutes = Math.floor(time / 60);
		return twoDigitString(minutes) 
			+ ":" 
			+ twoDigitString(time - minutes * 60);
	}
	var hours = 0;
	var minutes = 0;
	var seconds = 0;
	
	hours = Math.floor(time / (60 * 60));
	time = time - hours * 60 * 60;
	minutes = Math.floor(time / 60);
	time = time - minutes * 60;
	seconds = time;
	
	if (hours > 0)
		return twoDigitString(hours) + ":" + twoDigitString(minutes) + ":" + twoDigitString(seconds);
	return twoDigitString(minutes) + ":" + twoDigitString(seconds);
}