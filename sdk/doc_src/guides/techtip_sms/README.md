SMS Cookbook
===

Overview
---
This cookbook explains how to create an instance of the AttApiClient class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 for sending, receiving, and checking the status of SMS messages.

What do I need to start?
---

1. Include att-api-client.js. Include att-api-client.js as a dependency by including it in your HTML:  

        <script type="text/javascript" src="att-api-client.js"></script>

Adjust the _src_ attribute value to match the site path where you store the _att_api_client.js_ file.


How do I send an SMS message?
---

Execute the sendSms method. For more information about the parameters of this method,  refer to AttApiClient.sendSms. 

You can define the success and failure callbacks as anonymous functions or pass them as parameters

<code>

    AttApiClient.sendSms({
        addresses : 'phone number goes here',
        message : 'The message'
		},
        onSuccess,
        onFailure
    );

    //callback for success response
    function onSuccess(response){
        // you can handle here the response
        console.log(response);
    };

    //callback for failed call
    function onFailure(error){
      //you can handle the error
      console.log(error);
    };

</code>  

###Tip! Normalize the Phone Number

Use the AttApiClient.normalizePhoneNumber method to convert the given phone number into the format required by the AT&T API Platform.

<code>

    var phoneNumber = '(425)-223-0000';

    AttApiClient.sendSms({
        addresses : AttApiClient.normalizePhoneNumber(phoneNumber), // will produce '4252230000'
        message : 'The message'
    });    

</code> 


###Tip! Validate the Phone Number
  
To check that the given phone number is valid, use the AttApiClient.isValidPhoneNumber method.

<code>

    var phoneNumber = '425223000a';

    if (AttApiClient.isValidPhoneNumber(phoneNumber)) {

        AttApiClient.sendSms({
            addresses : AttApiClient.normalizePhoneNumber(phoneNumber),
            message : 'The message'
        });    

    } 

</code>


How do I check the status of an SMS message?
---

1. **Save the SMS Id**  

    When an SMS message is sent, the success callback receives a response object containing an Id that identifies the message. It is important to save this Id as it is used by the getSmsStatus method to check the message status. 

        var messageId;

        //...

        AttApiClient.sendSms({/*...*/});


        function onSuccess(response){
            //save the Id
            messageId = response.outboundMessageResponse.messageId;
        };
    
2. **Get the SMS status**  

    You can check the status of an SMS message you have sent by using the AttApiClient.smsStatus method.

        AttApiClient.smsStatus(
			{ id : messageId },
            function success(response){
                console.log(response);
            },
            function fail(error){
                console.log(error);
            }
        );
