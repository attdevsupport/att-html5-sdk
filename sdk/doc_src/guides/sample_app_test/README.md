#Using the Sample Apps

Now that you have completed setting up the server component of the SDK, you should be able to load the **Sample Apps** in your supported web browser.

The following section describes how to test your connection to the AT&T APIs using each Sample App.


##OAuth
Device Capabilities(*) and In-App Messaging require your user to authorize access via an OAuth login. The SDK automates this process by presenting the user with an access screen then capturing and storing the user's authentication token.  The user needs to authenticate only once per session.  The first time you click on one of these samples, you will be presented with a Consent Request popup screen requesting your oAuth login.

(*) Device Capabilities uses OAuth authentication but it will not show a consent screen. The authorization is performed automatically if you are on AT&T Network (data plan).

(**) The authentication pages shown below are from AT&T servers, not the SDK. The UI may be updated and slightly different from the screenshots below.

![Oauth](resources/images/sample_apps_screens/oauth-one.png)

There are several authentication methods you may use, but the easiest and fastest method is using an AT&T device with an active wireless numbers, entering your number into the "Wireless Number" field and selecting "Allow".

Next, you will be redirected to a screen where you can enter a PIN.  You should receive an SMS message on your phone with the PIN.
Enter the PIN you receive in the text message.

![Oauth](resources/images/sample_apps_screens/oauth-pin.png)

If you have entered the correct PIN, you should see a screen like the following indicating that you have authorized the request.

![Oauth](resources/images/sample_apps_screens/oauth-close.png)

Make sure to select "Close window", because this way the user is redirected back to your application and the OAuth token is delivered to the server.

##Speech File to Text
Point your browser to the following address: 

    http://{yourdomain}:{port}/Speech/App1/index.html 

Select the _Speech Context_ and the _File_ and press the **Submit** button to get a translation into text of the selected audio file based on the context you choose.

##Recorded Speech to Text
Point your browser to the following address: 

    http://{yourdomain}:{port}/Speech/App2/index.html 

Use the provided audio controls to record speech from your device. You can then submit the audio and see the resulting text from the AT&T speech-to-text API.

Note that your browser must support current web audio standards in order to use this sample.

##Text To Speech
Point your browser to the following address: 

    http://{yourdomain}:{port}/Speech/App3/index.html 

Type English text into the provided text input area, and submit it to the AT&T text-to-speech API. Press the **Play converted speech** button to hear the resulting audio.

##SMS
This sample demonstrates SMS messages sent from and to your application. To send and receive SMS messages for the _user_ of the application, please refer to the In-App Messaging sample.

Point your browser to the following address: 

    http://{yourdomain}:{port}/SMS/App1/index.html 

This Sample application showcases three different features. The first one, allows you to send a short message to a given phone number. Just enter the _Phone Number_ and the _Message_ and press the **Send Message** button. 

After successfully sending your message, you will see a screen showing a **Message ID** which corresponds to the message you already sent.
 
Once you get a _Message ID_, the corresponding field will be filled automatically with the ID of the last message sent. Now, you can retrieve the status of the given message by pressing **Get Status** button. 

Finally, you can check the messages sent to an specific short code. In order to do this, you must have at least one short code configured on your account. Open the Config file located at  

	/webcontent/SMS/App1/app/Config.js

and configure the parameters for those short codes:

	/**
     * short code or Registration ID
     */
    shortCode         : 'your short code here',
    
    /**
     * short code or Registration ID used on SMS sample app to receive messages from on the second button
     */
    anotherShortCode  : 'a second short code here',

To retrieve the messages sent to the short code, just press the **Get Messages for Short Code {XXXX}** button.


##SMS Voting
Point your browser to the following address: 

    http://{yourdomain}:{port}/SMS/App2/index.html 

This Sample application demonstrates how to use the callback functionality on SMS. In this case, we want to count votes sent to an specific short code using an specific text. 

First you have to configure your short code on the application. Open the Config file located at  

	/webcontent/SMS/App2/app/Config.js

and configure the parameters for the short code:

	/**
     * short code or Registration ID
     */
    shortCode         : 'your short code here'

The application will count how many messages with the text **"Football"**, **"Basketball"** or **"Baseball"** have been sent to the configured short code.

**Note** you have to configure properly the callback for the short code on your account. The callback should point to:

	http://{yourdomain}:{port}/att/sms/votelistener

You cannot use _localhost_ or 127.0.0.1 for this callback; it must be an internet address where AT&T can successfully send notification messages.
	
##MMS
Point your browser to the following address: 

    http://{yourdomain}:{port}/MMS/App1/index.html 

This Sample application sends a multimedia message to a given phone number. Enter the _Phone Number_ and the _Message_ and select an image from _Chose File_ field and press the **Send Message** button. 

You should see a screen showing a **Message ID** which corresponds to the message you already sent.
 
Once you get a _Message ID_, the corresponding field will be filled automatically with the ID of the last message sent. Now, you can retrieve the status of the given message by pressing **Get Status** button. 

##MMS Gallery
Point your browser to the following address: 

    http://{yourdomain}:{port}/MMS/App2/index.html 

The gallery application showcases the callback feature for MMS. It will display all the images sent to the configured short code.  

Configure your short code on the application. Open the Config file located at  

	/webcontent/MMS/App2/app/Config.js

and configure the parameters for the short code:

	/**
     * short code or Registration ID
     */
    shortCode         : 'your short code here'


**Note** you have to configure properly the callback for the short code in your application. The callback should point to:

	http://{yourdomain}:{port}/att/mms/gallerylistener

You cannot use _localhost_ or 127.0.0.1 for this callback; it must be an internet address where AT&T can successfully send notification messages.

##Device Capabilities
Point your browser to the following address: 

    http://{yourdomain}:{port}/DC/App1/index.html 

Press the button to retrieve information about your device. This sample will only work when your internet connection is provided by a device on the AT&T network. Most commonly you would either navigate to this sample from your AT&T device, or use your AT&T device to provide a WiFi hotspot.

##In App Messaging
Point your browser to the following address: 

    http://{yourdomain}:{port}/IAM/App3/index.html 

This application showcases the In-App Messaging functionality. It displays the authenticated user's inbox, with the ability to send, delete, and update messages, as well as viewing message attachments.

You can specify more than one address by separating them with commas. An address could be any of the following

* AT&T Wireless Number
* Email Address
* Short Code

You can send a message up to 10 different addresses. 

##Payment Notary Application
Point your browser to the following address: 

    http://{yourdomain}:{port}/Payment/App1/index.html 

The Notary application shows a very simple use case of how to sign a document to be used in Payments applications. Enter a valid json request on field _Request_ and press the **Sign Payload** button. You will get a screen containing the signed payload and the signature for the given request.

##Single Payment
Point your browser to the following address: 

    http://{yourdomain}:{port}/Payment/App2/index.html 

This application demonstrates a few features for single payments. To perform a payment first select the product you want to buy and press **Buy Product** button.

You will be redirected to a consent page to authorize the transaction.
 
(*) The authorization pages shown below are from AT&T servers, not the SDK. The UI may be updated and slightly different from the screen-shots below.

![Payment Single Auth](resources/images/sample_apps_screens/payment-single-auth.png)

Enter your AT&T Wireless number and press the **Charge my account** button. You will receive a PIN number via SMS. Enter the PIN number to complete the process and then press the **Close window** button.

Once the transaction is authorized, you will get a response with basic transaction information and your transaction will be listed on the _Refund Transaction_ list.
 
In order to be able to Refund a Transaction, you have to obtain the Transaction Status. To do so, select the transaction from the list, select one of the fields below the _Transaction Status_ form and press **Get Transaction Status** button.

Finally, select the transaction from the list and press **Refund Transaction** button.

##Subscription Payment
Point your browser to the following address: 

    http://{yourdomain}:{port}/Payment/App3/index.html 

This application demonstrates a few features for subscription payments. To perform a new subscription first select the option you want to subscribe to and press **Subscribe** button.

You will be redirected to a consent page to authorize the transaction, using the same process we covered on the previous section.

Once the subscription is authorized, you will get a response with basic subscription information and your transaction will be listed on the _Subscription_ list. 

To obtain the subscription status choose one of the options below the _Get Subscription Status_ form and press the **Get Subscription** button. Your subscription information will be updated and reflected on the Subscriptions list.

In order to be able to Refund or Cancel a Subscription, you have to obtain the Subscription Details. To do so, select the subscription from the list and press the **Get Subscription Details** button.

Finally, select the subscription from the list and press **Refund Subscription** or **Cancel Subscription** button.

##Advertisements
Point your browser to the following address: 

    http://{yourdomain}:{port}/ADS/App1/index.html 

This application submits demographic information and returns an appropriate matching advertisement.
