var ff = require('ffef/FatFractal');

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

	// output = "<br/> Cloud Cover: " + localWeather.data.current_condition[0].cloudcover;
	// output += "<br/> Humidity: " + localWeather.data.current_condition[0].humidity;
	// output += "<br/> Temp C: " + localWeather.data.current_condition[0].temp_C;
	// output += "<br/> Visibility: " + localWeather.data.current_condition[0].weatherDesc[0].value;
	// output += "<br/> Observation Time: " + localWeather.data.current_condition[0].observation_time;
	// output += "<br/> Pressue: " + localWeather.data.current_condition[0].pressure;
	print("***************************2*******************************");
	ReturnResponse(localWeather);
}

// Helper Method
function sendRequest(url, callback) {
    var httpclient = require ('ringo/httpclient');
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

function handleServiceLocator() {
	ServiceLocatorModal.WeatherService.getWeatherForLatLong('Bangalore');
}

function ReturnResponse(output)
{
	// get collection name from parameters
    data = ff.getExtensionRequestData();
    badCollection = data.httpParameters.badCollection;
 
    // get response object
    response = ff.response();
	
	response.responseCode = 200;
	response.statusMessage = "OK";
	response.result = output;
	response.mimeType = "application/json";
}

exports.handleServiceLocator = handleServiceLocator;
