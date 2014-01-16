Device Capabilities Cookbook
===

Overview
---
This cookbook explains how to create an instance of the Att.Provider class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 to get the required consent from the user and obtain the capabilities of their device.

What do I need to start?
---

1. Include Att.Provider as a dependency by declaring it in the "requires" section of your class definition  

        Ext.define('MyApp.MyController', {
            extend  : 'Ext.Controller',
            requires: [
                'Att.Provider'
                //more dependencies here ... 
            ],

           //...
        });

2. Create an instance of the Att.Provider class

        var provider = Ext.create('Att.Provider');

###Tip! Get authorization first

The Device Capabilities API requires user consent to obtain location information for a given mobile device. Att.Provider has a method to request authorization from the user to allow your application to obtain that information.

When you ask for authorization you ask the user to grant permission for access to specific information about their device, or about functions performed on behalf of the device (the authorization scope). For Device Capabilities, the authorization scope is **DC** and may be obtained as shown in the following section.


###Tip! Device Capabilities Authorization only works when you are on AT&T Network

The required consent for Device Capabilities can only be obtained on AT&T Network. When requesting consent, you must prompt the user to ensure that they are using the AT&T Network and not a Wi-Fi connection; otherwise, the consent will be automatically rejected.

###Tip! Check if the application is already authorized  

To avoid having the user authorize your application on every single call to the Device Capabilities API, use the Att.Provider.isAuthorized method to check if the application is already authorized for the specified scope.  

        provider.isAuthorized({
            authScope : 'DC',
            success   : onIsAuthorized,
            failure   : onIsNotAuthorized
        });

        function onIsAuthorized() {
            /* call to device capabilities goes here */
        } 

        function onIsNotAuthorized(){
            /* You can call here to provider.authorizeApp */
        } 


How do I get the Device Capabilities?
---

1. **Authorize the application for DC scope **  
    
    To authorize your application for a given scope, use the Att.Provider.authorizeApp method.

        provider.authorizeApp({
            authScope : 'TL',
            success   : onAuthSuccess,
            failure   : onAuthFailure
        });

        function onAuthSuccess(response) {
            //call to device capabilities goes here
        };

        function onAuthFailure(error) {
            //handle your errors here
        }


2. **Get the Device Capabilities information **  

    Once the application is authorized, retrieve the location information of the device by calling the Att.Provider.getDeviceLocation method. 

        provider.getDeviceInfo({
            success : onSuccess,
            failure : onFailure
        });

        //callback for success response
        function onSuccess(response){
            // you can handle here the response
            console.log(response);
        };

        //callback for failed call
        function onFailure(error){
            // you can handle the error
            console.log(error);
        };



