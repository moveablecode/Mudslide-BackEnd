var ff = require('ffef/FatFractal');
var httpclient = require ('ringo/httpclient');

var currentRequestObject = null;

var RequestStat = 
{
    Busy : 0,
    Start : 1
};

// Weather Report
function WeatherReport(data) {
    if (data) {
        this.clazz = data.clazz;
		this.observation_time	= data.observation_time;
		this.temp_C = data.temp_C;
		this.windspeedMiles = data.windspeedMiles;
		this.winddirDegree = data.winddirDegree;
		this.winddir16Point = data.winddir16Point;
		this.humidity = data.humidity;
		this.visibility = data.visibility;
		this.pressure = data.pressure;
		this.cloudcover = data.cloudcover;
    } else {
        this.clazz = "WeatherReport";
		this.observation_time	= "";
		this.temp_C = -1;
		this.windspeedMiles = 0;
		this.winddirDegree = 0;
		this.winddir16Point = "N";
		this.humidity = 0;
		this.visibility = 0;
		this.pressure = 0;
		this.cloudcover = 0;
    }
    return this;
}

var _FreeApiBaseURL = 'http://api.worldweatheronline.com/free/v1/';
/*
    Please change the FreeAPIKey to your own. 
    These keys have been provided for testing only.
    If you don't have one, then register now: http://developer.worldweatheronline.com/member/register    
*/
var _FreeApiKey = 'jacd2qkqghh8tuav7apt9euv';

// -------------------------------------------

function JSONP_LocalWeather(input) {
    var url = _FreeApiBaseURL + 'weather.ashx?q=' + input.query + '&format=' + input.format + '&extra=' + input.extra + '&num_of_days=' + input.num_of_days + '&date=' + input.date + '&fx=' + input.fx + '&cc=' + input.cc + '&includelocation=' + input.includelocation + '&show_comments=' + input.show_comments + '&key=' + _FreeApiKey;

    sendRequest(url, input.callback);
}

function LocalWeatherCallback(localWeather) {
	ReturnResponse(localWeather);
}

// Helper Method
function sendRequest(url, callback) {
	httpclient.get(url, 'GET', callback);
}

// -------------------------------------------

var ServiceLocatorModal = {
	
	WeatherService : (function() {
		//var weatherAPI = require('scripts/ServiceLocator/freeAPI');
		
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
					callback: LocalWeatherCallback
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

function RenderResponseForRequestQueue(requestQueueObj)
{
	if(requestQueueObj != null)
	{
		print(">>>>>>>>>>>>>>>>>>>>>>REQUEST VALID<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		ServiceLocatorModal.WeatherService.getWeatherForLatLong(requestQueueObj.player.latitude + ',' + requestQueueObj.player.longitude);
	}
}

function handleServiceLocator() {

	print(">>>>>>>>>>>>>>>>>>>>>>SERVICE LOCATOR<<<<<<<<<<<<<<<<<<<<<<<<<<<");

	var playerRequestObj = ff.getEventHandlerData();

	if(playerRequestObj.requestStatus == RequestStat.Start)
	{
		print(">>>>>>>>>>>>>>>>>>>>>>BEGIN LOOP<<<<<<<<<<<<<<<<<<<<<<<<<<<");

		var requestQueueArr = ff.getArrayFromUri("/RequestQueue?sort=updatedAt asc");

		currentRequestObject = requestQueueArr[0];

		RenderResponseForRequestQueue(currentRequestObject);
	}
	else
	{
		print(">>>>>>>>>>>>>>>>>>>>>>LOOP CANCELLED<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	}

	// ServiceLocatorModal.WeatherService.getWeatherForLatLong('Bangalore');
}

function ReturnResponse(output)
{
	print(">>>>>>>>>>>>>>>>>>>>>>RETURN RESPONSE<<<<<<<<<<<<<<<<<<<<<<<<<<<");

	var locationData = JSON.parse(output);

	var weatherReportData = ff.getObjFromUrl("/ff/resources/WeatherReport/(createdBy eq '" + currentRequestObject.createdBy + "')");

	if(weatherReportData == null)
	{
		var newWeatherReportObj = new WeatherReport();

		weatherReportData = ff.createObjAtUri(newWeatherReportObj, "/WeatherReport", currentRequestObject.createdBy);
	}

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

	print(">>>>>>>>>>>>>>>>>>>>>>WEATHER UPDATED<<<<<<<<<<<<<<<<<<<<<<<<<<<");

	var requestQueueArr = ff.getArrayFromUri("/RequestQueue?sort=updatedAt asc");
	print(requestQueueArr.length + "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

	if(currentRequestObject.guid == requestQueueArr[0].guid)
	{
		ff.deleteObj(currentRequestObject);
		
		if(requestQueueArr.length > 1)
		{
			currentRequestObject = requestQueueArr[1];
		}
		else
		{
			currentRequestObject = null;
		}
	}
	else
	{
		currentRequestObject = requestQueueArr[0];
	}
	print(">>>>>>>>>>>>>>>>>>>>>>REQUEST DELETED<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	print(currentRequestObject);

	RenderResponseForRequestQueue(currentRequestObject);

	print(">>>>>>>>>>>>>>>>>>>>>>2<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	print(JSON.stringify(weatherReportData));
}

exports.handleServiceLocator = handleServiceLocator;
