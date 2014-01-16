SMS Cookbook
===

Overview
---
This cookbook explains how to create an instance of the Att.Provider class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 for sending, receiving, and checking the status of SMS messages.

What do I need to start?
---

1. **Include Att.Provider as a dependency by declaring it in the "requires" section of your class definition.**  


        Ext.define('MyApp.MyController', {
            extend  : 'Ext.Controller',
            requires: [
                'Att.Provider'
                //more dependencies here as required ...
            ],

            //...
        });

2. **Create an instance of the Att.Provider class**

        var provider = Ext.create('Att.Provider');


How do I send an SMS message?
---

Execute the sendSms method. For more information about the parameters of this method,  refer to Att.Provider.sendSms. 

You can define the success and failure callbacks as anonymous functions or pass them as parameters

<code>

    provider.sendSms({
        address : 'phone number goes here',
        message : 'The message',
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
      //you can handle the error
      console.log(error);
    };

</code>  

###Tip! Normalize the Phone Number

Use the Att.Provider.normalizePhoneNumber method to convert the given phone number into the format required by the AT&T API Platform.

<code>

    var phoneNumber = '(425)-223-0000';

    provider.sendSms({
        address : Att.Provider.normalizePhoneNumber(phoneNumber), // will produce '4252230000'
        message : 'The message'
    });    

</code> 


###Tip! Validate the Phone Number
  
To check that the given phone number is valid, use the Att.Provider.isValidPhoneNumber method.

<code>

    var phoneNumber = '425223000a';

    if (Att.Provider.isValidPhoneNumber(phoneNumber)) {

        provider.sendSms({
            address : Att.Provider.normalizePhoneNumber(phoneNumber),
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

        provider.sendSms({/*...*/});


        function onSuccess(response){
            //save the Id
            messageId = response.Id;
        };
    
2. **Get the SMS status**  

    You can check the status of an SMS message you have sent by using the Att.Provider.getSmsStatus method.

        provider.getSmsStatus({
            smsId   : messageId,
            success : function(response){
                console.log(response);
            },
            failure : function(error){
                console.log(error);
            }
        });

    

How do I get an SMS message sent to my application's short code?
---
You can get the SMS messages sent to your application's short code by using the Att.Provider.receiveSms method.

<code>
    var yourShortCode = 999999;

    provider.receiveSms({
        registrationId : yourShortCode,
        success : function(response){
            console.log(response);
        },
        failure : function(error){
            console.log(error);
        }
    });

</code> 
