Location Cookbook
===

Overview
---
This cookbook explains how to create an instance of the Att.Provider class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 to get the required authorization from the user and retrieve their device location.

What do I need to start?
---

1. **Include Att.Provider as a dependency by declaring in the "requires" section of the class definition.**  


		Ext.define('MyApp.MyController', {
			extend  : 'Ext.Controller',
			requires: [
				'Att.Provider'
				//more dependencies here ... 
			],

			//...
		}); 


2. **Create an instance of the Att.Provider class**

		var provider = Ext.create('Att.Provider');


###Tip! Get authorization first

Device Location requires user consent to obtain location information for a given mobile device. The Att.Provider class contains a method to request authorization from the user that allows your application to obtain that information.

When you ask for authorization you ask the user to grant permission for access to specific information about their device, or about functions performed on behalf of the device (the authorization scope). For Terminal Location (Device Location), the authorization scope is **TL** and may be obtained as shown in the "How do I get the Device Location" section.

    
###Tip! Check if the application is already authorized  

To avoid having the user authorize your application on every single call to the Device Location API, use the Att.Provider.isAuthorized method to check if the application is already authorized for the specified scope.  

		provider.isAuthorized({
			authScope : 'TL',
			success   : onIsAuthorized,
			failure   : onIsNotAuthorized
		});

		function onIsAuthorized() {
			/* call to device location goes here */
		} 

		function onIsNotAuthorized(){
			/* You can call here to provider.authorizeApp */
		} 



How do I get the Device Location?
---

1. **Authorize the application for TL scope **  
	
	To authorize your application for a given scope use Att.Provider.authorizeApp method.

		provider.authorizeApp({
			authScope : 'TL',
			success   : onAuthSuccess,
			failure   : onAuthFailure
		});

		function onAuthSuccess(response) {
			//call to device location goes here
		};

		function onAuthFailure(error) {
		  	//handle your errors here
		}


	The authorizeApp method displays an AT&T consent screen where the user can enter their phone number or login with their user account/password credentials. Control is returned back to your application after consent is granted or denied.  
    
      
2. **Get the Device Location information **  

	Once the application is authorized, retrieve the location information of the device by calling the Att.Provider.getDeviceLocation method. 

		provider.getDeviceLocation({
			requestedAccuracy : 100,
			acceptableAccuracy, 1000,
			tolerance: 'DelayTolerant',
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


Almost all the parameters of this method are optional. Check the Att.Provider.getDeviceLocation documentation for detailed information about all  parameters of this methods and their default values.
