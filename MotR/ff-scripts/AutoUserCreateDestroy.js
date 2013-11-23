var ff = require('ffef/FatFractal');

function User()
{
    this.userName = "";
	this.firstName = "";
	this.lastName = "";
	this.email = "";
    
    return this;
}

function handleAutoUserCreateDestroy() {
    // get collection name from parameters

    data = ff.getExtensionRequestData();
    parameters = data.httpParameters;

    print(">>>>>>>>>>>>>>>>>"+parameters.action+"<<<<<<<<<<<<<<<<<<<<<<<");
    var message = "";

    if(parameters.action == "create")
    {
	    for(var i = 1; i <= parameters.userCount; i++)
	    {
	    	var userDetail = new User();
	    	userDetail.userName = parameters.userPrefix + i;

	 		var newUserObj = registerUser(userDetail, userDetail.userName, true, true);
			print(">>>>>>>>>>>>>>>>>" + userDetail.userName + " CREATED<<<<<<<<<<<<<<<<<<<<<<<");
	    }

	    message = "Players created";
	}
	else if(parameters.action == "destroy")
	{
		ff.deleteAllForQuery("/FFUser");

		print(">>>>>>>>>>>>>>>>> DELETED<<<<<<<<<<<<<<<<<<<<<<<");
		message = "Players deleted";
	}

	// get response object
    response = ff.response();
	
	response.responseCode = 200;
	response.statusMessage = "Server Connected";
	response.result = message
	response.mimeType = "application/json";
}
 
exports.handleAutoUserCreateDestroy = handleAutoUserCreateDestroy;