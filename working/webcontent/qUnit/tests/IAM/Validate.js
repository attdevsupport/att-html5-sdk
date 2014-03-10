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

function validateMIMMMSMessageResponse(response)
{
	notEqual(response["messageList"], undefined, "messageList");
	mhl = response["messageList"];
	notEqual(mhl["total"], undefined, "total messages = " + JSON.stringify(mhl.total));
	notEqual(mhl["messages"].length, undefined, "Received " + JSON.stringify(mhl.messages.length) + " messages of " + mhl.total);
	notEqual(mhl["limit"], undefined, "message limit: " + JSON.stringify(mhl.limit));
	notEqual(mhl["offset"], undefined, "offset: " + JSON.stringify(mhl.offset));
	messages = mhl["messages"];
	if(messages !=null || messaages.length > 0)
	{
		var MMSFound = false;
		var i;
		for(i=0; i< messages.length; i++)
		{
			if(messages[i]["type"] == "MMS")
			{
				MMSFound = true;
				break;
			}
		}
		if(MMSFound)
		{
			message = messages[i];
			notEqual(message["messageId"],undefined,"messageId: " + JSON.stringify(message["messageId"]));
			notEqual(message["from"]["value"], undefined, "Message is from: " + JSON.stringify(message["from"]["value"]));
			if(message["recipients"]!= null)
			{
				notEqual(message["recipients"], undefined, "recipients: " + message["recipients"].length);
				for(var i = 0; i< message["recipients"].length; i++)
				{
					notEqual(message["recipients"][i]["value"], undefined, "Message recipient " + i + ": " + JSON.stringify(message["recipients"][i]["value"]));
				}
			}
			else
				ok(false, "recipients");
			notEqual(message["isFavorite"],undefined,"isFavorite: " + JSON.stringify(message["isFavorite"]));
			notEqual(message["isIncoming"],undefined,"isIncoming: " + JSON.stringify(message["isIncoming"]));
			notEqual(message["isUnread"],undefined,"isUnread: " + JSON.stringify(message["isUnread"]));
			notEqual(message["typeMetaData"]["subject"], undefined, "subject: " + JSON.stringify(message["typeMetaData"]["subject"]));	
			ok(true, "Message type: " + JSON.stringify(message["type"]));
			switch (message["type"])
			{
				case "MMS": 
				
					for (var i = 0; i< message["mmsContent"].length; i++)
					{
						ok(true, "mmsContent: " + i);
						var messagePart = message["mmsContent"][i];
							notEqual(messagePart["type"], undefined, "type: " + JSON.stringify(messagePart["type"]));
							notEqual(messagePart["contentType"], undefined, "contentType: " + JSON.stringify(messagePart["contentType"]));
							notEqual(messagePart["contentName"], undefined, "contentName: " + JSON.stringify(messagePart["contentName"]));
							notEqual(messagePart["contentUrl"], undefined, "contentUrl: " + JSON.stringify(messagePart["contentUrl"]));
					}
					ok(true, "End of mmsContent");
					break;
			}
		}
		else
			ok(false, "No MMS Messages Found!");
	}
	else
		ok(false, "No messages found");
	
}
function validateMIMSMSMessageResponse(response)
{
	notEqual(response["messageList"], undefined, "messageList");
	mhl = response["messageList"];
	notEqual(mhl["total"], undefined, "total messages = " + JSON.stringify(mhl.total));
	notEqual(mhl["messages"].length, undefined, "Received " + JSON.stringify(mhl.messages.length) + " messages of " + mhl.total);
	notEqual(mhl["limit"], undefined, "message limit: " + JSON.stringify(mhl.limit));
	notEqual(mhl["offset"], undefined, "offset: " + JSON.stringify(mhl.offset));
	messages = mhl["messages"];
	if(messages !=null || messaages.length > 0)
	{
		var textFound = false;
		var i;
		for(i=0; i< messages.length; i++)
		{
			if(messages[i]["type"] == "TEXT")
			{
				textFound = true;
				break;
			}
		}
		if(textFound)
		{
			message = messages[i];
			notEqual(message["messageId"],undefined,"messageId: " + JSON.stringify(message["messageId"]));
			notEqual(message["from"]["value"], undefined, "Message is from: " + JSON.stringify(message["from"]["value"]));
			if(message["recipients"]!= null)
			{
				notEqual(message["recipients"], undefined, "recipients: " + message["recipients"].length);
				for(var i = 0; i< message["recipients"].length; i++)
				{
					notEqual(message["recipients"][i]["value"], undefined, "Message recipient " + i + ": " + JSON.stringify(message["recipients"][i]["value"]));
				}
			}
			else
				ok(false, "recipients");
			notEqual(message["isFavorite"],undefined,"isFavorite: " + JSON.stringify(message["isFavorite"]));
			notEqual(message["isIncoming"],undefined,"isIncoming: " + JSON.stringify(message["isIncoming"]));
			notEqual(message["isUnread"],undefined,"isUnread: " + JSON.stringify(message["isUnread"]));
			ok(true, "Message type: " + JSON.stringify(message["type"]));
			switch (message["type"])
			{	
				case "TEXT":
					notEqual(message["text"],undefined,"text: " + JSON.stringify(message["text"]));
					notEqual(message["timeStamp"],undefined,"timeStamp: " + JSON.stringify(message["timeStamp"]));
					break;
				default: 
					
					break;
			}
		}
		else
		{
			ok(false, "No TEXT messages found!");
		}
	}
	
}

function validateMIMContentsResponse(response) {
	notEqual(response["InboundMessage"], undefined, "InboundMessage");
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
