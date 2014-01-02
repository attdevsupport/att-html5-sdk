SMS Messages Cookbook
===

Overview
---
This guide explains the usage of the Att.Provider for sending and receiving SMS messages using the AT&T HTML5 SDK Platform.

What do I need to start?
---
- Include Att.Provider by declaring it as required in your class definition. 

<code>
    Ext.define('MyApp.MyController', {
        extend  : 'Ext.Controller',
        requires: [
            'Att.Provider'
            //more dependencies here as required ...
        ],

        //...
    });
</code>

- Create an instance of Att.Provider

<code>    
    var provider = Ext.create('Att.Provider');
</code>


How do I send an SMS message?
---

- Execute the sendSms method. For more information about the parameters refer to Att.Provider.sendSms documentation. 
- You can define the success/failure callbacks as anonym functions or pass them as parameters

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

You can use Att.Provider.normalizePhoneNumber to convert the given phone number into the format required by AT&T API Platform.

<code>

    var phoneNumber = '(425)-223-0000';

    provider.sendSms({
        address : Att.Provider.normalizePhoneNumber(phoneNumber), // will produce '4252230000'
        message : 'The message'
    });    

</code> 


###Tip! Validate the Phone Number
  
If you want to check that the given address is valid, you can use Att.Provider.isValidPhoneNumber method.

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

- **Step 1: Save the SMS Id**  
    When you sent a message the success callback receives a response object containing the Id that identifies the SMS. You should save this Id if you want to get its status.

    <code>
        var messageId;

        //...

        provider.sendSms({/*...*/});


        function onSuccess(response){
            //save the Id
            messageId = response.Id;
        };
    </code> 
    
- **Step 2: Get the SMS status**  
    You can check the status of an SMS message you have sent, using Att.Provider.getSmsStatus method.

    <code>

        provider.getSmsStatus({
            smsId   : messageId,
            success : function(response){
                console.log(response);
            },
            failure : function(error){
                console.log(error);
            }
        });

    </code> 
    

How do I get an SMS message sent to my application's short code?
---
You can get the SMS messages sent to your application's short code by using Att.Provider.receiveSms

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




