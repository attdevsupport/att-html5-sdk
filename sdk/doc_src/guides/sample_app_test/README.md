#Using the Sample Apps

Now that you have set up the server component of the SDK, you should be able to load the **Sample Apps** in your supported Web browser.

The following section describes how to test your connection to the AT&T APIs using each Sample App.


##OAuth
In-App Messaging require users to authorize your app using OAuth consent. The SDK facilitates this process by presenting the user with the AT&T API Platform access page, capturing their authorization code, requesting and storing the user’s access token. The user needs to authorize consent only once per session.

A user accessing In-App Messaging features will be presented with a Consent Request screen requesting app authorization to an AT&T wireless number or account. The authorization is performed automatically if you are on the AT&T network.

(**) The following authentication pages are from AT&T servers, not the SDK. The UI may be updated and appear differently than these examples.

There are several authentication methods you can use, but the easiest and fastest method is using an AT&T device with an active wireless number to send an authorization password to the AT&T short code:

![Oauth](resources/images/sample_apps_screens/oauth-one.png)

When the correct password is received, you will see a screen like the following indicating that you have authorized the request:

![Oauth](resources/images/sample_apps_screens/oauth-close.png)

Make sure to select "Close window" to redirect the user back to your app and deliver the OAuth token to the server.

##SMS
This sample app demonstrates SMS messages sent from and to your app.

Point your browser to this address: 

    http://{yourdomain}:{port}/SMS/App1/index.html 

This sample app showcases three different features. The first one sends a short message to a given phone number: enter the _Phone Number_ and the _Message_ and press the **Send Message** button. 

After sending your message, you will see a screen showing the **Message ID** that corresponds to the sent message.
 
To retrieve the status of the message, tap **Get Status**. 

To check the messages sent to a specific short code, you must have at least one short code configured on your AT&T Developer Program app. To add a short code, open the configuration file at this location:  

	/webcontent/SMS/App1/app/Config.js

Configure the parameters for the short codes:
     
    /**
     * short code or Registration ID
     */
    shortCode         : 'your short code here',
    
    /**
     * short code or Registration ID used on SMS sample app to receive messages from the second button
     */
    anotherShortCode  : 'a second short code here',

To retrieve messages sent to the short code, tap **Get Messages for Short Code**.


##SMS Voting
Point your browser to this address: 

    http://{yourdomain}:{port}/SMS/App2/index.html 

This sample app demonstrates the callback functionality. In this sample, the app counts votes sent to a specific short code using specific text in the message body. 

To configure your short code on the app, open the configuration file at this location:  

	/webcontent/SMS/App2/app/Config.js

Configure the parameters for the short code:

	/**
     * short code or Registration ID
     */
    shortCode         : 'your short code here'

The app will count messages to the short code with the text **"Football"**, **"Basketball”**, or **"Baseball”**.

**Note:** Make sure to configure the callback for your short code so it points to:

	http://{yourdomain}:{port}/att/sms/votelistener

You cannot use _localhost_ or 127.0.0.1 for this callback; it must be an internet address where AT&T can successfully send notification messages.
	
##In-App Messaging
Point your browser to this address: 

    http://{yourdomain}:{port}/IAM/App3/index.html 

This sample showcases the In-App Messaging functionality. It displays the authenticated user's inbox, with the ability to send, delete, and update messages, as well as view message attachments.

You can specify up to 10 addresses by separating them with commas. Valid addresses include:

* AT&T Wireless Numbers
* Email Addresses
* Short Codes

You can send a message to up to 10 different addresses.

In-App Messaging notifications will be received by the app server at https://your_app_server_domain_name:4568/att/notification/v1/callback.
