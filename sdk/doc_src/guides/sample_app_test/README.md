#Testing the Sample Apps

Now that you have completed setting up the server component of the SDK, you should be able to load the **Sample Apps** in your supported web browser.

The following section describes how to test your connection to the AT&T APIs using each Sample App.


##OAuth
Location, Device Capabilities(*), In App Messaging (MIM/MOBO) (Beta) require your user to authorize access via an OAuth login. The SDK automates this process by presenting the user with an access screen then capturing and storing the user's authentication token.  The user needs to authenticate only once per session.  The first time you click on Device Location for instance, you will be presented with a Consent Request popup screen requesting your oAuth login.

(*) Device Capabilities uses OAuth authentication but it will not show a consent screen. The authorization is performed automatically if you are on AT&T Network (data plan).

![Oauth](resources/images/sample_apps_screens/oauth-one.png)

There are several authentication methods you may use, but the easiest and fastest method is using an AT&T device with an active wireless numbers, entering your number into the "Wireless Number" field and selecting "Allow".

Next, you will be redirected to a screen where you can enter a PIN.  You should receive an SMS message on your phone with the PIN.
Enter the PIN you receive in the text message.

![Oauth](resources/images/sample_apps_screens/oauth-pin.png)

If you have entered the correct PIN, you should see a screen like the following indicating that you have authorized the request.

![Oauth](resources/images/sample_apps_screens/oauth-close.png)

Make sure to select "Close window", because this way the user is redirected back to your application and the OAuth token is delivered to the server.

##Location
Point your browser to the following address: 

    http://{yourdomain}:{port}/TL/App1/index.html 

You should see a screen like this

![Device Location Home](resources/images/sample_apps_screens/tl-home.png)

Select the values for _Requested Accuracy_, _Acceptable Accuracy_ and _Delay Tolerance_ and press the **"Get Phone Location"** button.
You will see a map screen displaying your phone location.

![Device Location Map](resources/images/sample_apps_screens/tl-map.png)

##Device Capabilities
Point your browser to the following address: 

    http://{yourdomain}:{port}/DC/App1/index.html 

You should see a screen like this

![Device Capabilities Home](resources/images/sample_apps_screens/dc-home.png)

Press the **Get Device Capabilities** button to show the information about your device.

##Speech
Point your browser to the following address: 

    http://{yourdomain}:{port}/Speech/App1/index.html 

You should see a screen like this

![Speech Home](resources/images/sample_apps_screens/speech-home.png)

Select the _Speech Context_ and the _File_ and press the **Submit** button to get a translation into text of the selected audio file based on the context you choose. You will see a screen like this

![Speech Submit](resources/images/sample_apps_screens/speech-submit.png)

##SMS
Point your browser to the following address: 

    http://{yourdomain}:{port}/SMS/App1/index.html 

You should see a screen like this

![SMS Home App1](resources/images/sample_apps_screens/sms-home-1.png)

This Sample application showcases three different features. The first one, allows you to send a short message to a given phone number. Just enter the _Phone Number_ and the _Message_ and press the **Send Message** button. 

You should see a screen like the following, showing a **Message ID** which corresponds to the message you already sent.
 
![SMS Home App1](resources/images/sample_apps_screens/sms-send-message.png)

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

You should see a screen like this

![SMS Home App2](resources/images/sample_apps_screens/sms-home-2.png)

This Sample application demonstrates how to use the callback functionality on SMS. In this case, we want to count votes sent to an specific short code using an specific text. 

First you have to configure your short code on the application. Open the Config file located at  

	/webcontent/SMS/App2/app/Config.js

and configure the parameters for the short code:

	/**
     * short code or Registration ID
     */
    shortCode         : 'your short code here'

The application will count how many messages with the text **"Footbal"**, **"Basketball"** or **"Baseball"** have been sent to the configured short code.

![SMS Home App2](resources/images/sample_apps_screens/sms-votes.png)

**Note** you have to configure properly the callback for the short code on your account. The callback should point to:

	http://{yourdomain}:{port}/att/sms/votelistener

##MMS
Point your browser to the following address: 

    http://{yourdomain}:{port}/MMS/App1/index.html 

You should see a screen like this

![MMS Home App1](resources/images/sample_apps_screens/mms-home-1.png)

This Sample application sends a multimedia message to a given phone number. Enter the _Phone Number_ and the _Message_ and select an image from _Chose File_ field and press the **Send Message** button. 

You should see a screen like the following, showing a **Message ID** which corresponds to the message you already sent.
 
![MMS Home App1](resources/images/sample_apps_screens/mms-send-message.png)

Once you get a _Message ID_, the corresponding field will be filled automatically with the ID of the last message sent. Now, you can retrieve the status of the given message by pressing **Get Status** button. 

##MMS Coupon
Point your browser to the following address: 

    http://{yourdomain}:{port}/MMS/App2/index.html 

You should see a screen like this

![MMS Home App2](resources/images/sample_apps_screens/mms-home-2.png)

This application uses the features demonstrated in the previous example to send a simple image representing a coupon discount to a given number. Once the message is sent, you can check the status of the message.

##MMS Gallery
Point your browser to the following address: 

    http://{yourdomain}:{port}/MMS/App3/index.html 

You should see a screen like this

![MMS Home App2](resources/images/sample_apps_screens/mms-home-3.png)

The gallery application showcases the callback feature for MMS. It will display all the images sent to the configured short code.  

Configure your short code on the application. Open the Config file located at  

	/webcontent/MMS/App3/app/Config.js

and configure the parameters for the short code:

	/**
     * short code or Registration ID
     */
    shortCode         : 'your short code here'


**Note** you have to configure properly the callback for the short code in your application. The callback should point to:

	http://{yourdomain}:{port}/att/mms/gallerylistener

##Payment Notary Application
Point your browser to the following address: 

    http://{yourdomain}:{port}/Payment/App1/index.html 

You should see a screen like this

![Payment Notary Home](resources/images/sample_apps_screens/payment-notary-home.png)

The Notary application shows a very simple use case of how to sign a document to be used in Payments applications. Enter a valid json request on field _Request_ and press the **Sign Payload** button. You will get a screen like the following containing the signed payload and the signature for the given request.

![Payment Notary Sign](resources/images/sample_apps_screens/payment-notary-sign.png)

##Single Payment
Point your browser to the following address: 

    http://{yourdomain}:{port}/Payment/App2/index.html 

You should see a screen like this

![Payment Single Home](resources/images/sample_apps_screens/payment-single-home.png)

This application demonstrates a few features for single payments. To perform a payment first select the product you want to buy and press **Buy Product** button.

You will be redirected to a consent page to authorize the transaction.
 
![Payment Single Auth](resources/images/sample_apps_screens/payment-single-auth.png)

Enter your AT&T Wireless number and press the **Charge my account** button. You wil receive a PIN number via SMS. Enter the PIN number to complete the process and then press the **Close window** button.

Once the transaction is authorized, you will get a response with basic trasanction information and your transaction will be listed on the _Refund Transaction_ list. 
In order to be able to Refund a Transaction, you have to obtain the Transaction Status. To do so, select the transaction from the list, select one of the fields below the _Transaction Status_ form and press **Get Transaction Status** button.

Finaly, select the transaction from the list and press **Refund Transaction** button.

##Subscription Payment
Point your browser to the following address: 

    http://{yourdomain}:{port}/Payment/App3/index.html 

You should see a screen like this

![Payment Subs Home](resources/images/sample_apps_screens/payment-subs-home.png)

This application demonstrates a few features for subscription payments. To perform a new subscription first select the option you want to subscribe to and press **Subscribe** button.

You will be redirected to a consent page to authorize the transaction, same process we covered on the previous section.

Once the subscription is authorized, you will get a response with basic subscription information and your transaction will be listed on the _Subscription_ list. 

To obtain the subscription status choose one of the options below the _Get Subscription Status_ form and press the **Get Subscription** button. Your subscription information will be updated and reflected on the Subscriptions list.

In order to be able to Refund or Cancel a Subscription, you have to obtain the Subscription Details. To do so, select the subscription from the list and press the **Get Subscription Details** button.

Finaly, select the subscription from the list and press **Refund Subscription** or **Cancel Subscription** button.

##In App Messaging -Message On Behalf Of- MOBO (Beta)
Point your browser to the following address: 

    http://{yourdomain}:{port}/MOBO/App1/index.html 

You should see a screen like this

![MOBO Home](resources/images/sample_apps_screens/mobo-home.png)

This application showcases the Message On Behalf Of functionality. To send a message just complete the fields _Address_ and _Message_ and press the **Send Message** button. You can explore different possibilities, by adding a file using _Choose File_ field, send the message as a group or adding a Subject.  
You can specify more than one address by separating them with commas. An address could be any of the following

* AT&T Wireless Number
* Email Address
* Short Code

You can send a message up to 10 different addresses. 

##In App Messaging -Message Inbox Management- MIM (Beta)
Point your browser to the following address: 

    http://{yourdomain}:{port}/MIM/App1/index.html 

You should see a screen like this

![MIM Home](resources/images/sample_apps_screens/mim-home.png)

This basic MIM application allows you to get all your messages. Just select the how many message headers you want to retrieve on _Header Count_ field and press the **Get Message Headers** button.

Your messages will be displayed on the list. For those messages that have file attachments - such as MMS - you will see a _Parts_ property indicating how many parts (or files) the message has. To view them, just select the message, enter the part number on the field _Part Number_ and press the **Get Message Content** button.

<!--
##Ads
Point your browser to the following address: 

    http://{yourdomain}:{port}/ADS/App1/index.html 

You should see a screen like this

![Advertisment Home](resources/images/sample_apps_screens/ads-home.png)

Select at least one _Category_ and press **"Get Ad"** button. You will see a screen like this

![Advertisment Show](resources/images/sample_apps_screens/ads-show.png)
-->
##Call Management
Point your browser to the following address: 

    http://{yourdomain}:{port}/CMS/App1/index.html 

You should see a screen like this

![Device Location Home](resources/images/sample_apps_screens/cms-home.png)

Enter the _Make call to_ field, select the _Script Function_ you want to test and press the **Create Session** button.

Once the session is created you can send signals by choosing any one of them on _Signal to send_ field and press the **Send Signal** button. 


##WAP Push
Point your browser to the following address: 

    http://{yourdomain}:{port}/WAPPush/App1/index.html 

You should see a screen like this

![WAP Push Home](resources/images/sample_apps_screens/wap-home.png)

Enter the _Phone Number_, the _URL_ and _Alert Text_ fields and press **Send WAP Message**.
WAP push is only supported on feature phones or non-smart phones.  Android and iOS devices can't receive WAP messages. Use SMS and MMS instead.