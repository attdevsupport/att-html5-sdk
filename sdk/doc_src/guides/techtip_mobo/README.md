MOBO Cookbook
===

Overview
---
This guide explains the usage of the Att.Provider for sending messages on behalf of (MOBO) another AT&T phone using the AT&T HTML5 SDK Platform.

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

- Obtain consent for MOBO

To send messages on behalf of another user (usually the person using your app) your app must first obtain consent from the user. Check for existing
consent and, if not authorized, issue a request for consent. For more information about checking and obtaining consent methods, please consult the Att.Provider.isAuthorized and Att.Provider.authorizeApp SDK documentation.

<code>

	var authScope = 'MOBO';

    provider.isAuthorized({
        authScope : authScope,
        success   : doSendMessage,
        failure   : function(){
            provider.authorizeApp({
                authScope : authScope,
                success   : doSendMessage,
                failure   : function(error) {
                    Ext.Msg.alert('Access denied', 'User denied authorization');
                },
                scope: me
            });
        },
        scope: me
    });   

    function doSendMessage() {
    	// .... 
    }

</code>

How do I send a Message ?
---

- Check for and/or obtain MOBO consent (see example above).
- Execute the sendMOBO method. For more information about the parameters refer to Att.Provider.sendMobo documentation. 

<code>

	provider.sendMobo({
        address: "person@hotmail.com,818-555,1212",
        subject: "Your message subject here",
        message: "Message body here",
        group: false,
        files: "/path/to/local/file/to/attach.jpg", 

        success: function(response){
        },

        failure: function(error){
        }		

	});

</code>

###Tip! Watch your limits!

MOBO has limits on both the number of recipients (10) and the total size of the message and all attachments (600 KB). 

