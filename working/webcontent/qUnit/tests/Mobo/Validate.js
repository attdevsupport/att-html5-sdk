// Validates the response received when requesting Mobo with valid input.
function validateMoboResponse(response) {
	notEqual(response["Id"], undefined, "Id");
}

// Validates the response received when requesting Mobo with valid input.
function validateMoboResponseWithMessage(response, message) {
	notEqual(response["Id"], undefined, "Id for message to "+message);
}

//Validates the response gotten when requesting Mobo in a way to generate a service error
function validateMoboFailSEResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0001", "messageId");
			notEqual(se["text"], undefined, "text");
			notEqual(se["variables"], undefined, "variables");
		}
	}
}

// Validates the response received when requesting Mobo in a way to generate a policy error
// by sending a message to too many recipients.
function validateMoboPolicyFailure(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "POL0003", "MessageId");
			equal(se["Text"], "Too many addresses specified in Message part", "Text");
			equal(se["Variables"], "", "Variables");
		}
	}
}

// Validates the response received when requesting Mobo with invalid input for the message.
function validateMoboFailureWhenInvalidMessageSent(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0002", "MessageId");
			notEqual(se["Text"], undefined, "Text");
			notEqual(se["Variables"], undefined, "Variables");
		}
	}
}

//Validates the response gotten when requesting Mobo with invalid input for message, includes valid values for the message
function validateMoboFailIIFM2Response(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0003", "messageId");
			notEqual(se["text"], undefined, "text");
			notEqual(se["variables"], undefined, "variables");
		}
	}
}

//Validates the response gotten when requesting Mobo without a valid address
function validateMoboInvalidAddressFailure(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0004", "MessageId");
			notEqual(se["Text"], undefined, "Text");
			notEqual(se["Variables"], undefined, "Variables");
		}
	}
}

//Validates the response gotten when requesting Mobo when the delivery receipt notification is not supported
function validateMoboFailDRNResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0283", "messageId");
			equal(se["text"], "Delivery receipt notification not supported", "text");
			equal(se["variables"], "", "variables");
		}
	}
}

// Validates the response recieved when requesting Mobo with duplicate addresses.
// Actually, Mobo just removes the duplicates from the address list and succeeds.
function validateMoboDuplicatePolicyFailure(response) {
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
