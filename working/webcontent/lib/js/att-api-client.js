var AttApiClient = (function () {

	var _serverPath = "";
	var _serverUrl = "/speech/v3/";
	var _onFail = "";
	
	function buildParams(o, separator) {
		var sep = typeof separator == "undefined" ? "&" : separator;
		var r = [];
		for (var key in o) {
			var item = o[key];
			if (item != null && typeof item == "object") {
				item = buildParams(item, ",");
			}
			item = encodeURIComponent(item);
			r.push(key + "=" + item);
		}
		return r.join(sep);
	}

	function hasRequiredParams(data, params, fail) {
		var errList = [];
		var lcKey = {};
		for (key in data) {
			lcKey[key.toLowerCase()] = key;
		}
		params.forEach(function (n) {
			if (typeof lcKey[n] == "undefined") {
				errList.push("Expected Parameter: " + n);
			}
		});
		if (errList.length > 0) {
			fail(errList);
			return false;
		}
		return true;
	}

	function post(fn, data, requiredParams, success, fail) {
		if (hasRequiredParams(data, requiredParams, fail)) {
			alert(_serverPath + _serverUrl + fn + "?" + buildParams(data));
			jQuery.post(_serverPath + _serverUrl + fn + "?" + buildParams(data)).success(success).fail(typeof fail == "undefined" ? _onFail : fail);
		}
	}

	return {

		setOnFail: function(fail) {
			_onFail = fail;
		},
		setServerPath: function (serverPath) {
			_serverPath = serverPath || "";
		},
		serverSpeechToText: function (data, success, fail) {
			post("speechToText", data, [], success, fail);
		},
		serverSpeechToTextCustom: function (data, success, fail) {
			post("speechToTextCustom", data, [], success, fail);
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