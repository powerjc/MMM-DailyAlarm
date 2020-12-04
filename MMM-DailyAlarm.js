Module.register("MMM-DailyAlarm", {
	// Default module config.
	defaults: {
		event: "New Millenium:",
		date: "3000-01-01",
		showHours: true,
		showMinutes: true,
		showSeconds: true,
		customInterval: 1000,
		daysLabel: 'd',
		hoursLabel: 'h',
		minutesLabel: 'm',
		secondsLabel: 's',
    userlat: "",
    userlon: "",
    beforeText: "Alarm",
    afterText: "", //If omitted or null or "", `beforeText` will be used after time.

	},

	// set update interval
	start: function() {
		var self = this;
		setInterval(function() {
			self.updateDom(); // no speed defined, so it updates instantly.
		}, this.config.customInterval); 
	},

  getStyles: function() {
    return ["MMM-DailyAlarm.css"]
  },

	// Update function
	getDom: function() {
		var wrapper = document.createElement("div");

		var timeWrapper = document.createElement("div");
		var textWrapper = document.createElement("div");

		textWrapper.className = "align-left week dimmed medium";
		timeWrapper.className = "time bright xlarge light";
		textWrapper.innerHTML=this.config.event;

		var today = new Date(Date.now());
		var target = new Date(this.config.date);
		var timeDiff = target - today;

		// Set days, hours, minutes and seconds
		var diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		var diffHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var diffMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
		var diffSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
		
		// Build the output
		var hrs = '';
		var mins = '';
		var secs = '';
		var days = diffDays + this.config.daysLabel;
    
    var srss = getSRSS();
    var sunset = srss.sunset;
    var utcsunset = moment.utc(sunset).toDate(); //utcsunset is the date we want to provde as the event
    //var sunset = config.timeFormat == 12?
    //moment(utcsunset.local().format("h:mm");
    //moment(utcsunset.local().format("HH:mm");
    
    
		if(this.config.showHours == true) hrs = diffHours + this.config.hoursLabel;
		if(this.config.showMinutes == true) mins = diffMinutes + this.config.minutesLabel;
		if(this.config.showSeconds == true) secs = diffSeconds + this.config.secondsLabel;

		timeWrapper.innerHTML = days + hrs + mins + secs;

		wrapper.appendChild(textWrapper);
		wrapper.appendChild(timeWrapper);

		return wrapper;
	}

  prepareAllEvents: function() {
    for (i in this.config.alarms) {
      this.prepareEvent(i, this.config.alarms[i])
    }
    this.updateTimestamp = moment().format("YYYY-MM-DD")
  },
  getSRSS: function() {
     var self = this;
     url = "https://api.sunrise-sunset.org/json?lat="+this.config.userlat+"&lng="+this.config.userlon+"&formatted=0";
     request(url, function(error, response, body) {
         if (error) {
             console.log("Error: " + err.message);
         }
         return pasreSRSS(body);
     });
  },
  parseSRSS: function(response) {
     var srss = JSON.parse(response);
     sun = {
       sunrise: srss.results.sunrise,
       sunset: srss.results.sunset,
       day: srss.results.day_length
     }
     return sun;
  },
});
