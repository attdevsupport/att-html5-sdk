Testing the Kitchen Sink
===



Now that you have completed setting up the server component of the SDK, you should be able to load the Kitchen Sink application in your supported web browser.

The following section describes how to test your connection to the AT&T APIs in the Kitchen Sink Application.

When you open the Kitchen Sink Application, you should see the following home screen.

![Home](resources/images/test-screenshots/home.png)


Speech Tests
---
Speech functionality is intended to retrieve the text recognintion from a given audio file. This audio file have some constraints listed below. AT&T Speech API accepts only two audio formats WAV and AMR files.

**Speech file constraints**  
-16 bit PCM WAV, single channel, 8 kHz sampling.  
-AMR (narrowband), 12.2 kbits/s, 8 kHz sampling.

From the API list select the Speech To Text link.

![Speech](resources/images/test-screenshots/home-speech.png)

You should see the following screen with a "Speech To Text" button that sends a Test WAV audio file to the API when it is clicked.

![Speech](resources/images/test-screenshots/speech.png)

The Speech API should return the following result

![Speech](resources/images/test-screenshots/speech-result.png)


OAuth Tests
---
Device Location, MOBO (Beta), and MIM (Beta) require your user to authorize access via an OAuth login.  The SDK automates this process by presenting the user with an access screen then capturing and storing the user's authentication token.  The user needs to authenticate only once per session.  The first time you click on Device Location for instance, you will be presented with the OAuth login screen as a popup.


![Oauth](resources/images/test-screenshots/oauth-one.png)

There are several authentication methods you may use, but the easiest and fastest method is using an AT&T device with an active wireless numbers, entering your number into the "Wireless Number" field and selecting "Allow".

Next, you will be redirected to a screen where you can enter a PIN.  You should receive an SMS message on your phone with the PIN.
Enter the PIN you receive in the text message.


![Oauth](resources/images/test-screenshots/oauth-pin.png)

If you have entered the correct PIN, you should see a screen like the following indicating that you have authorized the request.


![Oauth](resources/images/test-screenshots/oauth-close.png)

Make sure to select "Close window", because this way the user is redirected back to your application and the OAuth token is delivered to the server.



Test Device Location
---

After you have authorized access using OAuth, select the Device Location link from the home screen

![Home-Location](resources/images/test-screenshots/home-location.png)

Then, you can press the "Get Device Location" button to retrieve the location of the given phone number in the OAuth login.

![Device-info](resources/images/test-screenshots/device-location.png)


The loading screen should appear, and after a few seconds, you should see the results screen.

![Device-info](resources/images/test-screenshots/device-location-result.png)


Test SMS
---
From the API list select the SMS link.

![Home-SMS](resources/images/test-screenshots/home-sms.png)

You should see the following screen.


![Home](resources/images/test-screenshots/sms.png)

Enter an AT&T phone number into the text box and click "Send SMS".

The loading screen should appear and after a few seconds you should see the results screen.

![SMS Results](resources/images/test-screenshots/sms-result.png)

If successful, you will see the JSON data for the sent SMS, otherwise you will see an error message.

Next, check the status of your SMS message by selecting the "SMS Status" button:

![SMS Status](resources/images/test-screenshots/sms-status.png)

You will see the current status of the SMS message in JSON format.


Test MMS
---
From the API list select the MMS link

![Home-MMS](resources/images/test-screenshots/home-mms.png)

You should now see the following MMS screen.

![Home](resources/images/test-screenshots/mms.png)

Enter an AT&T phone number into the text box and select "Send MMS".

The loading screen should appear and after a few seconds you should see the results screen.

![MMS Results](resources/images/test-screenshots/mms-result.png)

If successful, you will see the JSON data for the sent MMS, otherwise you will see an error message.

Next, check the status of your MMS message by selecting the "MMS Status" button:

![mms Status](resources/images/test-screenshots/mms-status.png)

You will see the current status of the MMS message in JSON format.

Test Payment
---

From the API list select the Payment link.

You should now see the following Payments screen.

![Home](resources/images/test-screenshots/payment-home.png)

Select "Charge User (singlePay)"

The Consent Request screen that advises you of a charge should appear after a few seconds.

![Purchase Auth](resources/images/test-screenshots/payment-auth.png)

Enter your ATT credentials, such as a phone number or username and password.
If you choose to enter a phone number, you will be presented with a PIN entry screen like the following.

![Purchase Pin](resources/images/test-screenshots/payment-pin.png)

A PIN will be sent to your phone via SMS.  Enter the PIN and tap "OK"

After correctly entering the PIN, you should see a screen confirming your purchase.

![Purchase close](resources/images/test-screenshots/payment-close.png)

**Note The user must close this dialog for your application to be notified of the purchase**

Tap "Close window" and you should see a Sencha Touch dialog like the following with the Auth Code for the transaction.

![Purchase callback](resources/images/test-screenshots/payment-callback.png)

Tap "Back" to display the Payment screen again.  Note that the same Auth Code is populated on the payment screen.

You can now request the transaction status by tapping the "Transaction Status" button.
After a few seconds a dialog should appear with the transaction details.


![Purchase details](resources/images/test-screenshots/payment-status.png)

Tap on "Back" button. Note that now on the Payment screen the Trx ID field is populated with the Transaction Id returned from the status call.

![Purchase details](resources/images/test-screenshots/payment-details.png)

**Note: To refund a transaction you need Transaction Id for Single Payments and both Transaction Id and the internal Consumer Id that AT&T has assigned to the user for Subscriptions.
**
To refund the transaction tap the "Refund Transaction" button.
After a few seconds a dialog box should appear confirming the transaction has been refunded:

![Purchase refund](resources/images/test-screenshots/payment-refund.png)


Creating a recurring subscription is just as simple.  Repeat the above process starting with the "Charge User (Subscription)" button. Once you fetch the transaction details you can use the "Subscription Details" and "Subscription Status" buttons to get the details about the subscription.

Sign Payload
---
The Payment APIs require the signing of a payment request by the application before an advice of charge url is created.  The SDK automates this process by first calling Sign Payload, then making the API call to create the advice of charge url.  However, if you need to use Sign Payload directly we have included it in the JavaScript API and it can be tested from the Kitchen Sink payments page.

Tap "Sign Payload" at the bottom of the Payments page and after a few seconds API results should be displayed.

![Purchase refund](resources/images/test-screenshots/payment-sign.png)


Test WAPPush
---
From the API list select the "WAP" link.

![Home-WAP](resources/images/test-screenshots/home-wap.png)

You should now see the following screen.

![Home](resources/images/test-screenshots/wap.png)

Enter an AT&T phone number into the text box and click "New Wap Push". WAP push is only supported on feature phones or non-smart phones.  Android and iOS devices can't receive WAP messages. Use SMS and MMS instead.

The loading screen should appear and after a few seconds you should see the results screen:

![WAP Results](resources/images/test-screenshots/wap-result.png)


