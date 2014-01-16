In App Messaging (MIM/MOBO) Cookbook
===

Overview
---
This cookbook explains how to create an instance of the Att.Provider class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 to retrieve, view, and send MIM and MOBO messages.

What do I need to start?
---

1. **Include Att.Provider as a dependency by declaring it in the "requires" section of your class definition**  

        Ext.define('MyApp.MyController', {
            extend  : 'Ext.Controller',
            requires: [
                'Att.Provider'
                //more dependencies here ... 
            ],

            //...
        });

2. **Create an instance of Att.Provider** 

        var provider = Ext.create('Att.Provider');

3. **Obtain consent for MIM**

    To retrieve and view user messages, your app must first obtain consent from the user. To do this, check for existing consent and, if your app is not already authorized, issue a request for consent. For more information about methods for checking and obtaining consent, refer to the Att.Provider.isAuthorized and Att.Provider.authorizeApp methods in the SDK documentation.


    	var authScope = 'MIM';

        provider.isAuthorized({
            authScope : authScope,
            success   : doGetMessageHeaders,
            failure   : function(){
                provider.authorizeApp({
                    authScope : authScope,
                    success   : doGetMessageHeaders,
                    failure   : function(error) {
                        Ext.Msg.alert('Access denied', 'User denied authorization');
                    },
                    scope: me
                });
            },
            scope: me
        });   

        function doGetMessageHeaders() {
    	   // .... 
        }

4. **Obtain consent for MOBO**

    To send messages on behalf of one user (usually the person using your app) to another user, your app must first obtain consent from the user. To do this, check for existing consent and, if your app is not already authorized, issue a request for consent. For more information about checking and obtaining consent, refer to the Att.Provider.isAuthorized and Att.Provider.authorizeApp methods in the SDK documentation.


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


How do I retrieve user messages?
---

1. Check for and/or obtain consent for MIM (see the previous example).
2. Execute the getMessageHeaders method. For more information about the parameters of this method refer to Att.Provider.getMessageHeaders.

<code>

	var indexCursor = 0, // Start with first message
		headerCount = 25; // Get messages in chunks of 25

    provider.getMessageHeaders({
        headerCount: headerCount,
        indexCursor: indexCursor,

        success: function(response){

            if (! (response.MessageHeadersList && response.MessageHeadersList.HeaderCount > 0)) {
            	// No messages were found by the API ...
                Ext.Msg.alert("Note", 'No (more) messages found to retrieve.');
                return;
            }
       
            if (indexCursor == 0) {
				// If method is called with indexCursor of 0, empty our messages store as we're starting from the beginning.
				// eg. store.removeAll();
            }

            // Save your indexCursor for the next call to getMessageHeaders
   			// eg. indexCursor = response.MessageHeadersList.IndexCursor;

            // Populate a store with the list of retrieved message headers ....
            // eg. store.add(response.MessageHeadersList.Headers);
        },

        failure: function(error) {
        	// API communication failure 
        }

    });

</code>


###Tip! AT&T Message App Installation Is Required

Messages can only be obtained from users who have previously downloaded and activated the **AT&T Messages App** on their mobile device. This
app is available in the iTunes App Store (for iPhones and iPads), and Google Play (for Android devices).

###Tip! Save the indexCursor

When you retrieve messages from the MIM API, an indexCursor is returned along with the headers. It is important to save this indexCursor for use with your next request; otherwise, the API will resend the same batch of message headers.


###Tip! Message Order

Messages retrieved from the AT&T API will always be returned in order from newest to oldest. To allow sorting of messages in your application, retrieve all the message headers in one call and then sort them in the order you wish.


How do I view message parts (attachments)?
---

1. Obtain the Message Id, Part Number and Part Type from the message headers.
2. Execute the static method getContentSrc which provides a properly constructed URL to obtain the message contents. For more information about the parameters of this method, refer to Att.Provider.getContentSrc.

<code>

	var messageId = 'S4',
		partNumber = '2',
		contentType = 'IMAGE/JPEG',
		contentSrc = Att.Provider.getContentSrc(messageId, partNumber);

	var p = Ext.create('Ext.Panel', {
    	fullscreen: true,
    	layout: 'hbox'
    });

    if (contentType == 'IMAGE/JPEG') {
    	p.add({
    		xtype: 'image',
    		src: contentSrc,
    		flex: 1
    	})
    }

    if (contentType == 'TEXT/PLAIN') {
    	p.add({
    		src: contentSrc,
    		flex: 1
    	})
    }
</code>

How do I send a Message?
---

1. Check for and/or obtain MOBO consent (see the previous example).
2. Execute the sendMOBO method. For more information about the parameters of this method, refer to Att.Provider.sendMobo. 


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


###Tip! Watch your limits

MOBO has limits on the number of recipients (10) and on the total size of the message and all attachments (600 KB). 
