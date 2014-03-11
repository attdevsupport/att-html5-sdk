
function basicIAMTests(cfg) {

	//Function that wraps all of the tests. Slows the tests for throttling purposes.
	function slowTest(name, code) {
		test(name, function() {
			slowFn(function() {
				start();
				code();
			});
			stop();
		})
	}
	
	//Function inside the slowTest function that allows manipulation of the throttling time.
	function slowFn(code) {
		setTimeout(code, 200);
	}
	
	/********START OF TESTS********/
	slowTest("First test Authorizing user", function(){
		AttApiClient.authorizeUser({ scope: "MIM,IMMN" },
			function(response){
				start();
				ok(true, "Authorization successful!");
				expect(1);
			}, 
			function(response) {
			start();
			ok(false,"Was not able to authorize user");
		});
		stop();
	});
	
	slowTest("IAM Get Message List from server",function(){
		var count = 20;
		var offset = "";
		AttApiClient.getMessageList({
			count: count,
			offset: ""},
			function(response) {
				start();
				
				ok(true, "Succeeded in Utilizing MIM  to get up to " + count + " message messages.");
				validateMessageListResponse(response);
			},
			function(response) {
				start();
				ok(false, "Failed in Utilizing MIM getMessageHeaders." + 
					"\nresponse: " + JSON.stringify(response.responseJSON.error));
				validateFailToGetMimMessageHeaders(response);
			}
		);
		stop();
	});
	
	slowTest("Get MMS Message from server",function(){
		var count = 20;
		doGetMessageList(count, function(resp){
		var offset ="";
		var message = getMMSMessage(resp.messageList);
		if(message != null){
			start();
			ok(true, "Found MMS Message");

			AttApiClient.getMessage(
				message.messageId,						
				function(response){
					start();
					validateIsMmsMessage(response);
				},
				function(response){
					start();
					ok(false, "Something went wrong" + JSON.stringify(response));
				});
			stop();
		}
		else{
			ok(false, "Could not retrieve text message");
		}
		});
		stop();
	});
	
	slowTest("Get Text Message from server",function(){
		var count = 20;
		doGetMessageList(count, function(resp){
		var offset ="";
		var message = getTextMessage(resp.messageList);
		if(message != null){
			start();
			ok(true, "Found Text Message");
			AttApiClient.getMessage(
				message.messageId,						
				function(response){
					start();
					validateIsTextMessage(response);
				},
				function(response){
					start();
					ok(false, "Something went wrong" + JSON.stringify(response));
				});
			stop();
		}
		else{
			start();
			ok(false, "Could not locate a Text message in this batch");
		}
		});
		stop();
	});
	
	slowTest("Get Message Content from server",function(){
		var count = 20;
		doGetMessageList(count, function(resp){
		var offset ="";
		var message = getMMSMessage(resp.messageList);
		var partNum;
		if(message != null){
			start();
			ok(true, "Found MMS Message");
			for(partNum =0; partNum < message["mmsContent"].length; partNum++)
			{
			AttApiClient.getMessageContent({
				messageId	: message.messageId,
				partNum	: partNum},						
				function(response){
					start();
					validateMMSContent(response);
				},
				function(response){
					start();
					ok(false, "Something went wrong" + JSON.stringify(response));
				});
				//stop();
			}
			stop();
		}
		else{
			stop();
			ok(false, "Could not retrieve text message");
		}
		});
		stop();
	});

	slowTest("IAM Send Message (TEXT)",function(){
		AttApiClient.sendMessage({
			addresses: "4252832032",
			subject: "IAM qUnit Testing Send Message",
			message: "Hello This is a test for the IAM sendMessage API"},
			function(response) {
				start();
				
				ok(true, "Succeeded in sending Text Message to self");
				validateMIMSendMessageResponse(response);
			},
			function(response) {
				start();
				ok(false, "Failed to send message." + 
					"\nresponse: " + JSON.stringify(reponse));
			}
		);
		stop();
	});
	
	slowTest("Delete Message",function(){
		var count = 20;
		doGetMessageList(count, function(resp){
		var offset ="";
		var message = (resp.messageList.messages["0"]);
		var partNum;
		if(message != null){
			AttApiClient.deleteMessage(
				message.messageId,			
				function(response){
					start();
					validateDeleteMessage(message.messageId);
				},
				function(response){
					start();
					ok(false, "Something went wrong" + JSON.stringify(response));
				});
		}
		else{
			start();
			ok(false, "Could not retrieve text message");
		}
		});
		stop();
	});
	
		slowTest("Delete multiple messages",function(){
		var count = 20;
		doGetMessageList(count, function(resp){
		var offset ="";
		var messages = resp.messageList.messages;
		var messageId = new Array();
		if(messages.length > 5)
		{
			for (var i = 0 ; i < 5; i++)
			{
				messageId[i] = messages[i].messageId;
			}
		}
		else if (messages.length > 2)
		{
			for (var i = 0 ; i < messages.length - 1; i++)
			{
				messageId[i] = messages[i].messageId;
			}			
		}
		else 
			messageId = null;

		if(messageId != null){
			AttApiClient.deleteMessage(
				messageId,			
				function(response){
					start();
					for (key in messageId)
					{
						validateDeleteMessage(messageId[key]);
					}
				},
				function(response){
					start();
					ok(false, "Something went wrong" + JSON.stringify(response));
				});
		}
		else{
			start();
			ok(false, "Could not retrieve text message");
		}
		});
		stop();
	});
	
	slowTest("Create Message Index", function(){
		AttApiClient.createMessageIndex(
			function(response){
				start();
				ok(true, "Successfully created message index! ");
			},
			function(response){
				start();
				ok(false, "Failed to create index: " + JSON.stringify(response));
			}
		);
		stop();
	});
	
	slowTest("Get Message Index Info", function(){
		AttApiClient.getMessageIndexInfo(
			function(response){
				start();
				ok(true, "Successfully created message index! \n" + JSON.stringify(response));
			},
			function(response){
				start();
				ok(false, "Failed to create index: " + JSON.stringify(response));
			}
		);
		stop();
	});
	
	slowTest("Get Message Delta", function(){
		doCreateMessageIndex(function(){
			doGetMessageIndexInfo(function(index){
				AttApiClient.getMessageDelta(
					index.state,
					function(response){
						start();
						ok(true, "Successfully received message delta! " + JSON.stringify(response));
					},
					function(response){
						start();
						var error = jQuery.parseJSON(response.responseJSON.error);
						var errorText = error["RequestError"]["ServiceException"]["Text"];
						ok(false, "Failed to get message delta: " + errorText);
					}
				);
				stop();
			});
		});
	});
	
	/*************END OF TESTS**********/
	
	
	
	/***********Assisting methods for tests*******/
	function getMMSMessage(messageList)
	{
		var messages = messageList["messages"];
		if(messages !=null || messages.length > 0)
		{
			var MMSFound = false;
			var i;
			for(i=0; i< messages.length; i++)
			{
				if(messages[i]["type"] == "MMS")
				{
					MMSFound = true;
					return messages[i];
				}
			}
			return null;
		}
		else
			return null;
	}
	
	function getTextMessage(messageList)
	{
		var messages = messageList["messages"];
		if(messages !=null || messages.length > 0)
		{
			var textFound = false;
			var i;
			for(i=0; i< messages.length; i++)
			{
				if(messages[i]["type"] == "TEXT")
				{
					textFound = true;
					return messages[i];
				}
			}
			return null;
		}
		else
			return null;
	}
	
	function doGetMessageList(count, callback) {
		AttApiClient.getMessageList({
			count: count,
			offset: ""},
			function(response) {
				start();
				ok(true, "Succeeded in Utilizing MIM  to get " + count + " message header(s).");
				//validateMessageListResponse(response);
				callback(response);
			},
			function(response) {
				start();
				ok(false, "Failed in Utilizing MIM getMessageHeaders." + 
					"\nresponse: " + JSON.stringify(response.responseJSON.error));
				validateFailToGetMimMessageHeaders(response);
				callback(null);
			}
		);
		stop();
	}
	
	function doGetMessageIndexInfo(callback)
	{
		AttApiClient.getMessageIndexInfo(
			function(response){
				start();
				ok(true, "Successfully retrieved message index info. " + JSON.stringify(response));
				callback(response);
			},
			function(response){
				start();
				ok(false,"Failed to get message index info: " + JSON.stringify(response));
				callback(null);
			}
		);
		stop();
	}
	
	function doCreateMessageIndex(callback)
	{
		AttApiClient.createMessageIndex(
			function(response){
				start();
				ok(true, "Message Index created!");
				callback(response);
			},
			function(response){
				start();
				ok(false, "Message Index creation failed: " + JSON.stringify(response));
				callback(response);
			}
		);
		stop();
	}
	function doSendMessage()
	{
		AttApiClient
	}
}
