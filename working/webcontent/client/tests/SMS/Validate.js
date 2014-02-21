//Validates the response gotten after sending an SMS. Checks for the existence of the Id, ResourceReference, and ResourceUrl parameters.
function validateSmsResponse(response) {
  response = response["outboundSMSResponse"];
  notEqual(response["messageId"], undefined, "messageId");
  rr = response["resourceReference"];
  notEqual(rr, undefined, "resourceReference");
  if (rr) {
	notEqual(rr["resourceURL"], undefined, "resourceURL");
  }
}

// Validates the response received after sending an SMS.  Checks for the 
// existence of the Id, ResourceReference, and ResourceUrl parameters.
function validateSmsResponseWithMessage(response, message) {
  response = response["outboundSMSResponse"];
  notEqual(response["messageId"], undefined, "messageId for message to "+message);
  rr = response["resourceReference"];
  notEqual(rr, undefined, "resourceReference");
  if (rr) {
	notEqual(rr["resourceURL"], undefined, "resourceURL");
  }
}

/*
 * Validates the response gotten after requesting the status of an SMS. Checks for the existence of the DeliveryInfoList, DeliveryInfo, ResourceUrl,
 * Id, Address, and DeliveryStatus parameters.
 */
function validateStatusResponse(response) {
	//response = response["outboundSMSResponse"];
	var deliveryInfoList = response["DeliveryInfoList"];
	notEqual(deliveryInfoList, undefined, "DeliveryInfoList");
	if (deliveryInfoList != null) {
		notEqual(deliveryInfoList["DeliveryInfo"], undefined, "DeliveryInfo");
		notEqual(deliveryInfoList["ResourceUrl"], undefined, "ResourceUrl");
		deliveryInfo = deliveryInfoList["DeliveryInfo"];
		if (deliveryInfo != null) {
			len2 = deliveryInfo["length"];
			if (len2 != 0) {
				for (var j = 0; j < len2; j++) {
					notEqual(deliveryInfo[j]["Address"], undefined, "Address");
					notEqual(deliveryInfo[j]["Id"], undefined, "Id");
					equal(deliveryInfo[j]["DeliveryStatus"], "DeliveredToNetwork", "DeliveryStatus");
				}
			}
		}
	}
}

/*
 * Validates the response gotten after sending an SMS to an invalid number. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0004', text is 'No valid addresses provided in message part %1', and variables is 'Address'.
 */
function validateSmsFailBadNumberResponse(response) {
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

/*
 * Validates the response gotten after sending an SMS with no message. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'Message'.
 */
function validateSmsFailNoMessageResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0002", "MessageId");
			equal(se["Text"], "Invalid input value for message part %1", "Text");
			equal(se["Variables"], "Message", "Variables");
		}
	}
}

/*
 * Validates the response gotten after request SMS status with a non-existing smsId. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'RequestIdentifier'.
 */
function validateSmsFailBadIDResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0002", "MessageId");
			equal(se["Text"], "Invalid input value for message part %1", "Text");
			equal(se["Variables"], "RequestIdentifier", "Variables");
		}
	}
	else {
        validateSmsFailBadIDResponseLowerCase(response);
	}
}

/*
 * Validates the response gotten after request SMS status with a non-existing smsId. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'RequestIdentifier'.
 */
function validateSmsFailBadIDResponseLowerCase(response) {
	notEqual(response["requestError"], undefined, "requestError, Note the improper use of lower case below.");
	re = response["requestError"];
	if (re != null) {
		notEqual(re["serviceException"], undefined, "serviceException");
		se = re["serviceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0002", "messageId");
			equal(se["text"], "Invalid input value for message part %1", "text");
			equal(se["variables"], "RequestIdentifier", "variables");
		}
	}
}

/*
 * Validates the response gotten after sending an SMS to a landline number. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0001', text is 'No valid addresses provided in message part %1', and variables is 'Address'.
 */
function validateSmsFailLandlineResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0001", "MessageId");
			equal(se["Text"], "A service error occurred. Error code is %1", "Text");
			equal(se["Variables"], "Address", "Variables");
		}
	}
}

//Validates the response received when requesting that SMS send a message to more than 10 recipients, generating a service exception.
function validateSmsServiceException(response) {
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

// Validates the response recieved when requesting Sms with duplicate addresses.
function validateSmsDuplicatePolicyFailure(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["PolicyException"], undefined, "PolicyException");
		se = re["PolicyException"];
		if (se != null) {
			equal(se["MessageId"], "POL0013", "MessageId");
			notEqual(se["Text"], undefined, "Text");
			notEqual(se["Variables"], undefined, "Variables");
		}
	}
}

/*
 * Validates the response gotten after retrieving messages sent to the application shortcode. Checks for the existence of the InboundSmsMessageList,
 * TotalNumberOfPendingMessages, NumberOfMessagesInThisBatch, ResourceUrl, and InboundSmsMessage parameters.
 */
function validateGetSmsResponse(response) {
	notEqual(response["InboundSmsMessageList"], undefined, "InboundSmsMessageList");
	isml = response["InboundSmsMessageList"];
	if (isml != null) {
		notEqual(isml["TotalNumberOfPendingMessages"], undefined, "TotalNumberOfPendingMessages");
		notEqual(isml["NumberOfMessagesInThisBatch"], undefined, "NumberOfMessagesInThisBatch");
		notEqual(isml["ResourceUrl"], undefined, "ResourceUrl");		
		notEqual(isml["InboundSmsMessage"], undefined, "InboundSmsMessage");				
	}	
}
