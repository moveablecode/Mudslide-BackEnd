var ff = require('ffef/FatFractal');

function handleTopCelebrityCreate() {
    print("\t*** hoodyoodoo TopCelebrityEventHandlers got here\n");
    print("\n\n");
    print("\t*** hoodyoodoo TopCelebrityEventHandlers event handleTopCelebrityCreate handler\n");
    var data = ff.getEventHandlerData();
    /**
     * This will send push notifications to all hoodyoodoo users that have enabled push notifications for the hoodyoodoo application.
     */
    var userGuids = ff.getAllGuids("/FFUser");
    var messageString = data.firstName + " " + data.lastName + " is our new Top Celebrity!";
    if (userGuids.length != 0) ff.sendPushNotifications (userGuids, messageString);
    print("\n\n");
    print("\t*** hoodyoodoo TopCelebrityEventHandlers handleTopCelebrityCreate\n");
    print("\t*** sent mesage: " + messageString + "\n");
    print("\t*** to " + userGuids.length + " hoodyoodoo users\n");
    print("\t*** END hoodyoodoo TopCelebrityEventHandlers handleTopCelebrityCreate	\n");
    print("\n\n");
    //ff.send_mail("info@hoodyoodoo.com", "info@fatfractal.com", "The hoodyoodoo application sent the following message:\n\n to " + userGuids.length + "users.");
    }

exports.handleTopCelebrityCreate = handleTopCelebrityCreate;


