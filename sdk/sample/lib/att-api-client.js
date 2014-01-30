var AttApiClient = (function () {

	var _serverPath = "";

	return {

		setServerPath: function (serverPath) {
			_serverPath = serverPath || "";
		},
		serverSpeechToText: function (filenameOnServer) {
			var requestUrl = _serverPath
				+ "/att/speech/speechtotext?filename="
				+ encodeURIComponent(filenameOnServer);
			return jQuery.post(requestUrl);
		},
		speechToText: function (audioBlob) {
			var fd = new FormData();
			fd.append("speechaudio", audioBlob);
			return jQuery.ajax({
				type: "POST",
				url: _serverPath + "/att/speech/speechtotext",
				data: fd,
				processData: false,
				contentType: false
			});
		},
		textToSpeech: function (text) {

		}
	}

}());