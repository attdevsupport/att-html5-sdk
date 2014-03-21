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

    function get(urlFragment, success, fail) {
        jQuery.get(_serverPath + _serverUrl + urlFragment).done(success).fail(typeof fail == "undefined" ? _onFail : fail);
    }

    function getWithParams(urlFragment, data, requiredParams, success, fail) {
        if (hasRequiredParams(data, requiredParams, fail)) {
            get(urlFragment + "?" + buildParams(data), success, fail);
        }
    }

    function post(urlFragment, success, fail) {
        jQuery.post(_serverPath + _serverUrl + urlFragment).done(success).fail(typeof fail == "undefined" ? _onFail : fail);
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
    function postWithParams(urlFragment, data, requiredParams, success, fail) {
        if (hasRequiredParams(data, requiredParams, fail)) {
            post(urlFragment + "?" + buildParams(data), success, fail);
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

        jQuery.ajax(params).done(success).fail(typeof fail == "undefined" ? _onFail : fail);
    }

    function postFormWithParams(urlFragment, params, requiredParams, formData, success, fail) {
        if (hasRequiredParams(params, requiredParams, fail)) {
            postForm(urlFragment + "?" + buildParams(params), formData, success, fail);
        }
    }

    // can't just call it 'delete', its a reserved JavaScript keyword
    function httpDelete(urlFragment, success, fail) {
        var params = {
            type: "DELETE",
            url: _serverPath + _serverUrl + urlFragment
        };
        jQuery.ajax(params).done(success).fail(typeof fail == "undefined" ? _onFail : fail);
    }
    
    function httpDeleteWithParams(urlFragment, params, requiredParams, success, fail) {
        if (hasRequiredParams(params, requiredParams, fail)) {
            httpDelete(urlFragment + "?" + buildParams(params), success, fail);
        }
    }

    function put(urlFragment, success, fail) {
        var params = {
            type: "PUT",
            url: _serverPath + _serverUrl + urlFragment
        };
        jQuery.ajax(params).done(success).fail(typeof fail == "undefined" ? _onFail : fail);
    }
    
    function putWithParams(urlFragment, params, requiredParams, success, fail) {
        if (hasRequiredParams(params, requiredParams, fail)) {
            put(urlFragment + "?" + buildParams(params), success, fail);
        }
    }

    function downloadBinaryBlob(verb, urlFragment, success, fail) {
        // currently, jQuery doesn't support binary results, so using ajax directly
        xhr = new XMLHttpRequest();
        xhr.open(verb, _serverPath + _serverUrl + urlFragment);
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

    function htmlEncode(x) {
        return String(x)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '</br>');

    }

    function fixNullorEmpty(x, valueIfEmpty)  {
        return (typeof x == "undefined" || x == null || x == '') ? (valueIfEmpty == "undefined" ? '' : valueIfEmpty) : x;
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
            postWithParams("/sms/v3/messaging/outbox", data, ['addresses', 'message'], success, fail);
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
            postWithParams("/speech/v3/speechToText", data, ['filename'], success, fail);
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
            postWithParams("/speech/v3/speechToTextCustom", data, ['filename'], success, fail);
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
            downloadBinaryBlob("POST", "/speech/v3/textToSpeech?text=" + encodeURIComponent(text), success, fail);
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

        /**
         * Create an index cache for the user's message inbox. Some inbox operations require
         * an existing index cache.
         *
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        createMessageIndex: function(success, fail) {
            post("/myMessages/v2/messages/index", success, fail);
        },

        /**
         * Get the current information about the user's inbox cache. This includes
         * whether the cache is initialized (if not, call createMessageIndex), and
         * what the current state is (if you want to see if anything changed before
         * calling getMessageDelta).
         *
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        getMessageIndexInfo: function(success, fail) {
            get("/myMessages/v2/messages/index/info", success, fail);
        },
        
        /**
         * Given a specified previous state, this method returns all the inbox
         * changes that occurred since that point, as well as returning a new
         * state marker for the current inbox.
         *
         * @param {String} state represents a specific prior inbox state
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        getMessageDelta: function(state, success, fail) {
            get("/myMessages/v2/delta?state=" + encodeURIComponent(state), success, fail);
        },
        
        /**
         * Updates attributes (isUnread, isFavorite) on an existing message.
         *
         * @param {Object} data request parameters
         *   @param {String} data.id the ID of the message to be updated
         *   @param {Boolean} data.isUnread (optional) the new unread value for the message
         *   @param {Boolean} data.isFavorite (optional) the new favorite value for the message
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        updateMessage: function(data, success, fail) {
            if (hasRequiredParams(data, ["id"], fail)) {

                var attributes = {};
                ['isUnread', 'isFavorite'].forEach(function(name) {
                    if (data.hasOwnProperty(name)) { attributes[name] = data[name]; }
                });
                
                jQuery.ajax({
                    url: _serverPath + _serverUrl + "/myMessages/v2/messages/" + encodeURIComponent(data.id),
                    type: "PUT",
                    processData: false,
                    data: JSON.stringify(attributes)
                }).done(success).fail(typeof fail == "undefined" ? _onFail : fail);
            }
        },
              
        /**
         * Updates attributes (isUnread, isFavorite) for multiple messages.
         *
         * @param {Array} messages a list of messages and the associated 
         *        attributes to be updated. The objects in the array have 
         *        a required 'id' property, and optional 'isUnread' and 
         *        'isFavorite' properties.
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        updateMessages: function(messages, success, fail) {
            msgJson = { messages: messages }
            jQuery.ajax({
                url: _serverPath + _serverUrl + "/myMessages/v2/messages",
                type: "PUT",
                processData: false,
                data: JSON.stringify(msgJson)
            }).done(success).fail(typeof fail == "undefined" ? _onFail : fail);
        },
        
        /**
         * Get a list of messages from the user's inbox
         *
         * @param {Object} data (optional) query parameters. The object may contain the following properties:
         *   @param {Number} [data.count=5] (optional) the maximum number of messages to retrieve
         *   @param {Number} [data.offset=0] (optional) the index of the first message retrieved
         *   @param {String} data.messageIds (optional) a comma-seperated list of message ids listing the messages that should be returned
         *   @param {Boolean} data.isUnread (optional) filter the results to only show unread messages
         *   @param {Boolean} data.isFavorite (optional) filter the results to only show favorite messages
         *   @param {String} data.type (optional) filter the list by this comma-separated list of types (SMS, MMS)
         *   @param {String} data.keyword (optional) filter the list using this phone number; match sender for incoming messages and matches recipient for outgoing messages.
         *   @param {Boolean} data.isIncoming (optional) filter the list for incoming- or outgoing-only messages
         * @param {Function} success Success callback function
         *   @param {Object} success.messageList a JSON object enumerating the requested messages
         * @param {Function} fail (optional) Failure callback function
         */
        getMessageList: function(data, success, fail) {
            // optionally accept two parameters 'success' and 'fail', omitting 'data'
            if (data instanceof Function) {
                fail = success;
                success = data;
                data = {};
            }
            data = data || {};
            data.count = data['count'] || 5;
            getWithParams("/myMessages/v2/messages", data, ["count"], success, fail);
        },

        /**
         * Get a single message from the user's inbox
         *
         * @param {String} id The id of the message to be retrieved
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        getMessage: function(id, success, fail) {
            get("/myMessages/v2/messages/" + encodeURIComponent(id), success, fail);
        },
        
        /**
         * Get a message attachment. Typically you will use getMessageList to
         * determine which messages have attachments, and how many there are.
         *
         * @param {Object} data request data
         *   @param {String} data.messageId which message's attachment to fetch
         *   @param {Number} data.partNum which attachment to fetch
         * @param {Function} success Success callback function
         *   @param {Blob} success.binaryData attachment data
         * @param {Function} fail (optional) Failure callback function
         */
        getMessageContent: function(data, success, fail) {
            if (hasRequiredParams(data, ["messageId", "partNum"], fail)) {
                downloadBinaryBlob("GET", "/myMessages/v2/messages/" + encodeURIComponent(data.messageId) + "/parts/" + encodeURIComponent(data.partNum), success, fail);
            }
        },
        
        /**
         * Delete a single message from the user's inbox
         *
         * @param {String} id The id of the message to be deleted
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        deleteMessage: function(id, success, fail) {
            httpDelete("/myMessages/v2/messages/" + encodeURIComponent(id), success, fail);
        },
        
        /**
         * Delete multiple messages from the user's inbox
         *
         * @param {String} ids A comma-separated list of message ids for the messages to be
         *  deleted. An array of message id strings is also allowed.
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        deleteMessages: function(ids, success, fail) {
            if (ids instanceof Array) {
                ids = ids.join(",");
            }
            httpDeleteWithParams("/myMessages/v2/messages", {messageIds: encodeURIComponent(ids)}, ["messageIds"], success, fail);
        },

        /**
         * Send an SMS or MMS message as the currently-authorized user
         *
         * @param {Object} data message parameters. The object may contain the following properties:
         *   @param {String} data.addresses the message recipients
         *   @param {String} data.message the text message being sent. this parameter is optional if the message has attachments.
         *   @param {String} data.subject (optional)
         *   @param {Boolean} data.group (optional) when true, allows recipients to see each other and to reply-all
         *   @param {FormData} data.attachments (optional) 
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        sendMessage: function(data, success, fail) {
            var querystringParameters = {};
            if (data['addresses'] instanceof Array) {
                data.addresses = data.addresses.join(",");
            }
            querystringParameters.addresses = data.addresses;
            if (data.hasOwnProperty('message')) {
                querystringParameters.message = data.message;
            }
            if (data.hasOwnProperty('subject')) {
                querystringParameters.subject = data.subject;
            }
            if (data.hasOwnProperty('group')) {
                querystringParameters.group = data.group ? "true" : "false";
            }
            if (data.hasOwnProperty('attachments')) {
                postFormWithParams("/myMessages/v2/messages", querystringParameters, ["addresses"], data.attachments, success, fail);
            }
            else {
                postWithParams("/myMessages/v2/messages", querystringParameters, ["addresses"], success, fail);
            }
        },

        /**
         * Get a link to an ad that matches the requested filters.
         *
         * Refer to the API documentation at http://developer.att.com for more
         * information about the specific data that is returned.
         *
         * @param {Object} data ad filters. The object may contain the properties 
         *  shown below. It may also contain additional detailed filter properties 
         *  as described in the online documentation.
         *   @param {String} data.category The type of ad; for example, 'auto' or 
         *      'medical'. The complete list of valid values can be found in the 
         *      online documentation.
         *   @param {String} data.useragent (optional) The User-Agent string of the 
         *      browser or app requesting the ad. This may be used to further filter 
         *      the available ads (for example, to size them to the requesting 
         *      device).
         *   @param {String} data.udid (optional) a unique identifier of the current 
         *      user. Must be at least 30 characters long. Should be anonymous - not 
         *      contain any personal information about the user.
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        getAd: function(data, success, fail) {
            getWithParams("/rest/1/ads", data, ['Category'], success, fail);
        },

        /**
         * converts a JSON payment request into an encrypted, signed, blob of data
         * which can be passed to the AT&T payment URLs.
         *
         * Refer to the API documentation at http://developer.att.com for more
         * information about the JSON request format required.
         *
         * @param {Object} payload the JSON payment request
         * @param {Function} success Success callback function
         *   @param {Object} success.response a JSON object containing the encrypted 
         *      payment request (under the 'SignedDocument' key) and its signature 
         *      (under the 'Signature' key).
         * @param {Function} fail (optional) Failure callback function
         */
        signPayload: function(payload, success, fail) {
            var params = {
                type: "POST",
                url: _serverPath + _serverUrl + '/Security/Notary/Rest/1/SignedPayload',
                data: payload instanceof Object ? JSON.stringify(payload) : payload,
                processData: false
            };

            jQuery.ajax(params).done(success).fail(typeof fail == "undefined" ? _onFail : fail);
        },
        
        /**
         * Create a new pending subscription and return an authorization URL that
         * will allow the user to consent and finalize it. Navigating to the URL 
         * will present pages to the user allowing them to authorize the purchase, 
         * after which they will be redirected to URL specified by the 
         * 'redirect_uri' parameter.
         *
         * Refer to the API documentation at http://developer.att.com for details on 
         * the required and optional payment properties, and their allowed values.
         *
         * @param {Object} data contains payment info, as described below:
         *   @param {String} data.amount how much each delivery of the subscription
         *      costs, rounds to 2 decimal places ("1.23", for example).
         *   @param {Number} category see online docs for valid values (for example, 
         *      use 1 for in-app purchases in a game.)    
         *   @param {String} desc short description of purchase, must be less than 
         *      128 characters.
         *   @param {String} merch_trans_id the transaction id in merchant's system, 
         *      must be unique for every purchase.
         *   @param {String} merch_prod_id specifies the product id of the item 
         *      purchased, must be less than 50 characters.
         *   @param {String} merch_sub_id_list the subscription id in the merchant's
         *      system.
         *   @param {Number} sub_recurrences the number of times the subscription
         *      will be delivered and billed.
         *   @param {String} redirect_uri the location to redirect to after the user 
         *      has authorized the new transaction.
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        createSubscriptionUrl: function(data, success, fail) {
            if (hasRequiredParams(data, ["amount", "category", "desc", "merch_trans_id", "merch_prod_id", "merch_sub_id_list", "sub_recurrences", "redirect_uri"], fail)) {
                postForm("/rest/3/Commerce/Payment/Subscriptions", JSON.stringify(data), success, fail);
            }
        },
        
        /**
         * Create a new pending transaction and return an authorization URL that
         * will allow the user to consent and finalize it. Navigating to the URL 
         * will present pages to the user allowing them to authorize the purchase, 
         * after which they will be redirected to URL specified by the 
         * 'redirect_uri' parameter.
         *
         * Refer to the API documentation at http://developer.att.com for details on 
         * the required and optional payment properties, and their allowed values.
         *
         * @param {Object} data contains payment info, as described below:
         *   @param {String} data.amount how much the item costs, rounds to 2 decimal 
         *      places ("1.23", for example).
         *   @param {Number} category see online docs for valid values (for example, 
         *      use 1 for in-app purchases in a game.)    
         *   @param {String} desc short description of purchase, must be less than 
         *      128 characters.
         *   @param {String} merch_trans_id the transaction id in merchant's system, 
         *      must be unique for every purchase.
         *   @param {String} merch_prod_id specifies the product id of the item 
         *      purchased, must be less than 50 characters.
         *   @param {String} redirect_uri the location to redirect to after the user 
         *      has authorized the new transaction.
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        createTransactionUrl: function(data, success, fail) {
            if (hasRequiredParams(data, ["amount", "category", "desc", "merch_trans_id", "merch_prod_id", "redirect_uri"], fail)) {
                postForm("/rest/3/Commerce/Payment/Transactions", JSON.stringify(data), success, fail);
            }
        },
        
        /**
         * Get the status of a payment; for example, if it succeeded or not.
         *
         * @param {Object} data contains payment identifiers, as described below:
         *   @param {String} data.type identifies the source of the id being used;
         *      valid values include "TransactionAuthCode", "TransactionId", and 
         *      "MerchantTransactionId".
         *   @param {String} id the unique identifier of the desired payment.
         * @param {Function} success Success callback function
         * @param {Function} fail (optional) Failure callback function
         */
        getTransactionStatus: function(data, success, fail) {
            if (hasRequiredParams(data, ["type", "id"], fail)) {
                var url = 
                    "/rest/3/Commerce/Payment/Transactions/" + 
                    encodeURIComponent(data.type) + 
                    "/" + 
                    encodeURIComponent(data.id);
                get(url, success, fail);
            }
        },

        getSubscriptionStatus: function(data, success, fail) {
            if (hasRequiredParams(data, ["type", "id"], fail)) {
                var url = 
                    "/rest/3/Commerce/Payment/Subscriptions/" + 
                    encodeURIComponent(data.type) + 
                    "/" + 
                    encodeURIComponent(data.id);
                get(url, success, fail);
            }
        },
        
        getSubscriptionDetail: function(data, success, fail) {
            if (hasRequiredParams(data, ["consumerId", "merchantSubscriptionId"], fail)) {
                var url = 
                    "/rest/3/Commerce/Payment/Subscriptions/" + 
                    encodeURIComponent(data.merchantSubscriptionId) +
                    "/Detail/" + 
                    encodeURIComponent(data.consumerId);
                get(url, success, fail);
            }
        },
        
        refundTransaction: function(data, success, fail) {
            data.state = 'Refunded';
            putWithParams("/rest/3/Commerce/Payment/Transactions", data, ["transactionId", "reasonId", "reasonText"], success, fail);
        },
        
        cancelSubscription: function(data, success, fail) {
            data.state = 'SubscriptionCancelled';
            putWithParams("/rest/3/Commerce/Payment/Transactions", data, ["transactionId", "reasonId", "reasonText"], success, fail);
        },
        
        util: {
            /**
             *  Given a binary text blob, returns a text node by callback function.
             *
             *  @param {Blob} blob Object to be converted
             *  @param {Function} callback Callback function
             */
            blobToText: function (blob, callback) {
                var reader = new FileReader();
                reader.readAsText(blob);
                reader.onload = function () {
                    callback(htmlEncode(reader.result));
                };
            },

            /**
             * 
             *
             *
             */
            padIfNotNullOrEmpty: function (before, x, after, valueIfNull) {
                return typeof x == 'undefined' || x == null || x == '' ? fixNullorEmpty(valueIfNull) : before + x + fixNullorEmpty(after);
            },
            htmlEncode: htmlEncode,
            /**
             *
             * Given a binary image blob, return an url by callback function
             *
             * @param {Function} success Callback success
             * @param {Function} fail Callback failure function
             */
            blobToImage: function(blob, success, fail) {
                
                var imageType = /image.*/;
                if (blob.type.match(imageType)) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        success(reader.result);
                    }
                    reader.readAsText(blob); 
                } else {
                    fail("Unsupported format");
                }
            },

            /**
             *
             * Given a phone number, returns true or false if the phone number is in a valid format.
             *
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
                return AttApiClient.util.isValidPhoneNumber(address) || AttApiClient.util.isValidEmail(address) || AttApiClient.util.isValidShortCode(address);
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
                if (AttApiClient.util.isValidPhoneNumber(address)) {
                    address = AttApiClient.util.normalizePhoneNumber(address);
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
