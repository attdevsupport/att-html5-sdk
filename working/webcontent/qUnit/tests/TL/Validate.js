//Validates the response gotten after requesting TL. Checks for the existence of the accuracy, latitude, longitude, and timestamp parameters.
function validateTlResponse(response) {
	notEqual(response, undefined, "response");
	r = response;
	if (r != null) {
			notEqual(r["accuracy"], undefined, "accuracy");
			notEqual(r["latitude"], undefined, "latitude");
			notEqual(r["longitude"], undefined, "longitude");
			notEqual(r["timestamp"], undefined, "timestamp");
	}
}

/*
 * Validates the response gotten after requesting a TL from a landline number. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'address'.
 */
function validateTlFailResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0002", "messageId");
			equal(se["text"], "Invalid input value for message part %1", "text");
			equal(se["variables"], "address", "variables");
		}
	}
}

/*
 * Validates the response gotten after requesting a TL from a landline number. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'address'.
 */
function validateTlBadAAResponse(response) {
	notEqual(response["requestError"], undefined, "requestError");
	re = response["requestError"];
	if (re != null) {
		notEqual(re["serviceException"], undefined, "serviceException");
		se = re["serviceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0200", "messageId");
			equal(se["text"], "Accuracy of location is not within acceptable limit", "text");
			equal(se["variables"], "acceptableAccuracy", "variables");
		}
	}
}
