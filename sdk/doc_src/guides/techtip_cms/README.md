Call Management Cookbook
===

Overview
---
This cookbook explains how to create an instance of Att.Provider class in your app and use it to access the Call Management Services (CMS) API through the AT&T API Platform for HTML5.

What do I need to start?
---

1. Include Att.Provider as a dependency by declaring it in the "requires" section of your class definition.

		Ext.define('MyApp.MyController', {
			extend  : 'Ext.Controller',
			requires: [
				'Att.Provider'
				//more dependencies here ... 
			],

		   //...
		});

2. Create an instance of Att.Provider

		var provider = Ext.create('Att.Provider');


###Tip! Call Management works only within the AT&T network

If you are using CMS to create outbound calls, you may only use valid AT&T subscriber numbers. Any number that is not on the AT&T network will return a scripting error.


How does my script know if it is handling an outbound or an incoming call?
---

When your script is executed by the CMS API, the environment variable 'currentCall' is made available to your script. If your script is triggered because of an incoming call, the **currentCall** variable is populated with information regarding the connection. If your script is triggered because of a call to the Att.Provider.cmsCreateSession method, the **currentCall** variable is null until you initiate the CMS **call** method.

The following snippet of Javascript code shows how to check for the call type (incoming or outgoing). This code can be placed safely at the top of your script before any calls are made to CMS methods:

	var callType = getCallType();

	if (callType == 'incoming') {
		// execute incoming call section of your script
	}
	else {
		// execute outbound call section of script
	}

	function getCallType() {
		return (currentCall == null) ? 'outgoing' : 'incoming';
	}


###Tip! Make your script versatile

When you setup your application in the AT&T Developer portal, you may only specify one CMS script to be executed per application. If you need to create outgoing calls and receive incoming calls in your application, be aware that your CMS script must be capable of handling both functions. We recommend that you logically segment your application into two separate functions or sections, one for answering (receiving incoming calls) and one for calling (creating outgoing calls).

How do I make a single script perform multiple tasks?
---

Since you can only configure a single script per application, an effective way to make a single script perform multiple tasks is to use the ability of the CMS API to pass parameters to your script. By passing a parameter that specifies a method to perform, you can easily create a multi-functional script. In the following code snippet, the parameter 'cmsMethod' is passed to specify an action to perform:

	...

	switch (cmsMethod); {
		case 'remindPassword':
			remindPassword();
			break;
		case 'sendBirthdayGreeting':
			say("Happy Birthday! Thank you for being a member");
			break;
		default: 
			break;
	}


	function remindPassword() {
		...
	}

Can I use my own audio files for prompts ?
---

Absolutely! CMS allows you to specify any valid URL which points to an MP3 audio file for use with the **say** or **ask* methods. You can even combine text and audio urls in the same command: 

	var welcomeMessage = "http://mysite.mydomain.com/path/to/music/file.mp3";

	say("Hi " + customerName + ". " + welcomeMessage, {
		allowSignals: "stopMessage",
		onSignal: function(event) {
			// do something
		}
	})

How does my script know who is calling it ?
---

Your script can be launched by creating a session using the APIs. However, it is also launched when someone calls the phone number or sip address provisioned for your application. When your script is launched as a result of an incoming call, CMS automatically provides an object **currentCall** which is immediately available for use with your script. This object has a property named 'callerID' which contains either the phone number or the SIP address of the incoming caller. Note that if the caller has disabled caller ID functions, the value for this property will be 'Unknown'.

	var callType = getCallType();

	if (callType == 'incoming') {
		var callerID = currentCall.callerID;
	}

###Tip! Trim the CallerID

The callerID found in currentCall can contain a leading "+1". If you wish to use the number to compare it against 10 digit numbers, you will need to first remove the beginning prefix.

	var callerID = currentCall.callerID.replace("+1", "");

	if (callerID == "4155551212") {
		// do something
	}

