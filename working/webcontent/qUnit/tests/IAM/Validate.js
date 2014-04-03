function validateMIMHeadersResponse(response) {
	notEqual(response["MessageHeadersList"], undefined, "MessageHeadersList");
	mhl = response["MessageHeadersList"];
	notEqual(mhl["Headers"], undefined, "Headers");
	notEqual(mhl["HeaderCount"], undefined, "HeaderCount");
	notEqual(mhl["IndexCursor"], undefined, "IndexCursor");
	he = mhl["Headers"];
	if (mhl["HeaderCount"] >= 1) {
		he1 = he[0];
	}
	notEqual(he1["MessageId"], undefined, "MessageId");
	notEqual(he1["From"], undefined, "From");
	notEqual(he1["To"], undefined, "To");
	notEqual(he1["Subject"], undefined, "Subject");
	notEqual(he1["Received"], undefined, "Received");
	notEqual(he1["Text"], undefined, "Text");
	notEqual(he1["Favorite"], undefined, "Favorite");
	notEqual(he1["Read"], undefined, "Read");
	notEqual(he1["Type"], undefined, "Type");	
	notEqual(he1["Direction"], undefined, "Direction");	
}

function validateMessageListResponse(response)
{
	notEqual(response["messageList"], undefined, "messageList");
	mhl = response["messageList"];
	notEqual(mhl["total"], undefined, "total messages = " + JSON.stringify(mhl.total));
	notEqual(mhl["messages"].length, undefined, "Received " + JSON.stringify(mhl.messages.length) + " messages of " + mhl.total);
	notEqual(mhl["limit"], undefined, "message limit: " + JSON.stringify(mhl.limit));
	notEqual(mhl["offset"], undefined, "offset: " + JSON.stringify(mhl.offset));
	messages = mhl["messages"];
	if(messages !=null || messages.length > 0)
	{
		var textFound = false;
		var i;
		for(i=0; i< messages.length; i++)
		{
				ok(true, "Message " + (i+1) + "/" + messages.length + " is: " + messages[i]["type"]);
		}
	}
	else
		ok(false, "Could not find messages\n" + JSON.stringify(messages));
	
}

function validateIsMmsMessage(response)
{
	message = response["message"];
	notEqual(message, undefined, "type: "+ JSON.stringify(message));
	equal(message["type"], "MMS", "type: "+ JSON.stringify(message["type"]));
}

function validateIsTextMessage(response)
{
	message = response["message"];
	notEqual(message, undefined, "type: "+ JSON.stringify(message));
	equal(message["type"], "TEXT", "type: "+ JSON.stringify(message["type"]));
}

function validateMMSContent(response) {
	message = response;
	notEqual(message, undefined, "message: " + JSON.stringify(message));
	notEqual(message["type"], undefined, "type: " + JSON.stringify(message["type"]));
	//notEqual(message["mmsContent"], undefined, "mmsContent: " + JSON.stringify(message["mmsContent"]));
}
function validateMIMSendMessageResponse(response){
	notEqual(response["id"], undefined, "Message ID: " + JSON.stringify(response));
}

function validateDeleteMessage(messageId){
	AttApiClient.getMessage(messageId,
		function(response){
		start();
			ok(false,"Message not deleted... Something went wrong\nMessageID: " + messageId);
		},
		function(response){
			start();
			var error = jQuery.parseJSON(response.responseJSON.error);
			var errorText = error["RequestError"]["ServiceException"]["Text"];
			if(errorText = "A service error has occurred: Requested message is not found. (99c504fa-47e4-496b-b65e-a92629ce49aa)")
				ok(true, "Server states message is not found! Message Successfully Deleted!\nMessageId: "+ messageId);
		}
	);
	stop();
}

function validateDeleteMessages(messageIds){
	AttApiClient.getMessages(messageIds,
		function(response){
		start();
			ok(false,"Message not deleted... Something went wrong\nMessageID: " + messageIds);
		},
		function(response){
			start();
			var error = jQuery.parseJSON(response.responseJSON.error);
			var errorText = error["RequestError"]["ServiceException"]["Text"];
			if(errorText = "A service error has occurred: Requested message is not found. (99c504fa-47e4-496b-b65e-a92629ce49aa)")
				ok(true, "Server states message is not found! Message Successfully Deleted!\nMessageId: "+ messageId);
		}
	);
	stop();
}

function validateUpdateMessage(originalMessage){
		AttApiClient.getMessage(originalMessage["id"],
		function(response){
		response = response["message"];
		start();
			ok(true,"Message found!\nMessageID: " + originalMessage["id"]);
			notEqual(response["isUnread"], undefined, "Verify original message state is not undefined");
			notEqual(JSON.stringify(response["isUnread"]), JSON.stringify(originalMessage["isUnread"]), "Verify updated read state is different than original " + JSON.stringify(response["isUnread"])); 
			notEqual(response["isFavorite"], undefined, "Verify original message isFavorite state is not undefined");
			notEqual(response["isFavorite"], JSON.stringify(originalMessage["isFavorite"]), "Verify updated favorite state is different than original " + JSON.stringify(response["isFavorite"]));
		},
		function(response){
			start();
			var error = jQuery.parseJSON(response.responseJSON.error);
			var errorText = error["RequestError"]["ServiceException"]["Text"];
		}
	);
	stop();
}

function validateUpdateMessages(originalMessage, isFavorite){
		AttApiClient.getMessage(originalMessage["id"],
		function(response){
		response = response["message"];
		start();
			ok(true,"Message found!\nMessageID: " + originalMessage["id"]);

			notEqual(response["isUnread"], undefined, 
				"Verify original message isUnread state is not undefined");
			
			notEqual(response["isUnread"], !originalMessage["isUnread"], 
				"Verify updated isUnread state is different than original " + "\n Original: " + JSON.stringify(!originalMessage["isUnread"]) + ", Updated: " + JSON.stringify(response["isUnread"])); 
			if(originalMessage["isFavorite"] !== undefined){
				notEqual(response["isFavorite"], undefined, "Verify original message isFavorite state is not undefined");
			notEqual(response["isFavorite"], !originalMessage["isFavorite"], 
				"Verify updated isFavorite state is different than original " + "\n Original: " + JSON.stringify(!originalMessage["isFavorite"]) + ", Updated: " + JSON.stringify(response["isFavorite"])); 
			}
			else{
			notEqual(response["isFavorite"], undefined, "Verify original message isFavorite state is not undefined");
			equal(response["isFavorite"], isFavorite, 
				"Verify updated isFavorite state is the same as the original " + "\n Original: " + isFavorite + " " + JSON.stringify(", Updated: " + response["isFavorite"])); 
			}
		},
		function(response){
			start();
			var error = jQuery.parseJSON(response.responseJSON.error);
			var errorText = error["RequestError"]["ServiceException"]["Text"];
		}
	);
	stop();
}

function validateReceiveMMSMessages(response) {
        //start();
        notEqual(response["galleryCount"], 0, "Data contains objects: " + response["galleryCount"]);
        var r = response["galleryImages"];
        for( var x in r){
            notEqual(r[x]["address"], undefined, "address present: " + r[x]["address"]);
            notEqual(r[x]["date"], undefined, "date present: " + r[x]["date"]);
            notEqual(r[x]["image"], undefined, "image present: " + r[x]["image"]);
            notEqual(r[x]["textMessage"], undefined, "textMessage present: " + r[x]["textMessage"]);
        }
       // stop();
}

function validateReceiveSMSMessages(response) {
	notEqual(response["data"].length, 0, "Data contains objects: " + response["data"].length);
	var r = response["data"];
	for( var x in r){
		notEqual(r[x]["sport"], undefined, "Sport type present: " + r[x]["sport"]);
		notEqual(r[x]["votes"], undefined, "Votes is defined: " + r[x]["votes"]);
	}
}

/*
 * Validates the response received when attempting to receive Message Headers with an invalid MSISDN.
 * Checks for the existence of the RequestError and the PolicyException parameters. Checks that the MessageId is 'POL0001',
 * text is: "A Policy error occurred, Invalid MSISDN".
 */
function validateFailToGetMimMessageHeaders(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["PolicyException"], undefined, "PolicyException");
		se = re["PolicyException"];
		if (se != null) {
			equal(se["MessageId"], "POL0001", "MessageId");
			equal(se["Text"], "A Policy error occurred, Invalid MSISDN", "Text");
			equal(se["Variables"], " ", "Variables");
		}
	}
}
