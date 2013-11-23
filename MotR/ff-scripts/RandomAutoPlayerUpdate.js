var ff = require('ffef/FatFractal');

function handleAutoPlayerUpdate() {
    // get collection name from parameters
    data = ff.getExtensionRequestData();
    parameters = data.httpParameters;

 	var allPlayersArr = ff.getArrayFromUri("/Player");

	var randPlayerIndex = Math.floor(Math.random()*(allPlayersArr.length-0)+0);
	var randPlayerLocationDecimal = (Math.random()*(1-0)+0);

	allPlayersArr[randPlayerIndex].latitude = 12 + randPlayerLocationDecimal;
	allPlayersArr[randPlayerIndex].longitude = 77 + randPlayerLocationDecimal;

	print(">>>>>>>>>>>>>>>>>" + allPlayersArr[randPlayerIndex].userName + "<<<<<<<<<<<<<<<<<<<<<<<");
	ff.updateObj(allPlayersArr[randPlayerIndex] , allPlayersArr[randPlayerIndex].createdBy);

	// get response object
    response = ff.response();
	
	response.responseCode = 200;
	response.statusMessage = "Server Connected";
	response.result = {message:allPlayersArr[randPlayerIndex].userName + " updated"};
	response.mimeType = "application/json";
}
 
exports.handleAutoPlayerUpdate = handleAutoPlayerUpdate;