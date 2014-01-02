WAP Push Cookbook
===

Overview
---
This guide explains the usage of the Att.Provider for sending WAP Push messages using the AT&T HTML5 SDK Platform.

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


How do I send an WAP Push message?
---
- Create your XML WAP message. The following is an example of a valid XML WAP message with a text that will be displayed on the device.

<code>

    var url = 'your WAP url goes here';
    var text = 'This is a Test WAP Push';
    var message = '<?xml version ="1.0"?>' + 
                  '<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">' +
                  '<si>'+
                  '<indication href="' + url + '" si-id="1">' + text + '</indication>'+
                  '</si>';

</code>

- Execute the wapPush method to send the message. For more information about the parameters refer to Att.Provider.wapPush documentation. 

<code>

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

</code> 

###Tip! Normalize the Phone Number

You can use Att.Provider.normalizePhoneNumber to convert the given phone number into the format required by AT&T API Platform.

<code>
    var phoneNumber = '(425)-223-0000';

    provider.wapPush({
        address : Att.Provider.normalizePhoneNumber(phoneNumber), // will produce '4252230000'
        message : message
    });    

</code> 


###Tip! Validate the Phone Number
  
If you want to check that the given address is valid, you can use Att.Provider.isValidPhoneNumber method.

<code>

    var phoneNumber = '425223000a';

    if (Att.Provider.isValidPhoneNumber(phoneNumber)) {

        provider.wapPush({
            address : Att.Provider.normalizePhoneNumber(phoneNumber),
            message : message
        });    
    } 

</code>
