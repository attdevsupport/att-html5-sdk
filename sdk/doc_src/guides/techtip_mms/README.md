MMS Cookbook
===

Overview
---
This cookbook explains how to create an instance of the Att.Provider class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 for sending, receiving, and checking the status of MMS messages.

What do I need to start?
---

1. Include Att.Provider as a dependency by declaring it in the "requires" section of your class definition  

        Ext.define('MyApp.MyController', {
            extend  : 'Ext.Controller',
            requires: [
                'Att.Provider'
                //more dependencies here ... 
            ],

           //...
        });

2. Create an instance of the Att.Provider class.

        var provider = Ext.create('Att.Provider');
    

How do I send an MMS message?
---

Execute the sendMms method. For more information about the parameters of this method refer to Att.Provider.sendMms. 

You can define the success and failure callbacks as anonymous functions or pass them as parameters.


        provider.sendMms({
            address  : 'phone number goes here',
            message  : 'The message',
            fileId   : 'path/to/file/in/server',
            priority : 'Normal',
            success  : onSuccess,
            failure  : onFailure
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


**Note**  
Since you cannot access the file system on mobile browsers, the <code>fileId</code> parameter is required and must contain the location of the file (both path and name) that is located on your server. This file on the server will be sent as an attachment in the MMS message.

###Tip! Normalize the Phone Number

You can use the Att.Provider.normalizePhoneNumber method to convert the given phone number into the format required by the AT&T API Platform.

<code>

    var phoneNumber = '(425)-223-0000';

    provider.sendMms({
        address : Att.Provider.normalizePhoneNumber(phoneNumber), // will produce '4252230000'
        message : 'The message',
        /*...*/
    });    

</code> 


###Tip! Validate the Phone Number
  
To check that the given address is valid, use the Att.Provider.isValidPhoneNumber method.

<code>

    var phoneNumber = '425223000a';

    if (Att.Provider.isValidPhoneNumber(phoneNumber)) {

        provider.sendMms({
            address : Att.Provider.normalizePhoneNumber(phoneNumber),
            message : 'The message'
            /*...*/
        });    

    } 

</code>


How do I check the status of an MMS message?
---

1. **Save the MMS Id**  

    When you send an MMS message, the success callback receives a response object containing the Id that identifies the MMS. You should save this Id and use it to get the status of the message.

        var messageId;

        //...

        provider.sendMms({/*...*/});


        function onSuccess(response){
            //save the Id
            messageId = response.Id;
        };
    
2. ** Get the MMS status**  

    You can check the status of an MMS message you have sent using the Att.Provider.getMmsStatus method.

        provider.getMmsStatus({
            mmsId   : messageId,
            success : function(response){
                console.log(response);
            },
            failure : function(error){
                console.log(error);
            }
        });

