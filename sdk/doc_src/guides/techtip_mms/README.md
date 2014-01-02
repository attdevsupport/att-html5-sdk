MMS Messages Cookbook
===

Overview
---
This guide explains the usage of the Att.Provider for sending MMS messages using the AT&T HTML5 SDK Platform.

What do I need to start?
---
- Include Att.Provider by declaring it as a required on your class definition  

<code>
    Ext.define('MyApp.MyController', {
        extend  : 'Ext.Controller',
        requires: [
            'Att.Provider'
            //more dependencies here ... 
        ],

        //...
    });
</code>

- Create an instance of Att.Provider

<code>    
    var provider = Ext.create('Att.Provider');
</code>


How do I send an MMS message?
---

- Execute the sendMms method. For more information about the parameters refer to Att.Provider.sendMms documentation. 
- You can define the success/failure callbacks as anonym functions or pass them as parameters.

<code>

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

</code>  

**Note**  
Since you cannot access file system on mobile browsers, you need to pass <code>fileId</code> parameter with a valid file path located on your server to be sent as attachment in the MMS message.

###Tip! Normalize the Phone Number

You can use Att.Provider.normalizePhoneNumber to convert the given phone number into the format required by AT&T API Platform.

<code>

    var phoneNumber = '(425)-223-0000';

    provider.sendMms({
        address : Att.Provider.normalizePhoneNumber(phoneNumber), // will produce '4252230000'
        message : 'The message',
        /*...*/
    });    

</code> 


###Tip! Validate the Phone Number
  
If you want to check that the given address is valid, you can use Att.Provider.isValidPhoneNumber method.

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

- **Step 1: Save the MMS Id**  
    When you sent a message the success callback receives a response object containing the Id that identifies the MMS. You should save this Id if you want to get its status.

    <code>
        var messageId;

        //...

        provider.sendMms({/*...*/});


        function onSuccess(response){
            //save the Id
            messageId = response.Id;
        };
    </code> 
    
- **Step 2: Get the MMS status**  
    You can check the status of an MMS message you have sent, using Att.Provider.getMmsStatus method.

    <code>

        provider.getMmsStatus({
            mmsId   : messageId,
            success : function(response){
                console.log(response);
            },
            failure : function(error){
                console.log(error);
            }
        });

    </code> 
    




