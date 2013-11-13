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
		this.latitude = 0;
		this.longitude = 0;
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
        this.clazz = data.clazz;
		this.userName = data.userName;
		this.location = data.location;
		this.currentRealm = data.currentRealm;
		
    } else {
        this.clazz = "Player";
		this.userName = "";
		this.location = new GeoLocation();
		this.currentRealm = Realm.kEarth;
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