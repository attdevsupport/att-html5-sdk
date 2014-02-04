//Validate the response received after sending a valid tropo request
function validateTropoResponse(response) {
	notEqual(response["id"], undefined, "Id");
	equal(response["success"], true, "success");
	CcsResponse = response["success"];
	if (CcsResponse != null) {
		if(CcsResponse === false)
		{
			notEqual(response["id"], undefined, "Id");
			notEqual(response["success"], undefined, "success");
		}
	}
}

function validateTropoFailResponse(response) {
	notEqual(response["RequestError"], undefined, "Request Error");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "Service Exception");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0002", "Message Id");
			equal(se["Text"], "Invalid input value for message part %1", "Text");
			equal(se["Variables"], "Token", "Variables");
		}
	}
}


