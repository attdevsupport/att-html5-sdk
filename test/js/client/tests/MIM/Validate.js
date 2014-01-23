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
