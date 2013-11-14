var ff = require('ffef/FatFractal');

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
        this.clazz = data.clazz;	// String variable holds the class name
		this.userName = data.userName;	// String variable holds the user name
		this.location = data.location;	// Holds the location information of data type GeoLocation
		this.currentRealm = data.currentRealm; // Hold an enum of realm whose value is an integer
		this.latitude = data.latitude;	// Hold latitude of data type double
		this.longitude = data.longitude; // Hold longitude of data type double
		
    } else {
        this.clazz = "Player";	// String variable holds the class name
		this.userName = "";	// String variable holds the user name
		this.location = new GeoLocation();	// Holds the location information of data type GeoLocation
		this.currentRealm = Realm.kEarth;	// Hold an enum of realm whose value is an integer
		this.latitude = 0e-15;	// Hold latitude of data type double
		this.longitude = 0e-15;	// Hold longitude of data type double
    }
    return this;
}

function handlePlayerCreate() {

    var data = ff.getEventHandlerData();

	var newPlayer = ff.getObjFromUrl("/ff/resources/Player/(createdBy eq '" + data.createdBy + "')");
	
	if(newPlayer == null)
	{
		// create Player object
		newPlayer = new Player();
		
		newPlayer.createdBy = data.guid;
		newPlayer.userName = data.userName;
		
		var newPlayerWithMetadata = ff.createObjAtUri(newPlayer, "/Player");
		
		// add a reference to the FFUser object
		ff.addReferenceToObj(data.ffUrl, "ffUser", newPlayerWithMetadata);
	}
}

exports.handlePlayerCreate = handlePlayerCreate;