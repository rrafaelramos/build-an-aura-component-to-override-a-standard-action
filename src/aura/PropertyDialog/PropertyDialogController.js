({
	doInit : function(component, event, helper) {

        let recordId  = component.get("v.recordId");

        if( recordId ) component.set("v.modalContext", "Edit");
        
		if(! recordId ) {
            component.find("forceRecord").getNewRecord(
                "Property__c"
                , null
                , false

                , $A.getCallback(function() {

                    let rec = component.get("v.propertyRecord");

                    let error = component.get("v.recordError");

                    if(error || (rec === null)) {
                        console.log("Error initializing record template: " + error);
                        return;
                    }
                })

            );
        }
	},
    
    saveRecord : function(component, event, helper) {
        
        let propBeds = parseInt(component.find('propBeds').get("v.value"), 10);
        let propBaths = parseInt(component.find('propBaths').get("v.value"), 10);
        let propPrice = parseInt(component.find('propPrice').get("v.value"), 10);
        
        component.set("v.propertyRecord.Name", component.find('propName').get("v.value"));    
        component.set("v.propertyRecord.Beds__c", propBeds);
        component.set("v.propertyRecord.Baths__c", propBaths);
        component.set("v.propertyRecord.Price__c", propPrice);
        component.set("v.propertyRecord.Status__c", component.find('propStatus').get("v.value"));
        
        let tempRec = component.find("forceRecord");
        
        tempRec.saveRecord($A.getCallback(function(result) {

            let resultsToast = $A.get("e.force:showToast");

            if (result.state === "SUCCESS") {
                
                resultsToast.setParams({
                    "title": "Saved",
                    "message": "The record was saved."
                });

                resultsToast.fire(); 

                let recId = result.recordId;
				helper.navigateTo(component, recId);
                return;
            } 
            
            if (result.state === "ERROR") {
                console.log('Error: ' + JSON.stringify(result.error));
                
                resultsToast.setParams({
                    "title": "Error",
                    "message": "There was an error saving the record: " + JSON.stringify(result.error)
                });
                
                resultsToast.fire();
                return;

            } 

            console.log('Unknown problem, state: ' + result.state + ', error: ' + JSON.stringify(result.error));

        }));

	},

    cancelDialog: function(component, event, helper) {

        let recordId = component.get("v.recordId");

        if( recordId ) {

            helper.navigateTo(component, recordId);
            return;
        }

        let homeEvt = $A.get("e.force:navigateToObjectHome");

        homeEvt.setParams({ "scope": "Property__c" });

        homeEvt.fire();

    }
})