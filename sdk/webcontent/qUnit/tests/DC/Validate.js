/*
 * Validates the response gotten after requesting DC. Checks for the existence of the deviceId, capabilities, acwvendor, acwrel, acwdevcert, acwmodel,
 * acwav, acwtermtype, acwcf, and acwaocr parameters.
 */
function validateDcResponse(response) {
    response = response["DeviceInfo"];
	notEqual(response["DeviceId"], undefined, "DeviceId");
	notEqual(response["Capabilities"], undefined, "Capabilities");
	di = response["DeviceId"];
	c =	response["Capabilities"];
	if (di != null) {
		notEqual(di["TypeAllocationCode"], undefined, "TypeAllocationCode");
    }
		notEqual(c["AssistedGps"], undefined, "AssistedGps");
		notEqual(c["DeviceBrowser"], undefined, "DeviceBrowser");
		notEqual(c["FirmwareVersion"], undefined, "FirmwareVersion");
		notEqual(c["LocationTechnology"], undefined, "LocationTechnology");
		notEqual(c["MmsCapable"], undefined, "MmsCapable");
		notEqual(c["Model"], undefined, "Model");
		notEqual(c["Name"], undefined, "Name");
		notEqual(c["UaProf"], undefined, "UaProf");
		notEqual(c["Vendor"], undefined, "Vendor");
		notEqual(c["WapPushCapable"], undefined, "WapPushCapable");
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