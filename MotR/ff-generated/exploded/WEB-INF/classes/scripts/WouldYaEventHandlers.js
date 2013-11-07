var ff = require('ffef/FatFractal');

function handleWouldYaCreate() {
    var data = ff.getEventHandlerData();


    // add count record to selectedCelebrity
    var selectedCelebrity = ff.getObjFromUrl('/ff/resources/Celebrity/' + data.selectedGuid);

    // since we are adding selectedCount field to the ff/resources/Celebrity object lazily, make sure and set the initial value
    // else returns a null value the first time
    if(!selectedCelebrity.selectedCount) selectedCelebrity.selectedCount = 0;
    selectedCelebrity.selectedCount++;

    ff.updateObj(selectedCelebrity);



    // add count record to rejectedCelebrity
    var rejectedCelebrity = ff.getObjFromUrl('/ff/resources/Celebrity/' + data.rejectedGuid);

    // since we are adding rejectedCount field to the ff/resources/Celebrity object lazily, make sure and set the initial value
    // else returns a null value the first time
    if(!rejectedCelebrity.rejectedCount) rejectedCelebrity.rejectedCount = 0;
    rejectedCelebrity.rejectedCount++;

    ff.updateObj(rejectedCelebrity);


    // check if we have new TopCelebrity
    topCelebrityCheck = ff.getArrayFromUrl(['/ff/resources/TopCelebrity']);
    if(topCelebrityCheck.length == 0)  {
        topCelebrity =  ff.createObjAtUrl((selectedCelebrity), "/ff/resources/TopCelebrity");
        print("\t*** hoodyoodoo WouldyaEventHandlers created first currentTopCelebrity: " + topCelebrity.ffUrl + "\n");    
    } else {
        topCelebrity = topCelebrityCheck[0];
        if(selectedCelebrity.selectedCount > topCelebrity.selectedCount) {
            if (selectedCelebrity.guid == topCelebrity.guid) { // update the topCelebrity's counts
                topCelebrity.rejectedCount = selectedCelebrity.rejectedCount || 0;
                topCelebrity.selectedCount = selectedCelebrity.selectedCount;

                print ("Updating existing top celebrity's selected and rejected counts to ", topCelebrity.selectedCount, topCelebrity.rejectedCount);

                ff.updateObj(topCelebrity);
            } else { // it's a new one!
                print ("Setting new top celebrity to " + selectedCelebrity.firstName + " " + selectedCelebrity.lastName);

                ff.deleteObj(topCelebrity); 
                ff.createObjAtUrl(selectedCelebrity, "/TopCelebrity");

                user = data.createdBy;
                message = "Congratulations you have pushed " + selectedCelebrity.firstName + " " + selectedCelebrity.lastName + " to the top of the list!"; 
                if (user != null && message != null) {
                    ff.sendPushNotifications ([user], message);
                }
            }
        }
        else if (rejectedCelebrity.guid == topCelebrity.guid) { // update the topCelebrity's rejected count
                topCelebrity.rejectedCount = rejectedCelebrity.rejectedCount || 0;
                topCelebrity.selectedCount = rejectedCelebrity.selectedCount;

                print ("Updating existing top celebrity's selected and rejected counts to ", topCelebrity.selectedCount, topCelebrity.rejectedCount);

                ff.updateObj(topCelebrity);
        }
    }
}

exports.handleWouldYaCreate = handleWouldYaCreate;

