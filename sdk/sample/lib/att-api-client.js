/**
 * JavaScript code can call AT&T back-end services using the methods
 * on this class.
 * @class AttApiClient
 * @singleton
 */
var AttApiClient = (function () {

	var _serverPath = "";
	var _serverUrl = "/att";

	var _onFail = function (error) { 
        var message = "Generic fail handler triggered - no specific error handler specified";
        if (typeof error == "string") {
            message = message + " - error message: " + error;
        }
        alert(message);
    };

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

	/**
     * private function used to post data on the query string
     * @param data Data to be checked
     * @param reqParams Array of required parameter names
	 * @param success Function to call when post succeeds
     * @param fail Function to call when parameters have not been passed
     * @returns boolean
     * @ignore
     */

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

	function postFormWithParams(fn, params, requiredParams, formData, success, fail) {
		if (hasRequiredParams(params, requiredParams, fail)) {
			postForm(fn + "?" + buildParams(params), formData, success, fail);
		}
	}

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return undefined;
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

		/**
		 * Sends an SMS to a recipient
		 *
		 * @param {object} data An object which may contain the following properties:
		 *   @param {string} data.addresses Wireless number of the recipient(s). Can contain comma separated list for multiple recipients.
		 *   @param {string} data.message The text of the message to send
		 * @param {function} success Success callback function
		 * @param {function} failure Failure callback function
		 */
		sendSms: function(data, success, fail) {
			post("/sms/v3/messaging/outbox", data, ['addresses', 'message'], success, fail);
		},

		/**
		 * Checks the status of a sent SMS
		 *
		 * @param {object} data An object which may contain the following properties:
		 *   @param {string} data.id The unique SMS ID as retrieved from the response of the sendSms method
		 * @param {function} success Success callback function
		 * @param {function} failure Failure callback function
		 */
		smsStatus: function (data, success, fail) {
			if (hasRequiredParams(data, ["id"], fail)) {
				jQuery.get(_serverPath + _serverUrl + "/sms/v3/messaging/outbox/" + data["id"]).success(success).fail(typeof fail == "undefined" ? _onFail : fail);
			}
		},	

		/**
		 * Sends an MMS to a recipient
		 *
		 * @param {object} params An object which may contain the following properties:
		 *   @param {string} params.addresses Wireless number of the recipient(s). Can contain comma separated list for multiple recipients.
		 *   @param {string} params.message The text of the message to send
         *   @param {string} params.fileId (optional) The name of a file on the server that should be attached to the message
         * @param (FormData) formData attachments to be included with the MMS message - pass null if there are no attachments
		 * @param {function} success Success callback function
		 * @param {function} failure Failure callback function
		 */
		sendMms: function (params, formData, success, fail) {
			postFormWithParams("/mms/v3/messaging/outbox", params, ['addresses', 'message'], formData, success, fail);
		},
        
		/**
		 * Checks the status of a sent MMS
		 *
		 * @param {object} data An object which may contain the following properties:
		 *   @param {string} data.id The unique MMS ID as retrieved from the response of the sendMms method
		 * @param {function} success Success callback function
		 * @param {function} failure Failure callback function
		 */
		mmsStatus: function(data, success, fail) {
            if (hasRequiredParams(data, ["id"], fail)) {
                jQuery.get(_serverPath + _serverUrl + "/mms/v3/messaging/outbox/" + data["id"]).success(success).fail(typeof fail == "undefined" ? _onFail : fail);
            }
		},

		/**
		 * Gets a list of SMSs sent to the application's short code
		 *
		 * @param {object} data An object which may contain the following properties:
		 *   @param {number} data.shortcode ShortCode/RegistrationId to receive messages from.
		 * @param {Function} success Success callback function
		 * @param {Function} failure Failure callback function
		 */
		getSms: function(data, success, fail) {
            if (hasRequiredParams(data, ["shortcode"], fail)) {
                jQuery.get(_serverPath + _serverUrl + "/sms/v3/messaging/inbox/" + data["shortcode"]).success(success).fail(typeof fail == "undefined" ? _onFail : fail);
            }
		},

		/**
		 * Get detailed information about the AT&T device calling this method
         * Refer to the API documentation at http://developer.att.com for more
         * information about the specific data that is returned.
		 *
		 * @param {Function} success Success callback function
         *   @param {Object} success.info A JSON object containing detailed device information
		 * @param {Function} failure Failure callback function
		 */
        getDeviceInfo: function(success, fail) {
            jQuery.get(_serverPath + _serverUrl + "/Devices/Info").done(success).fail(typeof fail == "undefined" ? _onFail : fail);
        },
        
		/**
		 * Takes the specified audio file that is hosted on the server, and
         * converts it to text.
         *
         * Additional details for some allowed parameter values can be found
         * in the API documentation at http://developer.att.com
         *
		 * @param {object} data An object which may contain the following properties:
		 *   @param {string} data.filename The server-based file to convert
		 *   @param {boolean} data.chunked (optional) if any value is specified for this option, the file will be sent using HTTP chunking
		 *   @param {string} data.xargs (optional) Detailed conversion parameters
		 *   @param {string} data.context (optional) Type of speech, like 'Gaming' or 'QuestionAndAnswer'
		 *   @param {string} data.subcontext (optional) Detailed type of speech
		 * @param {function} success Success callback function
		 * @param {function} failure Failure callback function
		 */
		serverSpeechToText: function (data, success, fail) {
			post("/speech/v3/speechToText", data, ['filename'], success, fail);
		},
        
		/**
		 * Takes the specified audio data and converts it to text.
         *
         * The conversion will use custom dictionary and grammar
         * files hosted on the server.
         *
		 * @param {Blob} audioBlob speech audio to be converted
		 * @param {function} success Success callback function
		 * @param {function} failure Failure callback function
		 */
		serverSpeechToTextCustom: function (data, success, fail) {
			post("/speech/v3/speechToTextCustom", data, ['filename'], success, fail);
		},

		/**
		 * Takes the specified audio data and converts it to text.
         *
		 * @param {Blob} audioBlob speech audio to be converted
		 * @param {function} success Success callback function
		 * @param {function} failure Failure callback function
		 */
		speechToText: function (audioBlob, success, fail) {
			var fd = new FormData();
			fd.append("speechaudio", audioBlob);
			postForm('/speech/v3/speechToText', fd, success, fail);
		},

		/**
		 * Takes the specified text and converts it to speech audio.
         *
		 * @param {string} text the text to be converted
		 * @param {function} success Success callback function
		 * @param {function} failure Failure callback function
		 */
		textToSpeech: function (text, success, fail) {
			me = this;
			// currently, jQuery doesn't support binary results, so using ajax directly
			xhr = new XMLHttpRequest();
			xhr.open("POST", _serverPath + _serverUrl + "/speech/v3/textToSpeech?text=" + encodeURIComponent(text));
            xhr.responseType = "arraybuffer";
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
                    if (xhr.status < 300) {
                        var blob = new Blob([xhr.response], {type: xhr.getResponseHeader("Content-Type")});
                        success(blob);
                    }
                    else { // xhr.status >= 300, it failed
                        fail(String.fromCharCode.apply(null, new Uint8Array(xhr.response)));
                    }
				}
			}
			xhr.send();
		},
        
        /**
         * Checks the SDK server to see if the user has already authorized
         * the specified services for this app.
         *
         * @param {string} scope a comma-separated list of services
		 * @param {Function} success Success callback function
		 * @param {Function} fail (optional) Failure callback function
         */
        isUserAuthorized: function(scope, success, fail) {
            if (typeof fail == "undefined") {
                fail = _onFail;
            }
            jQuery.get(_serverPath + _serverUrl + "/check?scope=" + encodeURIComponent(scope))
                .done(function(response) { 
                    success(response.authorized);
                }).fail(fail);
        },

        /**
         * Get the URL that will initiate the consent flow of web pages
         * where the user can accept or reject the services that this
         * app wants to use on their behalf.
         *
         * @param {object} data consent flow configuration options. The
         *  object may contain the following properties:    
         *   @param {string} data.scope a comma-separated list of services
         *   @param {string} data.returnUrl the page the user should end
         *      up on after the consent flow is complete. Note that if
         *      there is an error during the consent flow, this page will
         *      include an 'error' querystring parameter describing the error.
		 * @param {Function} success Success callback function
         *   @param {string} success.url the requested consent flow URL
		 * @param {Function} fail (optional) Failure callback function
         */
        getUserAuthUrl: function(data, success, fail) {
            if (typeof fail == "undefined") {
                fail = _onFail;
            }
            if (hasRequiredParams(data, ["scope", "returnUrl"], fail)) {
                var requestUrl = _serverPath
                    + _serverUrl
                    + "/oauth/userAuthUrl?scope=" 
                    + encodeURIComponent(data["scope"]) 
                    + "&returnUrl=" 
                    + encodeURIComponent(data["returnUrl"]);
                jQuery.get(requestUrl)
                    .done(function(response) { success(response.url); })
                    .fail(fail);
            }
        },
        
        /**
         * Authorize this app to use the specified services on behalf of the user.
         * Get consent from the user if necessary. This method will navigate
         * away from the current web page if consent is necessary.
         *
         * @param {object} data consent flow configuration options. The
         *  object may contain the following properties:    
         *   @param {string} data.scope a comma-separated list of services
         *   @param {string} data.returnUrl (optional) the page the user
         *      should end up on after the consent flow is complete. If 
         *      this parameter isn't specified, the current page is used. 
         *      Note that if there is an error during the consent flow, 
         *      this page will include an 'error' querystring parameter 
         *      describing the error.
         *   @param {boolean} data.skipAuthCheck (optional) when set to true, 
         *      initiates the consent flow without first checking to see if 
         *      the requested services are already authorized.
		 * @param {Function} alreadyAuthorizedCallback called if the
         *      requested services are already authorized, and no page
         *      navigation is necessary.
		 * @param {Function} fail (optional) Failure callback function
         */
        authorizeUser: function(data, alreadyAuthorizedCallback, fail) {
            if (typeof fail == "undefined") {
                fail = _onFail;
            }
            if (hasRequiredParams(data, ["scope"], fail)) {
                if (!data["returnUrl"]) {
                    data.returnUrl = document.location.href;
                }
                var error = getQueryVariable("error");
                if (typeof error != "undefined") {
                    fail(error);
                    return;
                }
                var redirectToAuthServer = function() {
                    AttApiClient.getUserAuthUrl(
                        data, 
                        function(userAuthUrl) {
                            document.location.href = userAuthUrl;
                        },
                        fail
                    );
                };
                if (data["skipAuthCheck"]) {
                    redirectToAuthServer();
                }
                else {
                    AttApiClient.isUserAuthorized(
                        data.scope,
                        function(isAuthorized) {
                            if (!isAuthorized) {
                                redirectToAuthServer();
                            }
                            else {
                                // if we're already authenticated, just go to the requested page
                                if (document.location.href != data.returnUrl) {
                                    document.location.href = data.returnUrl;
                                }
                                else {
                                    alreadyAuthorizedCallback();
                                }
                            }
                        },
                        fail
                    );
                }
            }
        },

		util: {

			/**
			 *
			 * Given a phone number, returns true or false if the phone number is in a valid format.
			 * @param {String} phone the phone number to validate
			 * @return {Boolean}
			 * @static
			 */
			isValidPhoneNumber: function (phone) {
				return (/^(1?([ -]?\(?\d{3})\)?[ -]?)?(\d{3})([ -]?\d{4})$/).test(phone);
			},
			/**
			 * Given an email, returns true or false if the it is in a valid format.
			 * @param {String} email the email to validate
			 * @return {Boolean}
			 * @static
			 */
			isValidEmail: function (email) {
				return (/^[a-zA-Z]\w+(.\w+)*@\w+(.[0-9a-zA-Z]+)*.[a-zA-Z]{2,4}$/i).test(email);
			},
			/**
			 * Given a shortcode, returns true or false if the it is in a valid format.
			 * @param {String} shortcode the short code to validate
			 * @return {Boolean}
			 * @static
			 */
			isValidShortCode: function (shortcode) {
				return (/^\d{3,8}$/).test(shortcode);
			},

			/**
			 * Given an address will determine if it is a valid phone, email or shortcode.
			 * @param address {String} the address to validate
			 * @returns {Boolean}
			 * @static
			 */
			isValidAddress: function (address) {
				return Att.Provider.isValidPhoneNumber(address) || Att.Provider.isValidEmail(address) || Att.Provider.isValidShortCode(address);
			},

			/**
			 * Given a phone number, returns the phone number with all characters, other than numbers, stripped
			 * @param {String} phone the phone number to normalize
			 * @return {String} the normalized phone number
			 * @static
			 */
			normalizePhoneNumber: function (phone) {
				phone = phone.toString();
				return phone.replace(/[^\d]/g, "");
			},

			/**
			 * Given a valid address, if it is a phone number will return the normalized phone number. See {@link Att.Provider#normalizePhoneNumber} 
			 * Otherwise, returns the address as it is.
			 * @param address {String} the address to normalize.
			 * @returns {String} the normalize phone number or address.
			 * @static 
			 */
			normalizeAddress: function (address) {
				address = address.toString();
				if (Att.Provider.isValidPhoneNumber(address)) {
					address = Att.Provider.normalizePhoneNumber(address);
				}
				return address;
			},

			/**
			 * This helper routine will return a properly formatted URL to the SDK routine which will provide the source content (image, text, etc)
			 * for the specified message number and part. 
			 * @param {string} messageId The message id of the message
			 * @param {string} partNumber The part number to retrieve
			 * @return {string} The source URL which returns the content of the message part along with appropriate content headers.
			 * @static
			 */
			getContentSrc: function (messageId, partNumber) {
				return "/att/content?messageId=" + messageId + "&partNumber=" + partNumber;
			}
		}
	}
}());
