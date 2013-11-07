
$(document).ready(function(){
    PlayerModal.init();
});

var G_DEBUG = false;
var serverStateObject = null;

var PlayerModal = (function() {
    var ff =  new FatFractal();
	
    var playerNameField = null;
    var playerPasswordField = null;
    var radiusRangeField = null;
	var latitudeField = null;
	var longitudeField = null;
    var loggedInUserLabel = null;
    var playerUpdateButton = null;
    var findPlayersButton = null;
	var allPlayerList = null;
	var playersInRangeList = null;
	var serverStatusLabel = null;
    
    var self = {
        init: function() {
            ff.setDebug(G_DEBUG);
			
            playerNameField = document.getElementById("playerNameField");
            playerPasswordField = document.getElementById("playerPasswordField");
            radiusRangeField = document.getElementById("radiusRangeField");
			latitudeField = document.getElementById("latitudeField");
			longitudeField = document.getElementById("longitudeField");
            loggedInUserLabel = document.getElementById("loggedInUserLabel");
            playerUpdateButton = document.getElementById("playerUpdateButton");
            findPlayersButton = document.getElementById("findPlayersButton");
			allPlayerList = document.getElementById("allPlayerList");
			playersInRangeList = document.getElementById("playersInRangeList");
			serverStatusLabel = document.getElementById("serverStatusLabel");
			
			this.getServerStatus();
			this.fillPlayerInfo();
			this.displayAllPlayers();
			this.displayOtherPlayersInRange();
        },

        fillPlayerInfo: function() {
            if(!ff.loggedIn()) {
                if(G_DEBUG) console.log("fillPlayerInfo() not logged in");
                //$("#wouldYaLoginPopup").popup('open');
            } else {
				ff.getObjFromUri("/Player/(createdBy eq '" + ff.loggedInUser().createdBy + "')",function(playerObj)
				{
					if(playerObj)
					{
						playerNameField.value = playerObj.userName;
						latitudeField.value = playerObj.location.latitude;
						longitudeField.value = playerObj.location.longitude;
						loggedInUserLabel.innerHTML = playerObj.userName;
					}
					
				}, this.onFailure);
            }
        },

        displayAllPlayers: function() {
		
			allPlayerList.innerHTML = "<li style=\"text-align: center;\"><label>No Data</label></li>";
			
            ff.getArrayFromUri("/Player",function(playerArr)
			{
				if(playerArr.length > 0) allPlayerList.innerHTML = "";
				for(var i = 0; i < playerArr.length; i++)
				{
					var listItem = document.createElement('li');
					var latitudeText = (parseFloat(playerArr[i].location.latitude) < 0)? "&ordm;S" : "&ordm;N";
					latitudeText = playerArr[i].location.latitude + latitudeText;
					var longitudeText = (parseFloat(playerArr[i].location.longitude) < 0)? "&ordm;W" : "&ordm;E";
					longitudeText = playerArr[i].location.longitude + longitudeText;
					listItem.innerHTML = "<label>" + playerArr[i].userName + "</label><label style=\"float:right;\">" 
										+ latitudeText + " "
										+ longitudeText + "</label>";
					
					allPlayerList.appendChild(listItem);
				}
				
				if(playerArr.length == 0)
				{
					var listItem = document.createElement('li');
					listItem.innerHTML = "<label style=\"float:center;\">No Data</label>";
					
					playersInRangeList.appendChild(listItem);
				}
				
			}, this.onFailure);
        },

        displayOtherPlayersInRange: function() {
			
			playersInRangeList.innerHTML = "<li style=\"text-align: center;\"><label >No Data</label></li>";
			
			if(!ff.loggedIn())
			{
				if(G_DEBUG) console.log("displayOtherPlayersInRange() not logged in");
			}
			else if(ff.loggedIn() && radiusRangeField.value != "")
			{
				
				
				ff.getObjFromUri("/Player/(createdBy eq '" + ff.loggedInUser().createdBy + "')",function(playerObj)
				{
					ff.getArrayFromUri("/Player/((distance(location, [" + playerObj.location.latitude + "," 
									+ playerObj.location.longitude + "]) lte " + radiusRangeField.value + "e3) and guid ne '" + playerObj.guid + "')",function(playerArr)
					{
						if(playerArr.length > 0) playersInRangeList.innerHTML = "";
						
						for(var i = 0; i < playerArr.length; i++)
						{
							var listItem = document.createElement('li');
							var latitudeText = (parseFloat(playerArr[i].location.latitude) < 0)? "&ordm;S" : "&ordm;N";
							latitudeText = playerArr[i].location.latitude + latitudeText;
							var longitudeText = (parseFloat(playerArr[i].location.longitude) < 0)? "&ordm;W" : "&ordm;E";
							longitudeText = playerArr[i].location.longitude + longitudeText;
							listItem.innerHTML = "<label>" + playerArr[i].userName + "</label><label style=\"float:right;\">" 
												+ latitudeText + " "
												+ longitudeText + "</label>";
							
							playersInRangeList.appendChild(listItem);
						}
						
					}, self.onFailure);
					
					loggedInUserLabel.innerHTML = playerObj.userName;
					
				}, this.onFailure);
				
				
			}
        },
    
        onUpdateAction: function() {
			
			if(!ff.loggedIn())
			{
				ff.login(playerNameField.value, playerPasswordField.value, function(result)
				{
					self.updatePlayerInfo();
				}, this.onFailure);
			}
			else if(ff.loggedInUser().userName != playerNameField.value)
			{
				ff.logout(function()
				{
					ff.login(playerNameField.value, playerPasswordField.value, function()
					{
						self.updatePlayerInfo();
					}, this.onFailure);
				}, this.onFailure);
			}
			else
			{
				this.updatePlayerInfo();
			}
        },
		
		updatePlayerInfo: function() {
			ff.getObjFromUri("/Player/(createdBy eq '" + ff.loggedInUser().createdBy + "')",function(playerObj)
			{
				playerObj.location.latitude = latitudeField.value;
				playerObj.location.longitude = longitudeField.value;
				
				loggedInUserLabel.innerHTML = playerObj.userName;
				
				ff.updateObj(playerObj , function()
				{
					self.displayAllPlayers();
					self.displayOtherPlayersInRange();
				}, self.onFailure);
				
			}, this.onFailure);
		},

        onFindPlayerAction: function() {
		this.displayOtherPlayersInRange();
        },
		
		getServerStatus: function() {
			ff.getObjFromUri("../ext/serverStatus", function(response) {
				serverStateObject = response;
				serverStatusLabel.innerHTML = serverStateObject.status;
				serverStatusLabel.style.color = "green";
				console.log(serverStateObject);
			}, function(response)
			{
				console.log(response);
			});
		},
		
		onSuccess: function(result) {
			console.log(result);
		},
		
		onFailure: function(result) {
			if(result == 401)
			{
				alert("Incorrect password");
			}
			console.log(result.ffRL + "failed");
		}
    };
    return self;
})();

