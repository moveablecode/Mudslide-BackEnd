var ff = require('ffef/FatFractal');

function checkServerStat() {
    // get collection name from parameters
    data = ff.getExtensionRequestData();
    badCollection = data.httpParameters.badCollection;
 
    // get response object
    response = ff.response();
	
	response.responseCode = 200;
	response.statusMessage = "Server Connected";
	response.result = {status:"Connected"};
	response.mimeType = "application/json";
}
 
exports.checkServerStat = checkServerStat;