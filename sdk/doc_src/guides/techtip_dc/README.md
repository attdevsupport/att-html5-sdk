Device Capabilities Cookbook
===

Overview
---
This cookbook explains how to create an instance of the AttApiClient class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 to get the required consent from the user and obtain the capabilities of their device.

What do I need to start?
---

1. Include att-api-client.js as a dependency by including it in your HTML:  

        <script type="text/javascript" src="att-api-client.js"></script>

Adjust the _src_ attribute value to match the site path where you store the _att_api_client.js_ file.

###Tip! Get authorization first

The Device Capabilities API requires user consent to obtain device information for a given mobile device. AttApiClient has a method to request authorization from the user to allow your application to obtain that information.

When you ask for authorization you ask the user to grant permission for access to specific information about their device, or about functions performed on behalf of the device (the authorization scope). For Device Capabilities, the authorization scope is **DC** and may be obtained as shown in the following section.


###Tip! Device Capabilities Authorization only works when you are on AT&T Network

The required consent for Device Capabilities can only be obtained on AT&T Network. When requesting consent, you must prompt the user to ensure that they are using the AT&T Network and not a Wi-Fi connection; otherwise, the consent will be automatically rejected.

###Tip! Check if the application is already authorized  

To avoid having the user authorize your application on every single call to the Device Capabilities API, use the AttApiClient.isUserAuthorized method to check if the application is already authorized for the specified scope.  

        att.isUserAuthorized('DC', onIsAuthorized, onIsNotAuthorized);

        function onIsAuthorized() {
            /* call to device capabilities goes here */
        } 

        function onIsNotAuthorized(){
            /* You can call here to att.authorizeUser */
        } 


How do I get the Device Capabilities?
---

1. **Authorize the application for DC scope **  
    
    To authorize your application for a given scope, use the Att.Provider.authorizeUser method.

        att.authorizeUser({scope:'DC'}, onIsAuthorized, onIsNotAuthorized);

        function onAuthSuccess(response) {
            //call to device capabilities goes here
        };

        function onAuthFailure(error) {
            //handle your errors here
        }

The call to _authorizeUser_ may redirect the current page away if authorization is necessary. By default, when authorization is complete, the browser will be redirected back to the current page. For more details about authorization options, refer to the _authorizeUser_ API documentation.

2. **Get the Device Capabilities information **  

    Once the application is authorized, retrieve the device information of the device by calling the AttApiClient.getDeviceInfo method. 

        att.getDeviceInfo(onSuccess, onFailure);

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
