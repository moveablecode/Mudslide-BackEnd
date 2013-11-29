// Class Weather Report
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
        this.clazz = "WeatherReport";	// Defining class name to be 'WeatherReport'
		this.observation_time	= "";	// Time of observation
		this.temp_C = -1;				// Temperature in celsius
		this.windspeedMiles = 0;		// Wind speed in miles
		this.winddirDegree = 0;			// Wind direction in degrees
		this.winddir16Point = "N";		// Wind direction in 16-point compass notation
		this.humidity = 0;				// Humidity in air
		this.visibility = 0;			// Visibility in distance Km
		this.pressure = 0;				// Atmospheric pressure
		this.cloudcover = 0;			// Cloud covered in percentage
    }
    return this;
}

exports.WeatherReport = WeatherReport;
