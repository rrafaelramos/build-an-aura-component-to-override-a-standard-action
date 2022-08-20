({
    navigateTo: function(component, recId) {

        let navEvt = $A.get("e.force:navigateToSObject");

        navEvt.setParams({
            "recordId": recId
        });

        navEvt.fire();
    }
    
})