
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
		AttApiClient.OAuth.authorizeUser({ scope: "MIM,IMMN" },
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
		AttApiClient.InAppMessaging.getMessageList({
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

			AttApiClient.InAppMessaging.getMessage(
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
			AttApiClient.InAppMessaging.getMessage(
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
		var count = 100;
		doGetMessageList(count, function(resp){
		var offset ="";
		var message = getMMSMessage(resp.messageList);
		var partNum;
		if(message != null){
			start();
			ok(true, "Found MMS Message");
			for(partNum =0; partNum < message["mmsContent"].length; partNum++)
			{
			AttApiClient.InAppMessaging.getMessageContent({
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
		AttApiClient.InAppMessaging.sendMessage({
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
			AttApiClient.InAppMessaging.deleteMessage(
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
			AttApiClient.InAppMessaging.deleteMessages(
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
		AttApiClient.InAppMessaging.createMessageIndex(
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
		AttApiClient.InAppMessaging.getMessageIndexInfo(
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
				doSendMessage(function(){
					AttApiClient.InAppMessaging.getMessageDelta(
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
	});
	
		
	slowTest("Update multiple messages",function(){
		var count = 5;
		doGetMessageList(count, function(resp){
		var offset ="";
		var retMessages = new Array();

		if (resp.messageList.messages.length >= 2)
		{	start();
			var fav;
			for (var i = 0 ; i < 2; i++)
			{
				var curMessage = {};
				curMessage["id"] = resp.messageList.messages[i]["messageId"];
				curMessage["isUnread"] = !resp.messageList.messages[i]["isUnread"];
				if(i == 1)
				{
				curMessage["isFavorite"] = !resp.messageList.messages[i]["isFavorite"];
				ok(true, "Message " + i + " = id: " + curMessage["id"] + ", isUnread: " + !curMessage["isUnread"] + ", isFavorite: " + !curMessage["isFavorite"]);
				}
				else{
					fav = resp.messageList.messages[i]["isFavorite"];
					ok(true, "Message " + i + " = id: " + curMessage["id"] + ", isUnread: " + !curMessage["isUnread"] + ", NOT CHANGING isFavorite: " + fav);
				}
				
				retMessages[i] = curMessage;
			}
			stop();
		}
		else 
			retMessages = null;

		if(retMessages != null){
			AttApiClient.InAppMessaging.updateMessages(
				retMessages
			,			
				function(response){
					start();
					for (key in retMessages)
					{
						
						validateUpdateMessages(retMessages[key], fav);
					}
				},
				function(response){
					start();
					ok(false, "Something went wrong" + JSON.stringify(response));
				}
			);
		}
		else{
			start();
			ok(false, "Could not retrieve text message");
		}
		});
		stop();
	});

	
	slowTest("Update Message",function(){
		var count = 5;
		doGetMessageList(count, function(resp){
		var offset ="";
		var messages = resp.messageList.messages;
		var retMessage = new Array();

		if (messages.length >= 1)
		{
				retMessage["id"] = messages[0]["messageId"];	
				retMessage["isUnread"] = messages[0]["isUnread"];
				retMessage["isFavorite"] = messages[0]["isFavorite"];
		}
		else 
			retMessage = null;

		if(retMessage != null){
			AttApiClient.InAppMessaging.updateMessage(
				{
				id : retMessage["id"],
				isUnread : !retMessage["isUnread"],
				isFavorite : !retMessage["isFavorite"]
				},			
				function(response){
					start();
					ok(true, "Succeeded in getting message from server");
						validateUpdateMessage(retMessage);
				},
				function(response){
					start();
					ok(false, "Something went wrong" + JSON.stringify(response));
				}
			);
		}
		else{
			start();
			ok(false, "Could not retrieve text message");
		}
		});
		stop();
	});	
    
    slowTest("Get Notification Connection Details for TEXT (STOMP)", function(){
        AttApiClient.InAppMessaging.getNotificationConnectionDetails({
            queues : "TEXT"
            },
            function(response){
                start();
                ok(true, "success: " + JSON.stringify(response));
            },
            function(response){
                start();
                ok(false, "fail: " + JSON.stringify(response));
            }
        )
        stop();
    });
    
    slowTest("Get Notification Connection Details for MMS (STOMP)", function(){
        AttApiClient.InAppMessaging.getNotificationConnectionDetails({
            queues : "MMS"
            },
            function(response){
                start();
                ok(true, "success: " + JSON.stringify(response));
            },
            function(response){
                start();
                ok(false, "fail: " + JSON.stringify(response));
            }
        )
        stop();
    });
    
    slowTest("Receive MMS", function(){
        //start();
        var req = new XMLHttpRequest;
        req.open('GET', AttApiClient.serverPath + '../../../att/mms/gallerygetter',false);
        req.send(null);
        var jsonObj = JSON.parse(req.responseText);
        notEqual(jsonObj, undefined, "Received response from server");
        validateReceiveMMSMessages(jsonObj);
        //stop();
    });
    
    slowTest("Receive SMS", function(){
        var req = new XMLHttpRequest;
        //req.overrideMimeType("application/json");
        req.open('GET', AttApiClient.serverPath + '../../../att/sms/votegetter',false);
        var target = {};
        req.onload = function() {target = req.responseText;};  
        req.send(null);
        var jsonObj = JSON.parse(req.responseText);
        validateReceiveSMSMessages(jsonObj);
    });
    
    //NEGATIVE TESTS
    slowTest("NEGATIVE -STOMP Invalid queues", function(){
        AttApiClient.InAppMessaging.getNotificationConnectionDetails({
            queues : "Invalid"
            },
            function(response){
                start();
                ok(false, "success: " + JSON.stringify(response));
            },
            function(response){
                start();
                ok(true, "fail: " + JSON.stringify(response));
            }
        )
        stop();
    });
    
    slowTest("Negative -  invalid ID for Updated Message", function(){

        AttApiClient.InAppMessaging.updateMessage(
            {
                id : 'invalidID',
                isUnread : false
            },			
            function(response){
                start();
                ok(false, "Succeeded in getting message from server");
                    //validateUpdateMessage(retMessage);
            },
            function(response){
                start();
                ok(true, "Something went wrong" + JSON.stringify(response));
            }
        );
		stop();
    });
    
    slowTest("NEGATIVE - No index state change for delta", function(){
		doCreateMessageIndex(function(){
			doGetMessageIndexInfo(function(index){
					AttApiClient.InAppMessaging.getMessageDelta(
						index.state,
						function(response){
							start();
							ok(false, "Successfully received message delta! " + JSON.stringify(response));
						},
						function(response){
							start();
							var error = jQuery.parseJSON(response.responseJSON.error);
							var errorText = error["RequestError"]["ServiceException"]["Text"];
							ok(true, "Failed to get message delta: " + errorText);
						}
					);
					stop();
			});
		});
	});
    
    slowTest("NEGATIVE - Update multiple messages - INVALID ID's",function(){
		var count = 5;
		doGetMessageList(count, function(resp){
		var offset ="";
		var retMessages = new Array();

		if (resp.messageList.messages.length >= 2)
		{	start();
			var fav;
			for (var i = 0 ; i < 2; i++)
			{
				var curMessage = {};
				curMessage["id"] = resp.messageList.messages[i]["messageId"] + i;
				curMessage["isUnread"] = !resp.messageList.messages[i]["isUnread"];
				
				retMessages[i] = curMessage;
			}
			stop();
		}
		else 
			retMessages = null;

		if(retMessages != null){
			AttApiClient.InAppMessaging.updateMessages(
				retMessages
			,			
				function(response){
					start();
					for (key in retMessages)
					{
						ok(false, "This should not have passed");
						validateUpdateMessages(retMessages[key], fav);
					}
				},
				function(response){
					start();
					ok(true, "Something went wrong" + JSON.stringify(response));
				}
			);
		}
		else{
			start();
			ok(false, "Could not retrieve text message");
		}
		});
		stop();
	});
    
    		slowTest("NEGATIVE - Delete multiple messages - Invalid IDs",function(){
		var count = 20;
		doGetMessageList(count, function(resp){
		var offset ="";
		var messages = resp.messageList.messages;
		var messageId = new Array();
		if(messages.length > 5)
		{
			for (var i = 0 ; i < 5; i++)
			{
				messageId[i] = messages[i].messageId + i;
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
			AttApiClient.InAppMessaging.deleteMessage(
				messageId,			
				function(response){
					start();
					for (key in messageId)
					{
                        ok(false, "This should have failed");
						validateDeleteMessage(messageId[key]);
					}
				},
				function(response){
					start();
					ok(true, "Message " + JSON.stringify(response));
				});
		}
		else{
			start();
			ok(false, "Could not retrieve text message");
		}
		});
		stop();
	});
    
    slowTest("NEGATIVE - IAM Send Message (TEXT) - Invalid Address",function(){
		AttApiClient.InAppMessaging.sendMessage({
			addresses: "1234567980",
			subject: "IAM qUnit Testing Send Message",
			message: "Hello This is a test for the IAM sendMessage API"},
			function(response) {
				start();
				
				ok(false, "Succeeded in sending Text Message to self, though should have failed");
				validateMIMSendMessageResponse(response);
			},
			function(response) {
				start();
				ok(true, "Failed to send message." + 
					"\nresponse: " + JSON.stringify(response));
			}
		);
		stop();
	});
	
	slowTest("NEGATIVE - Delete Message - Invalid ID",function(){
		var count = 20;
		doGetMessageList(count, function(resp){
		var offset ="";
		var message = (resp.messageList.messages["0"]);
		var partNum;
		if(message != null){
			AttApiClient.InAppMessaging.deleteMessage(
				"InvalidID",			
				function(response){
					start();
                    ok(false, "Message should not have been deleted");
					validateDeleteMessage(message.messageId);
				},
				function(response){
					start();
					ok(true, "Error Message: " + JSON.stringify(response));
				});
		}
		else{
			start();
			ok(false, "Could not retrieve text message");
		}
		});
		stop();
	});
    
	
	slowTest("NEGATIVE - Get MMS Message from server - Invalid ID",function(){
        AttApiClient.InAppMessaging.getMessage(
            "InvalidID",						
            function(response){
                start();
                ok(fail, "There should have been no message with this ID");
                validateIsMmsMessage(response);
            },
            function(response){
                start();
                ok(true, "No Message with this invalid id found: " + JSON.stringify(response));
            }
        );
        stop();
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
		AttApiClient.InAppMessaging.getMessageList({
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
		AttApiClient.InAppMessaging.getMessageIndexInfo(
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
		AttApiClient.InAppMessaging.createMessageIndex(
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
	function doSendMessage(callback)
	{
		AttApiClient.InAppMessaging.sendMessage({
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
	}
}
