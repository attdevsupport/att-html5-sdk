MIM (My Messages) Cookbook
===

Overview
---
This guide explains the usage of the Att.Provider for accessing My Messages using the AT&T HTML5 SDK Platform.

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

- Obtain consent for MIM

To retrieve and view user messages, your app must first obtain consent from the user. Check for existing consent and, if not authorized, issue a request for consent. For more information about checking and obtaining consent methods, please consult the Att.Provider.isAuthorized and Att.Provider.authorizeApp SDK documentation.

<code>

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

</code>

How do I retrieve user messages ?
---

- Check for and/or obtain consent for MIM (see above).
- Execute the getMessageHeaders method. For more information about the parameters refer to the Att.Provider.getMessageHeaders documentation.

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


###Tip! AT&T Message App Installation Required

Messages can only be obtained from users who have previously downloaded and activated the **AT&T Messages App** on their mobile device. This
app is available in the iTunes App Store (for iPhones and iPads), and Google Play (for Android devices).

###Tip! Save the indexCursor!

When you retrieve messages from the MIM API, an indexCursor is returned along with the headers. It is important to save this indexCursor for use with your next request, otherwise the API will send the same batch of message headers all over again.


###Tip! Message Order

Messages retrieved from the AT&T API will always be returned in order from newest to oldest. If you wish to allow sorting of messages within your application you should retrieve all message headers in one call and sort them however you wish.


How do I view message parts (attachments) ?
---

- Obtain the Message Id, Part Number and Part Type from the message headers.
- Execute the static method getContentSrc which provides a properly constructed URL to obtain the message contents. For more information about the parameters refer to the Att.Provider.getContentSrc documentation.

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
