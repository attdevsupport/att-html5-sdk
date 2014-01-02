Device Location Cookbook
===

Overview
---
This guide explains the usage of the Att.Provider for retrieving the Device Location using the AT&T HTML5 SDK Platform.

What do I need to start?
---

- **Include Att.Provider by declaring it as a required on your class definition.**  

<code>
	Ext.define('MyApp.MyController', {
		extend  : 'Ext.Controller',
		requires: [
			'Att.Provider'
			//more dependencies here ... 
		],

		//...
	});  
</code>

- **Create an instance of Att.Provider**

<code>
	var provider = Ext.create('Att.Provider');
</code>

###Tip! Get authorization first!

Device Location requires user consent to obtain location information of a given mobile device. Att.Provider has a method to request authorization from the user to allow your application to obtain that information.

When you ask for authorization you ask the user to grant permission to access specific information about their device, or functions performed on behalf of the device (authorization scope). For Terminal Location, the authorization scope is **TL** and may be obtained as shown below.


How do I get the Device Location?
---

- ** Step 1: Authorize the application for TL scope **  
	
	To authorize your application for a given scope you use Att.Provider.authorizeApp method.

<code>
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
</code>

The authorizeApp method displays an AT&T consent screen where the user can enter their phone number or login with account user/password credentials. Control is returned back to your application after consent is granted or denied.

###Tip! Check if the application is already authorized  

If you don't want the user to authorize the application on every single call, you can use the Att.Provider.isAuthorized method to check if the application is already authorized for the given scope.  

<code>
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
</code>

- ** Step 2: Get the Device Location information **

Once the applicationis authorized, we can retrieve the location information of the device by calling the Att.Provider.getDeviceLocation method. 

<code>
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

</code>  

Almost all parameters are optional. Check Att.Provider.getDeviceLocation documentation for detailed information about all method parameters and their default values.
