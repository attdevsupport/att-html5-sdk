#Using the Sample Apps

Now that you have completed setting up the server component of the SDK, you should be able to load the **Sample Apps** in your supported web browser.

The following section describes how to test your connection to the AT&T APIs using each Sample App.


##OAuth
Device Capabilities and In-App Messaging require users to authorize your app via an OAuth consent. The SDK facilitates this process by presenting the user with the AT&T API Platform access page, capturing their authorization code, requesting and storing the user’s access token.  The user needs to authorize consent only once per session.

A user accessing In-App Messaging features will be presented with a Consent Request screen requesting app authorization to an AT&T wireless number or account.  Device Capabilities uses OAuth authentication but it will not show a consent screen. The authorization is performed automatically if you are on the AT&T network.

(**) The authentication pages shown below are from AT&T servers, not the SDK. The UI may be updated and slightly different from the screenshots below.

There are several authentication methods you may use, but the easiest and fastest method is using an AT&T device with an active wireless number, and send an authorization password to AT&T’s short code:

![Oauth](resources/images/sample_apps_screens/oauth-one.png)

When the correct password is received, you will see a screen like the following indicating that you have authorized the request:

![Oauth](resources/images/sample_apps_screens/oauth-close.png)

Make sure to select "Close window", because this way the user is redirected back to your application and the OAuth token is delivered to the server.

##Speech File to Text
Point your browser to this address: 

    http://{yourdomain}:{port}/Speech/App1/index.html 

Select the _Speech Context_, chose a _File_, and press the **Submit** button to get a translation into text of the selected audio file.

##Recorded Speech to Text
Point your browser to this address: 

    http://{yourdomain}:{port}/Speech/App2/index.html 

Use the provided audio controls to record speech and submit the audio to view the resulting text from the AT&T Speech-to-Text API.

Note that your browser must support current web audio standards in order to use this sample.

##Text To Speech
Point your browser to this address: 

    http://{yourdomain}:{port}/Speech/App3/index.html 

Type English text into the provided text input area, and tap submit to send the test to the AT&T Text-to-Speech API. Tap **Play converted speech** to hear the resulting audio.

##SMS
This sample app demonstrates SMS messages sent from and to your application.

Point your browser to this address: 

    http://{yourdomain}:{port}/SMS/App1/index.html 

This sample application showcases three different features. The first one, allows the app to send a short message to a given phone number: enter the _Phone Number_ and the _Message_ and press the **Send Message** button. 

After sending your message, you will see a screen showing the **Message ID** that corresponds to the sent message.
 
To retrieve the status of the message, tap **Get Status**. 

To check the messages sent to a specific short code, you must have at least one short code configured on your AT&T Developer Program application. To add a short code, open the configuration file at this location:  

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

This sample application demonstrates the callback functionality. In this sample, the app counts votes sent to a specific short code using specific test in the message body. 

To configure your short code on the application, open the configuration file at this location:  

	/webcontent/SMS/App2/app/Config.js

Configure the parameters for the short code:

	/**
     * short code or Registration ID
     */
    shortCode         : 'your short code here'

The app will count messages to the short code with the text **"Football"**, **"Basketball”**, or **"Baseball”**.

**Note** Make sure to configure the callback for your short code so it points to:

	http://{yourdomain}:{port}/att/sms/votelistener

You cannot use _localhost_ or 127.0.0.1 for this callback; it must be an internet address where AT&T can successfully send notification messages.
	
##MMS
Point your browser to this address: 

    http://{yourdomain}:{port}/MMS/App1/index.html 

This sample application sends a multimedia message to a given phone number. Enter the _Phone Number_ and the _Message_, select an image from the _Chose File_ menu and tap **Send Message**. 

After sending a message, the app displays a **Message ID** corresponding to the message sent.  To retrieve the status of the message, tap **Get Status**. 

##MMS Gallery
Point your browser to this address: 

    http://{yourdomain}:{port}/MMS/App2/index.html 

The gallery application showcases the MMS callback feature, which displays the images sent to the configured short code. 

Configure your short code using the configuration file at this location:  

	/webcontent/MMS/App2/app/Config.js

Configure the parameters for the short code:

	/**
     * short code or Registration ID
     */
    shortCode         : 'your short code here'


**Note** You must configure the callback for the short code in your application so that it points to this location:

	http://{yourdomain}:{port}/att/mms/gallerylistener

You cannot use _localhost_ or 127.0.0.1 for this callback; it must be an internet address where AT&T can successfully send notification messages.

##Device Capabilities
Point your browser to this address: 

    http://{yourdomain}:{port}/DC/App1/index.html 

Tap the button to retrieve information about your device. This sample app will only work when your internet connection is provided by a device on the AT&T network. You should either navigate to this sample app directly from your AT&T device, or use an AT&T device to provide a Wi-Fi hotspot.

##In-App Messaging
Point your browser to this address: 

    http://{yourdomain}:{port}/IAM/App3/index.html 

This sample showcases the In-App Messaging functionality. It displays the authenticated user's inbox, with the ability to send, delete, and update messages, as well as view message attachments.

You can specify up to 10 addresses by separating them with commas. Valid addresses include:

* AT&T Wireless Numbers
* Email Addresses
* Short Codes

You can send a message up to 10 different addresses. 

##Payment/Notary
Point your browser to this address: 

    http://{yourdomain}:{port}/Payment/App1/index.html 

The Notary sample demonstrates document signing for payment applications. Enter a valid JSON request in the _Request_ field and tap **Sign Payload**. A screen will appear containing the signed payload and the signature for the request.

##Single Payment
Point your browser to this address: 

    http://{yourdomain}:{port}/Payment/App2/index.html 

This sample demonstrates single payment features. To make a single payment, select the product you want to buy and tap **Buy Product**.

A authorization request page will appear.
 
(*) The consent pages shown below are from AT&T servers, not the SDK. The UI may be updated and slightly different from the screen-shots below.

![Payment Single Auth](resources/images/sample_apps_screens/payment-single-auth.png)

Enter your AT&T Wireless number and press the **Charge my account** button. You will see a password and a short code. Send a text message with the password from the device you wish to charge.

Once the transaction is authorized, you will get a response with basic transaction information and your transaction will be listed on the _Refund Transaction_ list.
 
In order to be able to Refund a Transaction, you have to obtain the Transaction Status. To do so, select the transaction from the list, select one of the fields below the _Transaction Status_ form and press **Get Transaction Status** button.

Finally, select the transaction from the list and press **Refund Transaction** button.

##Subscription Payment
Point your browser to this address: 

    http://{yourdomain}:{port}/Payment/App3/index.html 

This application demonstrates subscription payment features. To create a new subscription, first select an option from the Create New Subscription list and tap  **Subscribe**.

The app will redirect to a consent page where you can authorize the transaction. Once the subscription is authorized, you will get a response with basic subscription information and the transaction will appear on the _Subscription_ list. 

To obtain the subscription status, choose an options under _Get Subscription Status_ and tap **Get Subscription**. Your subscription information will be updated and reflected on the Subscriptions list.

To Refund or Cancel a Subscription, first obtain the Subscription Details. by selecting the subscription from the list and tapping **Get Subscription Details**, then tap **Refund Subscription** or **Cancel Subscription**.

##Advertisements
Point your browser to this address: 

    http://{yourdomain}:{port}/ADS/App1/index.html 

This application submits demographic information and returns an appropriate targeted advertisement.
