//Validate the response received after sending a valid speech request
function validateADSResponse(response) {
	notEqual(response["AdsResponse"], undefined, "Ads Response");
	adsResponse = response["AdsResponse"];
	if (adsResponse != null) {
		// alert("response: " + JSON.stringify(response));
		// alert("response[adsResponse]: " + JSON.stringify(AdsResponse));
		notEqual(adsResponse["Ads"], undefined, "Ads");
		ads = adsResponse["Ads"];
		if (ads) {
			notEqual(ads["Type"], undefined, "Type");
			notEqual(ads["Text"], undefined, "Text");
			notEqual(ads["ClickUrl"], undefined, "Click kUrl");
			notEqual(ads["ImageUrl"], undefined, "Image Url");
			notEqual(ads["TrackUrl"], undefined, "Track Url");
			notEqual(ads["Content"], undefined, "Content");
		}
	}
}

//Validate the response received after sending a valid speech request
function validateSpeechADSResponse(response, expectedWords) {
	notEqual(response["Recognition"], undefined, "Recognition");
	recog = response["Recognition"];
	if (recog != null) {
		// alert("response: " + JSON.stringify(response));
		// alert("response[Recognition]: " + JSON.stringify(recog));
		notEqual(recog["ResponseId"], undefined, "ResponseId");
		nb = recog["NBest"];
		nBestElement = nb.shift();
		hyp = nBestElement["Hypothesis"];
		// alert("response[Recognition]: " + JSON.stringify(recog));
		// alert("nBestElement: " + JSON.stringify(nBestElement));
		// alert("Hypothesis: " + hyp);
		
		if (nBestElement) {
			equal(hyp, expectedWords, "Expected Words");
			notEqual(nBestElement["Hypothesis"], undefined, "Hypothesis");
			notEqual(nBestElement["LanguageId"], undefined, "LanguageId");
			equal(nBestElement["LanguageId"], "en-us", "American English");
			notEqual(nBestElement["Confidence"], undefined, "Confidence");
			notEqual(nBestElement["Grade"], undefined, "Grade");
			equal(nBestElement["Grade"], "accept", "Acceptable");
			notEqual(nBestElement["ResultText"], undefined, "ResultText");
			equal(nBestElement["ResultText"], expectedWords, "Expected Result Text");
			notEqual(nBestElement["Words"].shift(), undefined, "Words");
			notEqual(nBestElement["WordScores"].shift(), undefined, "WordScores");
		}
	}
}

function validateADSFailResponse(response) {
	notEqual(response["RequestError"], undefined, "Request Error");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "Service Exception");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0002", "Message Id");
			equal(se["Text"], "Invalid input value for message part %1", "Text");
			equal(se["Variables"], "Category", "Variables");
		}
	}
}

function validateADSInvalidGenderResponse(response) {
	notEqual(response["RequestError"], undefined, "Request Error");
	re = response["RequestError"];
	if (re != null) {
		notEqual(re["ServiceException"], undefined, "Service Exception");
		se = re["ServiceException"];
		if (se != null) {
			equal(se["MessageId"], "SVC0003", "Message Id");
			equal(se["Text"], "Invalid input value for message part %1, valid values are %2", "Text");
			equal(se["Variables"], "Gender , M/F", "Variables");
		}
	}
}

