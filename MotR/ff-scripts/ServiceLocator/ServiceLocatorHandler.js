var ff = require('ffef/FatFractal');
var httpclient = require ('ringo/httpclient');
var {setTimeout} = require("ringo/scheduler");
var weatherReportHeader = require("scripts/WeatherReport/WeatherReportHeader");

var requestQueueArr = [];

// Base URL for worldweatheronline API call
var _FreeApiBaseURL = 'http://api.worldweatheronline.com/free/v1/';
/*
    Please change the FreeAPIKey to your own. 
    These keys have been provided for testing only.
    If you don't have one, then register now: http://developer.worldweatheronline.com/member/register    
*/
var _FreeApiKey = 'jacd2qkqghh8tuav7apt9euv';

// -------------------------------------------

var ServiceLocatorModal = {
	
	WeatherService : (function() {

		var self = {
			getWeatherForLatLong : function (location)	{
				var localWeatherInput = {
					query: location,
					format: 'JSON',
					num_of_days: '0',
					date: '',
					fx: '',
					cc: '',
					includelocation: '',
					show_comments: '',
					callback: LocalWeatherCallback,
					error: LocalWeatherErrorCallback
				};

				JSONP_LocalWeather(localWeatherInput);
			}
		};
		
		return self;
	})(),
	
	POIService : (function() {
		
		var self = {
			init : function ()	{
			
			}
		};
		
		return self;
	})()
};

// --------------------------------------------------

// Method to call Service locator if request valid
function RenderResponseForRequestQueue(player)
{
	if(player != null)
	{
		print(">>>>>>>>>>>>>>>>>>>>>>REQUEST VALID<<<<<<<<<<<<<<<<<<<<<<<<<<<");

		ServiceLocatorModal.WeatherService.getWeatherForLatLong(player.latitude + ',' + player.longitude);
	}
	else
	{
		print(">>>>>>>>>>>>>>>>>>>>>>REQUEST INVALID<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	}
}

function JSONP_LocalWeather(input) {
    var url = _FreeApiBaseURL + 'weather.ashx?q=' + input.query + '&format=' + input.format + '&extra=' + input.extra + '&num_of_days=' 
    		+ input.num_of_days + '&date=' + input.date + '&fx=' + input.fx + '&cc=' + input.cc 
    		+ '&includelocation=' + input.includelocation + '&show_comments=' + input.show_comments + '&key=' + _FreeApiKey;

    // setTimeout(sendRequest, 300, [url, input]);

    sendRequest([url, input]);
}

function sendRequest(parameters)
{
   	httpclient.get(parameters[0], "GET", parameters[1].callback, parameters[1].error);
}

// -------------------------------------------

// Method to initiate Service locator
function handleServiceLocator(requestObj) {

	print(">>>>>>>>>>>>>>>>>>>>>>SERVICE LOCATOR<<<<<<<<<<<<<<<<<<<<<<<<<<<");

	// Adding request in queue
	requestQueueArr.push(requestObj);

	if(requestQueueArr.length == 1)
	{
		print(">>>>>>>>>>>>>>>>>>>>>>BEGIN LOOP<<<<<<<<<<<<<<<<<<<<<<<<<<<");

		var currentPlayerObj = requestObj.player;

		RenderResponseForRequestQueue(currentPlayerObj);
	}
	else
	{
		print(">>>>>>>>>>>>>>>>>>>>>>LOOP CANCELLED<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	}
}

// Success callback for weather service
function LocalWeatherCallback(output)
{
	print(">>>>>>>>>>>>>>>>>>>>>>RETURN RESPONSE<<<<<<<<<<<<<<<<<<<<<<<<<<<");

	var locationData = JSON.parse(output);

	print(">>>>>>>>>>>>>>>>>>>>>>REQUEST DELETED<<<<<<<<<<<<<<<<<<<<<<<<<<<");

	// Deleting request from queue
	var currentRequestObject = requestQueueArr.shift();

	print(JSON.stringify(currentRequestObject));

	var currentPlayerObj = currentRequestObject.player;

	UpdateWeatherReportObject(locationData, currentPlayerObj);

	// Extracting next request from queue
	var nextPlayerObject = GetNextRequestInQueue(requestQueueArr);

	print(">>>>>>>>>>>>>>>>>>>>>>NEXT LOOP<<<<<<<<<<<<<<<<<<<<<<<<<<<");

	// Entering next loop with new request object
	RenderResponseForRequestQueue(nextPlayerObject);
}

// Error callback for weather service
function LocalWeatherErrorCallback(errorResponse) {
	print(">>>>>>>>>>>>>>>>>>>ERROR RESPONSE<<<<<<<<<<<<<<<");

	// Deleting request from queue
	var currentRequestObject = requestQueueArr.shift();

	// Extracting next request from queue
	var nextPlayerObject = GetNextRequestInQueue(requestQueueArr);

	print(">>>>>>>>>>>>>>>>>>>>>>NEXT LOOP<<<<<<<<<<<<<<<<<<<<<<<<<<<");

	// Entering next loop with new request object
	RenderResponseForRequestQueue(nextPlayerObject);
}

// Method to update weather report object for player
function UpdateWeatherReportObject(locationData, currentPlayerObj)
{
	// Get current weather report is available for the player
	var weatherReportData = ff.getObjFromUri("/WeatherReport/(createdBy eq '" + currentPlayerObj.createdBy + "')");

	// Create a new WeatherReport object if not found for the player
	if(weatherReportData == null)
	{
		var newWeatherReportObj = new weatherReportHeader.WeatherReport();

		weatherReportData = ff.createObjAtUri(newWeatherReportObj, "/WeatherReport", currentPlayerObj.createdBy);
	}

	// Update weather details if valid report values found
	if (weatherReportData && locationData.data.current_condition)
	{
		weatherReportData.observation_time	= locationData.data.current_condition[0].observation_time;
		weatherReportData.temp_C = locationData.data.current_condition[0].temp_C;
		weatherReportData.windspeedMiles = locationData.data.current_condition[0].windspeedMiles;
		weatherReportData.winddirDegree = locationData.data.current_condition[0].winddirDegree;
		weatherReportData.winddir16Point = locationData.data.current_condition[0].winddir16Point;
		weatherReportData.humidity = locationData.data.current_condition[0].humidity;
		weatherReportData.visibility = locationData.data.current_condition[0].visibility;
		weatherReportData.pressure = locationData.data.current_condition[0].pressure;
		weatherReportData.cloudcover = locationData.data.current_condition[0].cloudcover;

		ff.updateObj(weatherReportData);
	}

	print(JSON.stringify(weatherReportData));
	print(">>>>>>>>>>>>>>>>>>>>>>WEATHER UPDATED<<<<<<<<<<<<<<<<<<<<<<<<<<<");
}

// Method to get next request in queue for the service locator
function GetNextRequestInQueue(requestQueueArr)
{
	print(requestQueueArr.length);

	if(requestQueueArr.length > 0)
	{
		var currentPlayerObj = requestQueueArr[0].player;

		return currentPlayerObj;
	}
	else
	{
		return null;
	}
}

exports.handleServiceLocator = handleServiceLocator;
