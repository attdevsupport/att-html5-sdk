var AttApiClient = (function () {

	var _serverPath = "";

	//passed any object builds ajax urlParams from it. If any parameter is an object, is is stringified as JSON
	function buildParams(o, separator) {
		var sep = typeof separator == "undefined" ? "&" : separator;
		var r = [];
		for (var key in o) {
			var item = o[key];
			if (item != null && typeof item == "object") {
				item = buildParams(item, ",");
			} else {
				item = encodeURIComponent(item);
			}
			r.push(key + "=" + item);
		}
		return r.join(sep);
	}

	return {

		setServerPath: function (serverPath) {
			_serverPath = serverPath || "";
		},
		serverSpeechToText: function (data) {
			return jQuery.post(_serverPath + "/speech/v3/speechToText?" + buildParams(data));
		},
		serverSpeechToTextCustom: function (data) {
			return jQuery.post(_serverPath + "/speech/v3/speechToTextCustom?" + buildParams(data));
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

		}
	}

}());