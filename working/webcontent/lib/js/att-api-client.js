var AttApiClient = (function () {

	var _serverPath = "";

	//passed any object builds ajax urlParams from it. If any parameter is an object, is is stringified as JSON
	function buildParams(o) {
		var r = [];
		for (var key in o) {
			var item = o[key];
			if (item != null && typeof item == "object") {
				item = JSON.stringify(item);
			}
			r.push(key + "=" + encodeURIComponent(item));
		}
		return r.join("&");
	}

	return {

		setServerPath: function (serverPath) {
			_serverPath = serverPath || "";
		},
		serverSpeechToText: function (data) {
			return jQuery.post(_serverPath + "/att/speech/speechtotextcustom?" + buildParams(data));
		},
		speechToText: function (audioBlob) {
			var fd = new FormData();
			fd.append("speechaudio", audioBlob);
			return jQuery.ajax({
				type: "POST",
				url: _serverPath + "speech/v3/speechToText",
				data: fd,
				processData: false,
				contentType: false
			});
		},
		textToSpeech: function (text) {

		}
	}

}());