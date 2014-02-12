/**
 * JavaScript code can call AT&T back-end services using the methods
 * on this class.
 * @class AttApiClient
 * @singleton
 */
var AttApiClient = (function () {

	var _serverPath = "";
	var _serverUrl = "/att/speech/v3/";
	var _onFail = function () { };

	/**
     * Private function used to build url params
     * @ignore
     */
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

	/**
     * private function used to check if required parameters have been passed
     * @param data Data to be checked
     * @param reqParams Array of required parameter names
     * @param fail Function to call when parameters have not been passed
     * @returns boolean
     * @ignore
     */
	function hasRequiredParams(data, reqParams, fail) {
		var errList = [];
		var lcKey = {};
		for (key in data) {
			lcKey[key.toLowerCase()] = key;
		}
		reqParams.forEach(function (n) {
			if (typeof lcKey[n.toLowerCase()] == "undefined") {
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
			jQuery.post(_serverPath + _serverUrl + fn + "?" + buildParams(data)).success(success).fail(typeof fail == "undefined" ? _onFail : fail);
		}
	}

	function postForm(fn, data, success, fail, opts) {

		var params = $.extend({
			type: "POST",
			url: _serverPath + _serverUrl + fn,
			data: data,
			processData: false,
			contentType: false
		}, opts);

		jQuery.ajax(params).success(success).fail(typeof fail == "undefined" ? _onFail : fail);
	}

	function get(fn, data, success, fail, opts) {
		var params = $.extend({
			type: 'GET',
			url: _serverPath + _serverUrl + fn,
			data: data, processData: false,
			success: success
		}, opts);

		$.ajax().success(success).fail(typeof fail == "undefined" ? _onFail : fail);
	}

	return {

		/**
		 * Sets default onFail function. If any service call in this library fails,
         * the library will first check if a fail callback was provided for the 
         * specific call. If one was not specified, it will next check if this default
         * fail handler has been set, and call it if available.
		 * @param fail function to handle default fails for all ajax functions
		 */
		setOnFail: function (fail) {
			_onFail = fail;
		},
		/**
		 * Sets server path. By default service requests get sent to
         * endpoints on the same host serving the web app. Use this
         * method to override this behavior and send service requests
         * to a different host.
		 * @param serverpath path to ajax server
		 */
		setServerPath: function (serverPath) {
			_serverPath = serverPath || "";
		},
		serverSpeechToText: function (data, success, fail) {
			post("speechToText", data, ['filename'], success, fail);
		},
		/**
		 * Converts audio blob captured in browser to speech
		 * @param data data object, must at least contain filename
		 * @param success function receive json result object
		 * @param fail function to handle json error result object
		 */
		serverSpeechToTextCustom: function (data, success, fail) {
			post("speechToTextCustom", data, ['filename'], success, fail);
		},

		/**
		 * Converts audio blob captured in browser to speech
		 * @param audioBlob binary audio object
		 * @param success function receive json result object
		 * @param fail optional function to handle json error result object
		 */
		speechToText: function (audioBlob, success, fail) {
			var fd = new FormData();
			fd.append("speechaudio", audioBlob);
			postForm('speechToText', fd, success, fail);
		},

		/**
		 * converts text to speech
		 * @param text string of text to convert
		 * @param success function to receive buffered binary audio source
		 * @param fail optional function to handle error
		 */

		textToSpeech: function (text, success, fail) {
			me = this;
			// currently, jQuery doesn't support binary results, so using ajax directly
			xhr = new XMLHttpRequest();
			xhr.open("POST", _serverPath + _serverUrl + "textToSpeech?text=" + encodeURIComponent(text));
			xhr.responseType = "arraybuffer";
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					var context = new webkitAudioContext();
					context.decodeAudioData(xhr.response, function (buffer) {
						success(buffer);
					}, fail);
				}
			}
			xhr.send();
		}
	}

}());
