//Validates the response gotten after sending an WAP. Checks for the existence of the id parameter.
function validateWapResponse(response) {
	notEqual(response["id"], undefined, "id");
}

/*
 * Validates the response gotten after sending an WAP to a landline number. Checks for the existence of the requestError, serviceException, messageId,
 * text, and variables parameters. Note that, as it is currently impossible to get a landline address error from WAP, as WAP is currently under the
 * impression that it can successfully send to landline addresses, so the expected values of the latter three parameters are not known.
 */
function validateWapFailResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["messageId"], "", "messageId");
			equal(se["text"], "", "text");
			equal(se["variables"], "", "variables");
		}
	}
}

/*
 * Validates the response received after sending an WAP with an invalid address. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0004', text is 'No valid addresses provided for message part %1', and variables is 'Address'.
 */
function validateWapFailBadAddressResponse(response) {
	notEqual(response["requestError"], undefined, "requestError, Note the improper use of lower case below.");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0004", "messageId");
			equal(se["text"], "No valid addresses provided for message part %1", "text");
			equal(se["variables"], "Address", "variables");
		}
	}
	else {
        validateWapFailBadAddressResponseLowerCase(response);
	}
}

/*
 * Validates the response received after sending an WAP with an invalid address. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0004', text is 'No valid addresses provided for message part %1', and variables is 'Address'.
 */
function validateWapFailBadAddressResponseLowerCase(response) {
	notEqual(response["requestError"], undefined, "requestError, Note the improper use of lower case below.");
	re = response["requestError"];
	if (re != null) {
		notEqual(re["serviceException"], undefined, "serviceException");
		se = re["serviceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0004", "messageId");
			equal(se["text"], "No valid addresses provided for message part %1", "text");
			equal(se["variables"], "Address", "variables");
		}
	}
}

/*
 * Validates the response gotten after sending an WAP with an invalid message. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0001', text is 'A service error occurred. Error code is %1', and variables is 'SVC0001'.
 */
function validateWapFailBadMessageResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0001", "messageId");
			equal(se["text"], "A service error occurred. Error code is %1", "text");
			equal(se["variables"], "SVC0001", "variables");
		}
	}
	else {
        validateWapFailBadMessageResponseLowerCase(response);
	}
}

/*
 * Validates the response gotten after sending an WAP with an invalid message. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0001', text is 'A service error occurred. Error code is %1', and variables is 'SVC0001'.
 */
function validateWapFailBadMessageResponseLowerCase(response) {
	notEqual(response["requestError"], undefined, "requestError, Note the improper use of lower case below.");
	re = response["requestError"];
	if (re != null) {
		notEqual(re["serviceException"], undefined, "serviceException");
		se = re["serviceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0001", "messageId");
			equal(se["text"], "A service error occurred. Error code is %1", "text");
			equal(se["variables"], "SVC0001", "variables");
		}
	}
}
