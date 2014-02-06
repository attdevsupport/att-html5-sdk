//Validates the response gotten after sending an MMS. Checks for the existence of the Id, ResourceReference, and ResourceUrl parameters.
function validateMmsResponse(response) {
	notEqual(response["Id"], undefined, "Id");
	rr = response["ResourceReference"];
	notEqual(rr, undefined, "ResourceReference");
	if (rr) {
		notEqual(rr["ResourceUrl"], undefined, "ResourceUrl");
	}
}

/*
 * Validates the response gotten after requesting the status of an MMS. Checks for the existence of the DeliveryInfoList, DeliveryInfo, ResourceURL,
 * Id, Address, and DeliveryStatus parameters.
 */
function validateMmsStatusResponse(response) {
	dil = response["DeliveryInfoList"];
	notEqual(dil, undefined, "DeliveryInfoList");
	if (dil != null) {
		notEqual(dil["DeliveryInfo"], undefined, "DeliveryInfo");
		notEqual(dil["ResourceUrl"], undefined, "ResourceUrl");
		di = dil["DeliveryInfo"];
		if (di != null) {
			len2 = di["length"];
			if (len2 != 0) {
				for (var j = 0; j < len2; j++) {
					notEqual(di[j]["Id"], undefined, "Id");
					notEqual(di[j]["Address"], undefined, "Address");
					notEqual(di[j]["DeliveryStatus"], undefined, "DeliveryStatus");
				}	
			}
		}
	}
}

/*
 * Validates the response gotten after sending an MMS to a landline number. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0001', text is 'A service error occurred. Error code is %1', and variables is 'MM7-4007'.
 */
function validateMmsFailResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0001", "MessageId");
			equal(se["Text"], "A service error occurred. Error code is %1", "Text");
			equal(se["Variables"], "MM7-4007", "Variables");
		}
	}
	else {
		validateMmsFailResponseLowerCase(response);
	}
}

/*
 * Validates the response received after sending an MMS to a landline number. Checks for the existence of the RequestError and ServiceException
 * parameters. Checks that the MessageId is 'SVC0001', text is 'A service error occurred. Error code is %1', and variables is 'MM7-4007'.
 */
function validateMmsFailResponseLowerCase(response) {
	notEqual(response["requestError"], undefined, "requestError, Note the improper use of lower case below.");
	re = response["requestError"];
	if (re != null) {
		notEqual(re["serviceException"], undefined, "serviceException");
		se = re["serviceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0001", "messageId");
			equal(se["text"], "A service error occurred. Error code is %1", "text");
			equal(se["variables"], "MM7-4007", "variables");
		}
		else {
			validateMmsPolicyFailResponseLowerCase(response);
		}
	}
}

/*
 * Validates the response received after sending an MMS to a landline number.
 * Presently it is a weird policy Exception.
 */
function validateMmsPolicyFailResponseLowerCase(response) {
	notEqual(response["requestError"], undefined, "requestError, Note the improper use of lower case below.");
	re = response["requestError"];
	if (re != null) {
		notEqual(re["policyException"], undefined, "policyException");
		pe = re["policyException"];
		if (pe != null) {
			equal(pe["messageId"], "POL0003", "messageId");
			equal(pe["text"], "Too many addresses specified in message part", "text");
			equal(pe["variables"], "MM7-4007", "variables");
		}
	}
}

//Validates the response received when requesting that MMS send a message to more than 10 recipients, generating a service exception.
function validateMmsServiceException(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0004", "MessageId");
			equal(se["Text"], "No valid addresses provided in the message part %1", "Text");
			equal(se["Variables"], "Address", "Variables");
		}
	}
}

// Validates the response recieved when requesting Mms with duplicate addresses.
function validateMmsDuplicatePolicyFailure(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "POL0013", "MessageId");
			notEqual(se["Text"], undefined, "Text");
			notEqual(se["Variables"], undefined, "Variables");
		}
	}
}

/*
 * Validates the response received after sending an MMS with any sort of problem. Checks for the existence of the RequestError and
 * ServiceException parameters. Checks that the messageId is always 'SVC0004', text is 'Invalid input value for message part %1',
 * and variables is 'Address'.
 */
function validateMmsFailBadAddressResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0004", "MessageId");
		 // equal(se["Text"], "Invalid input value for message part %1", "Text");
			equal(se["Text"], "No valid addresses provided in the message part %1", "Text");
			equal(se["Variables"], "Address", "Variables");
		}
	}
}

/*
 * Validates the response gotten after sending an MMS with no message. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'Message'.
 */
function validateMmsFailNullMessageResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["serviceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0002", "MessageId");
			equal(se["Text"], "Invalid input value for message part %1", "Text");
			equal(se["Variables"], "Message", "Variables");
		}
	}
	else {
		validateMmsFailNullMessageResponseLowerCase(response);
	}
}

/*
 * Validates the response gotten after sending an MMS with no message. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'Message'.
 */
function validateMmsFailNullMessageResponseLowerCase(response) {
	notEqual(response["requestError"], undefined, "requestError, Note the improper use of lower case below.\nresponse: " + JSON.stringify(response));
	re = response["requestError"];
	if (re != null) {
		notEqual(re["serviceException"], undefined, "serviceException");
		se = re["serviceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0002", "messageId");
			equal(se["text"], "Invalid input value for message part %1", "text");
			equal(se["variables"], "Message", "variables");
		}
	}
}

/*
 * Validates the response gotten after sending an MMS with an invalid priority. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'priority'.
 */
function validateMmsFailBadPriorityResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0002", "MessageId");
			equal(se["Text"], "Invalid input value in message part %1", "Text");
			equal(se["Variables"], "Priority", "Variables");
		}
	}
	else {
		validateMmsFailBadPriorityResponseLowerCase(response);
	}
}

/*
 * Validates the response gotten after sending an MMS with an invalid priority. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'priority'.
 */
function validateMmsFailBadPriorityResponseLowerCase(response) {
	notEqual(response["requestError"], undefined, "requestError, Note the improper use of lower case below.");
	re = response["requestError"];
	if (re != null) {
		notEqual(re["serviceException"], undefined, "serviceException");
		se = re["serviceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0002", "messageId");
			equal(se["text"], "Invalid input value for message part %1", "text");
			equal(se["variables"], "Priority", "variables");
		}
	}
}

/*
 * Validates the response gotten after requesting an MMS status with an non-existing mmsId. Checks for the existence of the requestError and 
 * serviceException parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 
 * 'requestIdentifier or senderAddress'.
 */
function validateMmsFailBadMmsIdResponse(response) {
	notEqual(response["requestError"], undefined, "requestError, Note the improper use of lower case below.");
	re = response["requestError"];
	if (re != null) {
		notEqual(re["serviceException"], undefined, "serviceException");
		se = re["serviceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0002", "messageId");
			equal(se["text"], "Invalid input value for message part %1", "text");
			equal(se["variables"], "requestIdentifier or senderAddress", "variables");
		}
	}
}
