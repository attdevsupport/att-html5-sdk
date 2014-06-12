In-App Messaging Cookbook
===

Overview
---
This cookbook explains how to create an instance of the AttApiClient class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 to retrieve, view, and send SMS and MMS messages from within an app.

What do I need to start?
---

1. Include att-api-client.js. Include att-api-client.js as a dependency by adding the following code to your HTML:  

        <script type="text/javascript" src="att-api-client.js"></script>

Adjust the _src_ attribute value to match the site path where you store the _att_api_client.js_ file.

2. **Obtain consent for Inbox Management.**

    To send, retrieve, and view user messages, your app must first obtain consent from the user. To do this, check for existing consent, and if your app is not already authorized, issue a request for consent. For more information about methods for checking and obtaining consent, refer to the AttApiClient.OAuth.isUserAuthorized and AttApiClient.OAuth.authorizeUser methods in the SDK documentation.


    	var authScope = 'MIM,IMMN';

		AttApiClient.OAuth.authorizeUser(
			{ scope : authScope },
			doGetMessageList,
			function(error) {
				alert('Access denied - User denied authorization');
			}
		);

        function doGetMessageList() {
    	   // .... 
        }


How do I retrieve user messages?
---

1. Obtain consent for InBox Management. See the previous example for details.
2. Use the getMessageList method. For more information about the parameters of this method ,refer to AttApiClient.InAppMessaging.getMessageList.

<code>

    AttApiClient.InAppMessaging.getMessageList(
		function(response){
            if (! (response.MessageList && response.MessageList.total > 0)) {
            	// No messages were found by the API ...
                alert('No (more) messages found to retrieve.');
                return;
            }
       
            // Populate a store with the list of retrieved messages ....
            // e.g. store.add(response.MessageList.messages);
        },

        failure: function(error) {
        	// API communication failure 
        }
    );

</code>


How do I view message parts (attachments)?
---

1. Obtain the Message Id and Part Number for the message content you want.
2. Use the method getMessageContent to obtain the message contents. For more information about the parameters of this method, refer to AttApiClient.InAppMessaging.getMessageContent.

<code>

	var messageId = 'S4',
		partNumber = '2';
		
	var contentBlob = AttApiClient.InAppMessaging.getMessageContent(
		{
			messageId: messageId, 
			partNum: partNumber
		},
		function success(result) {
			var contentBlob = result.binaryData;
		},
		function fail() {
			alert('could not get content');
		}
	);

</code>

How do I send a Message?
---

1. Obtain consent (see the previous example).
2. Use the sendMessage method. For more information about the parameters of this method, refer to AttApiClient.InAppMessaging.sendMessage.


        AttApiClient.InAppMessaging.sendMessage({
            addresses: "person@hotmail.com,818-555,1212",
            subject: "Your message subject here",
            message: "Message body here",
            group: false
			},
            success: function(response){
            },

            failure: function(error){
            }       

       });


###Tip: Watch your limits

In-App Messaging limits the maximum number of recipients to 10, and the total size of the message and all attachments to 1 MB. 

