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
