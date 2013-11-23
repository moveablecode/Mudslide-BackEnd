var ff = require('ffef/FatFractal');

var RequestStat = 
{
    Busy : 0,
    Start : 1
};

var Realm = {
        kEarth : 0
        ,kWater : 1
        ,kFire : 2
        ,kLight : 3
        ,kDark : 4
    };

// location
function GeoLocation(data)
{
    if (data) {
        this.clazz = data.clazz;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.altitude = data.altitude;
        this.accuracy = data.accuracy;
        this.altitudeAccuracy = data.altitudeAccuracy;
        this.heading = data.heading;
        this.speed = data.speed;
        
    } else {
        this.clazz = "FFGeoLocation";
        this.latitude = 0e-15;
        this.longitude = 0e-15;
        this.altitude = null;
        this.accuracy = null;
        this.altitudeAccuracy = null;
        this.heading = null;
        this.speed = null;
    }
    return this;
}

// Player
function Player(data) {
    if (data) {
        this.clazz = data.clazz;    // String variable holds the class name
        this.userName = data.userName;  // String variable holds the user name
        this.location = data.location;  // Holds the location information of data type GeoLocation
        this.currentRealm = data.currentRealm; // Hold an enum of realm whose value is an integer
        this.latitude = data.latitude;  // Hold latitude of data type double
        this.longitude = data.longitude; // Hold longitude of data type double
        
    } else {
        this.clazz = "Player";  // String variable holds the class name
        this.userName = ""; // String variable holds the user name
        this.location = new GeoLocation();  // Holds the location information of data type GeoLocation
        this.currentRealm = Realm.kEarth;   // Hold an enum of realm whose value is an integer
        this.latitude = 0e-15;  // Hold latitude of data type double
        this.longitude = 0e-15; // Hold longitude of data type double
    }
    return this;
}

function PlayerRequest(data)
{
    if(data)
    {
        this.clazz = data.clazz;
        this.requestStatus = data.requestStatus;
        this.player = data.player;
    }
    else
    {
        this.clazz = "PlayerRequest";
        this.requestStatus = RequestStat.Busy;
        this.player = new Player();
    }
    return this;
}

function handlePlayerUpdate() {

    var updatedPlayerData = ff.getEventHandlerData();

    var totalRequestCount = ff.getResultCountForQuery("/ff/resources/RequestQueue");

    if(totalRequestCount == 0)
    {
        var newPlayerReqObj = new PlayerRequest();

        newPlayerReqObj.requestStatus = RequestStat.Start;

        print(JSON.stringify(newPlayerReqObj));

        newPlayerReqObj.player = updatedPlayerData;
        var newPlayerReqObjWithMetadata = ff.createObjAtUri(newPlayerReqObj, "/RequestQueue", updatedPlayerData.createdBy);

        print(">>>>>>>>>>>>>>>>>>>>>>>>>1<<<<<<<<<<<<<<<<<<<<<<");
    }
    else
    {
        var requestObj = ff.getObjFromUri("/ff/resources/RequestQueue/(createdBy eq '"
                                + updatedPlayerData.createdBy + "')");

        if(requestObj == null)
        {
            var newPlayerReqObj = new PlayerRequest();

            newPlayerReqObj.requestStatus = RequestStat.Busy;
            newPlayerReqObj.player = updatedPlayerData;

            var newPlayerReqObjWithMetadata = ff.createObjAtUrl(newPlayerReqObj, "/RequestQueue", updatedPlayerData.createdBy);
            print(">>>>>>>>>>>>>>>>>>>>>>>>>2<<<<<<<<<<<<<<<<<<<<<<");
        }
        else
        {
            requestObj.player = updatedPlayerData;
            ff.updateObj(requestObj, updatedPlayerData.createdBy);
        }
    }
}

exports.handlePlayerUpdate = handlePlayerUpdate;