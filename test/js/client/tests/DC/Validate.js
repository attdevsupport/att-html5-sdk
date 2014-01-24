/*
 * Validates the response gotten after requesting DC. Checks for the existence of the deviceId, capabilities, acwvendor, acwrel, acwdevcert, acwmodel,
 * acwav, acwtermtype, acwcf, and acwaocr parameters.
 */
function validateDcResponse(response) {
	notEqual(response["deviceId"], undefined, "deviceId");
	notEqual(response["capabilities"], undefined, "capabilities");
	di = response["deviceId"];
	c =	response["capabilities"];
	if (di) {
		notEqual(di["acwvendor"], undefined, "acwvendor");
		notEqual(di["acwrel"], undefined, "acwrel");
		notEqual(di["acwdevcert"], undefined, "acwdevcert");
		notEqual(di["acwmodel"], undefined, "acwmodel");
	}
	if (c) {
		notEqual(c["acwav"], undefined, "acwav");
		notEqual(c["acwtermtype"], undefined, "acwtermtype");
		notEqual(c["acwcf"], undefined, "acwcf");
		notEqual(c["acwaocr"], undefined, "acwaocr");
	}
}

/*function validateDcResponse(response) {
 *	  notEqual(response["DeviceInfo"], undefined, "DeviceInfo");
 *	  di = response["DeviceInfo"];
 *    notEqual(di["DeviceId"], undefined, "DeviceId");
 *    notEqual(di["Capabilities"], undefined, "Capabilities");
 *    did = di["DeviceId"];
 *	  notEqual(did["IMEI"], undefined, "IMEI");
 *    ca = di["Capabilities"];
 *    notEqual(ca["Name"], undefined, "Name");
 *    notEqual(ca["Vendor"], undefined, "Vendor");
 *    notEqual(ca["Model"], undefined, "Model");
 *    notEqual(ca["Release"], undefined, "Release");
 *    notEqual(ca["UaProf"], undefined, "UaProf");
 *    notEqual(ca["MMSCapable"], undefined, "MMSCapable");
 *    notEqual(ca["AGPS"], undefined, "AGPS");
 *    notEqual(ca["Location"], undefined, "Location");
 *    notEqual(ca["BrowserName"], undefined, "BrowserName");
 *    notEqual(ca["BrowserType"], undefined, "BrowserType");
 *    notEqual(ca["WAPPush"], undefined, "WAPPush");
 *}
 */

/*
 * Validates the response gotten after requesting a DC from a landline number. Checks for the existence of the requestError and serviceException
 * parameters. Checks that the messageId is 'SVC0002', text is 'Invalid input value for message part %1', and variables is 'address'.
 */
function validateDcFailResponse(response) {
	notEqual(response["RequestError"], undefined, "RequestError");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "ServiceException");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["messageId"], "SVC0002", "messageId");
			equal(se["variables"], "address", "variables");
			equal(se["text"], "Invalid input value for message part %1", "text");
		}
	}
}