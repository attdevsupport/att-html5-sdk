var AttApiClient = (function () {

	var _serverPath = "";

	return {

		setServerPath: function (serverPath) {
			_serverPath = serverPath || "";
		},
		serverSpeechToText: function (filenameOnServer) {
			var requestUrl = _serverPath
				+ "/speech/v3/speechToText?filename="
				+ encodeURIComponent(filenameOnServer);
			return jQuery.post(requestUrl);
		},
		speechToText: function (audioBlob) {
			var fd = new FormData();
			fd.append("speechaudio", audioBlob);
			return jQuery.ajax({
				type: "POST",
				url: _serverPath + "/speech/v3/speechToText",
				data: fd,
				processData: false,
				contentType: false
			});
		},
		textToSpeech: function (text) {
			var requestUrl = _serverPath
				+ "/speech/v3/textToSpeech?text="
				+ encodeURIComponent(text);
			return jQuery.post(requestUrl);
		}
	}

}());