WAP Push Cookbook
===

Overview
---
This cookbook explains how to create an instance of the Att.Provider class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 for sending WAP Push messages.

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

2. **Create an instance of the Att.Provider class.**

        var provider = Ext.create('Att.Provider');


How do I send a WAP Push message?
---

1. **Create your XML WAP message. The following is an example of a valid XML WAP message with a text that will be displayed on the device.**


        var url = 'your WAP url goes here';
        var text = 'This is a Test WAP Push';
        var message = '<?xml version ="1.0"?>' + 
                      '<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">' +
                      '<si>'+
                      '<indication href="' + url + '" si-id="1">' + text + '</indication>'+
                    '</si>';


2. **Execute the wapPush method to send the message. For more information about the parameters of this method, refer to Att.Provider.wapPush.** 


        provider.wapPush({
            address : 'phone number goes here',
            message : message,
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


###Tip! Normalize the Phone Number

Use the Att.Provider.normalizePhoneNumber method to convert the given phone number into the format required by the AT&T API Platform.

<code>
    var phoneNumber = '(425)-223-0000';

    provider.wapPush({
        address : Att.Provider.normalizePhoneNumber(phoneNumber), // will produce '4252230000'
        message : message
    });    

</code> 


###Tip! Validate the Phone Number
  
To check that the given phone number is valid, use Att.Provider.isValidPhoneNumber method.

<code>

    var phoneNumber = '425223000a';

    if (Att.Provider.isValidPhoneNumber(phoneNumber)) {

        provider.wapPush({
            address : Att.Provider.normalizePhoneNumber(phoneNumber),
            message : message
        });    
    } 

</code>
