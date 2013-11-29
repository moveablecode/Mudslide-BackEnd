var ff = require('ffef/FatFractal');

function checkServerStat() {
    // get collection name from parameters
    var data = ff.getExtensionRequestData();

    // get response object
    var response = ff.response();
	
	response.responseCode = 200;
	response.statusMessage = "Server Connected";
	response.result = {status:"Connected"};
	response.mimeType = "application/json";
}
 
exports.checkServerStat = checkServerStat;