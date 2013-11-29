// Importing required headers
var ff = require('ffef/FatFractal');
var sl = require('scripts/ServiceLocator/ServiceLocatorHandler');

// PlayerRequest object holds the updated Player object info
function PlayerRequest(data)
{
    if(data)
    {
        this.player = data.player;
    }
    else
    {
        this.player = null;
    }
    return this;
}

// Handler method called when any Player object is updated
function handlePlayerUpdate() {

    var updatedPlayerData = ff.getEventHandlerData();

    var playerRequestObj = AddPlayerRequestObject(updatedPlayerData);

    print(">>>>>>>>>>>>>>SERVICE INITIATE<<<<<<<<<<<<<<<<<");

    // Triggering service locator by passing PlayerRequestObj
    sl.handleServiceLocator(playerRequestObj);
}

// Function to add new PlayerRequest object to the /RequestQueue collection
function AddPlayerRequestObject(updatedPlayerData)
{
    var newPlayerReqObj = new PlayerRequest();

    newPlayerReqObj.player = updatedPlayerData;

    return newPlayerReqObj;
}

// Declaring handlePlayerUpdate method to be public
exports.handlePlayerUpdate = handlePlayerUpdate;