/**
 * Att.Provider exposes methods to access the AT&T APIs.
 * When a method is called on the client side, a request is made to the server side.
 * The server will validate the request and then make the appropriate call
 * to the AT&T API.
 *


Init
----

    this.provider = Ext.create('Att.Provider');

Or, if you need to change what the apiBasePath is:

    this.provider = Ext.create('Att.Provider',{
        apiBasePath : '/your/base/path'
    });

Authentication
---
The SDK Authorization Method supports three approaches: On-Network Authentication, wireless number/PIN Authentication, and Username/Password Consent.
This method is required and supported only for applications attempting to consume and access the Terminal Location API (TL), My Messages (MIM (**Beta**) ), and Message On Behalf Of (MOBO (**Beta**) ).
To use SMS, MMS and WAP PUSH APIs, user can authorize and send messages through the Client Credential method, which is the automatic OAuth model.


Automatic (OAuth Model - Client Credential)
----

When calling SMS, MMS or WAP Push, the SDK server will request an authorization token from AT&T using your application credentials, and will make the API call automatically.  
The user of the application will not need to explicitly authorize the action and you can send messages to any valid AT&T wireless number.


Login  (OAuth Model - Authorization Code)
----
For the Device Location, My Messages, and Message On Behalf Of API calls you will need explicit permission from the user to access information about their device.
The SDK provides api calls to check if the user is currently authorized. If they are not, the API will create an iframe and redirect the user to the OAUTH login sequence.
After that, the user will have a valid access token associated with their session.


    // isAuthorize checks to see if the user has a valid auth token stored on the SDK server
    // If the user has a valid token we don't need to ask the user to re-authorize.

    this.provider.isAuthorized("TL", {

      success: function() {
           // On successful authorization, proceed to the next step in the application.
       },

       failure: function() {
           // We don't have a valid token on the SDK server.
           // Ask the user to login and authorize this application to process payments.
           // This will pop up an AT&T login followed by an authorization screen.
           KitchenSink.provider.authorizeApp(self.authScope, {

               success: function() {
                   //On successful authorization, proceed to the next step in the application.
               },

               failure: function() {
                   console.log("failure arguments", arguments);
               }

           });
       }
     });


Payment
---

The Payment API uses a combination of Client Credential authorization and a user prompt similar to oauth.
When initiating a payment request, the SDK server uses the Client Credential authorization token to retrieve a one-time-use url, which is automatically presented to the user in an iframe in the same way the authorizeApp provider call does for oauth logins.
After the user has completed the payment process, and the application has the transaction id of the purchase, it can then use the Client Credential authorization token to get the status of a payment.

Making API Calls
---

Call the provider API method with the required parameters.
On success you will receive a JSON encoded response from the server.
This data is identical to the data returned by the APIs from AT&T.

    this.provider.sendSms({
       address : 'SOMEPHONENUMBER',
       message : 'your sms message', {
       success : function(response) {
           self.setLoading(false);
           KitchenSink.showResults(response, "SMS Sent");
           self.smsId = response.Id;
           Ext.getCmp('sms-status-button').enable();
       },
       failure : function(error) {
           console.log("failure", error);
           self.setLoading(false);
           Ext.Msg.alert('Error', error);
       }
    });


Error Handling
----

In case an exception or an error happens, detailed information on the exception/error is available in the error property of the response

 *
 */
Ext.define('Att.Provider', {
    requires: [
        'Ext.JSON',
        'Ext.Ajax',
        'Ext.direct.Manager',
        'Att.AuthorizationSheet',
        'Ext.direct.RemotingProvider',
        'Ext.direct.RemotingEvent'
    ],

    config: {
        /**
         * @cfg {String} authScope
         * This is the default authorization scope used to authorize transactions that require scope and it is not provided.
         */
        authScope: 'TL,IMMN,MIM,DC',
        /**
        *
        * @cfg {String} apiBasePath
        * The base uri path to be prepended to all API calls (defaults to "att").

        This helps solve the issue of the "same origin policy". If you have
        the server component configured to run on a port different than the web application
        since your web application will typically run on port 80, you may have the
        server component configured to run on port 4567 or 8080.

        For example, if you have decided to implement the Ruby server component and are
        letting the ruby app listen on port 4567, you could define your reverse proxy
        like so:

              ProxyPass /att/rubyapi/ http://localhost:4567/
              ProxyPassReverse /att/rubyapi/ http://localhost:4567/

        Then, when you initialize an instance of the Att.Provider you would do the following:

              this.provider = new Att.Provider({
                 apiBasePath : '/att/rubyapi'
             });

        Thus, all calls from the web client that calls Att.Provider apis will originate from
        the same hostname:port and will be sent to /att/rubyapi/the/api/uri, but the
        reverse proxy will reroute these calls on the server to http://localhost:4567/the/api/uri.

        For example:

        Browser sends:

           http://yourserver.com/att/callback

        Server reroutes to:

           http://localhost:4567/att/callback
        *
        */
        apiBasePath:        "att"

    },

    statics: {
        /**
         *
         * Given a phone number, returns true or false if the phone number is in a valid format.
         * @param {String} phone the phone number to validate
         * @return {Boolean}
         * @static
         */
        isValidPhoneNumber: function(phone) {
            return (/^(1?([ -]?\(?\d{3})\)?[ -]?)?(\d{3})([ -]?\d{4})$/).test(phone);
        },
        /**
         * Given an email, returns true or false if the it is in a valid format.
         * @param {String} email the email to validate
         * @return {Boolean}
         * @static
         */
        isValidEmail : function( email ) {
            return (/^[a-zA-Z]\w+(.\w+)*@\w+(.[0-9a-zA-Z]+)*.[a-zA-Z]{2,4}$/i).test(email);
        },
        /**
         * Given a shortcode, returns true or false if the it is in a valid format.
         * @param {String} shortcode the short code to validate
         * @return {Boolean}
         * @static
         */
        isValidShortCode : function( shortcode ) {
            return (/^\d{3,8}$/).test(shortcode);
        },

        /**
         * Given an address will determine if it is a valid phone, email or shortcode.
         * @param address {String} the address to validate
         * @returns {Boolean}
         * @static
         */
        isValidAddress :  function ( address ){
            return Att.Provider.isValidPhoneNumber( address ) || Att.Provider.isValidEmail( address ) || Att.Provider.isValidShortCode( address );
        },

        /**
         * Given a phone number, returns the phone number with all characters, other than numbers, stripped
         * @param {String} phone the phone number to normalize
         * @return {String} the normalized phone number
         * @static
         */
        normalizePhoneNumber: function(phone) {
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
        normalizeAddress :  function( address ) {
            address = address.toString();
            if(Att.Provider.isValidPhoneNumber( address )){
                address = Att.Provider.normalizePhoneNumber( address );
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
        getContentSrc: function(messageId, partNumber) {
            return "/att/content?messageId=" + messageId + "&partNumber=" + partNumber;
        }

    },

    constructor: function(config) {
        this.initConfig(config);

        Ext.direct.Manager.addProvider({
            type: "remoting",                              // create a Ext.direct.RemotingProvider
            enableBuffer: false,                           // avoid multiple commands to be sent in one request
            url: this.getApiBasePath() + "/direct_router", // url to connect to the Ext.Direct server-side router.
            actions: {                                     // each property within the actions object represents a Class
                ServiceProvider: [                         // array of methods within each server side Class
                    {
                        name: "oauthUrl",
                        len: 1
                    },
                    {
                        name: "deviceInfo",
                        len: 0
                    },
                    {
                        name: "deviceLocation",
                        len: 3
                    },
                    {
                        name: "sendSms",
                        len: 2
                    },
                    {
                        name: "smsStatus",
                        len: 1
                    },
                    {
                        name: "receiveSms",
                        len: 1
                    },
                    {
                        name: "sendMms",
                        len: 4
                    },
                    {
                        name: "mmsStatus",
                        len: 1
                    },
                    {
                        name: 'wapPush',
                        len: 2
                    },
                    {
                        name: 'requestChargeAuth',
                        len: 2
                    },
                    {
                        name: "transactionStatus",
                        len: 2
                    },
                    {
                        name: "subscriptionStatus",
                        len: 2
                    },
                    {
                        name: "refundTransaction",
                        len: 2
                    },
                    {
                        name: "commitTransaction",
                        len: 2
                    },
                    {
                        name: "subscriptionDetails",
                        len: 2
                    },
                    {
                        name: "signPayload",
                        len: 1
                    },
                    {
                        name: "sendMobo",
                        len: 5
                    },
                    {
                        name: "getMessageHeaders",
                        len: 2
                    },
                    {
                        name: "speechToText",
                        len: 5
                    },
                    {
                        name: "cmsCreateSession",
                        len: 1
                    },
                    {
                        name: "cmsSendSignal",
                        len: 2
                    },
                    {
                        name: 'getAd',
                        len: 2
                    }
                ]
            },
            "namespace":"Att"
        });
    },

    /**
     * Checks to see if the app is authorized against the given authScopes.
     *
     * @param {Object} options An object which may contain the following properties.
     * @param {String} options.authScope Comma separated list of authScopes the app requires access to.
     * @param {Function} options.success success callback function
     * @param {Function} options.failure failure callback function
     */
    isAuthorized: function(options) {
        Ext.Ajax.request({
            url: this.getApiBasePath() + '/check?scope=' + (options.authScope || this.getAuthScope()),
            method: 'GET',
            success: function(response) {
                var jsonResponse = Ext.JSON.decode(response.responseText);
                if (jsonResponse.authorized) {
                    if (options.success) {
                        options.success.call(options.scope || this);
                    }
                } else {
                    if (options.failure) {
                        options.failure.call(options.scope || this);
                    }
                }
            },
            failure: function() {
                if (options.failure) {
                    options.failure.call(options.scope || this);
                }
            }
        });
    },

    /**
     * Initiate client authorization window for the user to authorize the application
     * against the given authScopes.
     *
     * @param {Object} options An object which may contain the following properties:
     *   @param {String} options.authScope Comma separated list of authScopes the app requires access to.
     *   @param {Function} options.success success callback function
     *   @param {Function} options.failure failure callback function
     */
    authorizeApp: function(options) {
        var me = this,
            successCallback = options.success,
            failureCallback = options.failure,
            scope = options.scope,
            sheet;

        sheet = Ext.create('Att.AuthorizationSheet', {
            listeners: {
                message: function(message) {
                    sheet.hide();
                    var data = Ext.JSON.decode(message),
                        success = data.success;

                    if (success && successCallback) {
                        successCallback.call(scope || me, data);
                    } else if (!success && failureCallback) {
                        failureCallback.call(scope || me, data);
                    }
                }
            }
        });

        Ext.Viewport.add(sheet);
        sheet.show();

        me.getAuthorizationUrl({
            authScope: options.authScope,
            success: function(url) {
                sheet.setSrc(url);
            }
        });
    },

    /**
     * Requests a subscription based on the payment options passed. This method will present a popup to the user where they
     * will be given the opportunity to authorize or decline the transaction with AT&T. 
     *
     *  Success callback example (when payments work)

        function(results) { console.log("payment worked!", results);}

     *  Failure callback examples (when the user cancels or the payment doesn't complete)

        function(results) { console.log("payment worked!", results.error, results.error_reason, results.error_description);}

     *  in the case of user cancel you will get something like this:

        error: "access_denied"
        error_description: "The user denied your request"
        error_reason: "user_denied"

     * @param {Object} options An object which may contain the following properties:
     *   @param {Object}  options.paymentOptions payment options

         var charge = {
            "Amount":0.99,
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"better than level 1",
            "MerchantTransactionId":"skuser2985trx20111029175423",
            "MerchantProductId":"level2"
        }

        provider.requestPaidSubscription({
            paymentOptions : charge,
            success : successCallback,
            failure : failureCallback
        });
     *
     *  See AT&T payment documentation for a complete set of payment options and restrictions
     *
     *   @param {Function} options.success success callback function
     *   @param {Function} options.failure failure callback function
     */
    requestPaidSubscription: function(options) {
        Ext.applyIf(options,{
            type : 'SUBSCRIPTION'
        });
        this.requestPayment(options);
    },

    /**
     * Requests a one-time payment based on the options passed.
     * This method call will present a pop-up to the user where they will be given the opportunity to either authorize or decline
     * the transaction.
     *

        var charge = { "Amount":0.99,
              "Category":1,
              "Channel":"MOBILE_WEB",
              "Description":"better than level 1",
              "MerchantTransactionId":"skuser2985trx20111029175423",
              "MerchantProductId":"level2"}


        provider.requestPayment({
            paymentOptions : charge,
            success : successCallback,
            failure : failureCallback
        });
     *
     *  See AT&T payment documentation for a complete set of payment options and restrictions
     *
     * @param {Object} options An object which may contain the following properties:
     *   @param {Object} options.paymentOptions payment options
     *   @param {Function} options.success success callback function
     *   @param {Function} options.failure failure callback function
     */
    requestPayment: function(options) {
        var me = this,
            successCallback = options.success,
            failureCallback = options.failure,
            scope = options.scope,
            sheet;

        Ext.applyIf(options, {
            type : 'SINGLEPAY'
        });

        Ext.apply(options, {
            success: function(results) {
                if (results.adviceOfChargeUrl) {
                    sheet.setSrc(results.adviceOfChargeUrl);
                }
            },

            failure: function(results) {
                sheet.hide();
                if (failureCallback) {
                    failureCallback.call(scope || me, results);
                }
            }
        });

        sheet = Ext.create('Att.AuthorizationSheet', {
            listeners: {
                message: function(message) {
                   sheet.hide();
                   var data = Ext.JSON.decode(message),
                       success = data.success;

                   if (success && successCallback) {
                       successCallback.call(scope || me, data);
                   } else if (!success && failureCallback) {
                       failureCallback.call(scope || me, data);
                   }
                }
            }
        });
        Ext.Viewport.add(sheet);
        sheet.show();

        me.doApiCall('requestChargeAuth', [
            options.type,
            options.paymentOptions
        ], options);
    },

    /**
     * Checks the status of a subscription.
     *
     * @param {object} options An object which may contain the following properties:
     * @param {string} options.codeType String for the type of transaction id being passed  can be "SubscriptionAuthCode" or "MerchantTransactionId" or "SubscriptionId"
     *   @param {string} options.transactionId Subscription authorization code to check can be the Subscription auth code, merchant transaction id or Subscription id.
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    getSubscriptionStatus: function(options) {
        this.doApiCall('subscriptionStatus', [
            options.codeType,
            options.transactionId
        ], options);
    },

    /**
     * Checks the details of subscription
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.merchantSubscriptionId authorization code of the subscription.
     *   @param {string} options.consumerId id of the user who created the subscription
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    getSubscriptionDetails: function(options) {
        this.doApiCall('subscriptionDetails', [
            options.merchantSubscriptionId,
            options.consumerId
        ], options);
    },

    /**
     * Checks the status of a transaction.
     *
     * @param {object} options An object which may contain the following properties:
     * @param {string} options.codeType String for the type of transaction id being passed  can be "TransactionAuthCode" or "MerchantTransactionId" or "TransactionId"
     *   @param {string} options.transactionId transaction authorization code to check can be the transaction auth code, merchant transasction id or transaction id.
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    getTransactionStatus: function(options) {
        this.doApiCall('transactionStatus', [
            options.codeType,
            options.transactionId
        ], options);
    },

    /**
     * Issues a request to refund a transaction
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.transactionId transaction id to revoke.
     *   @param {object} options.refundOptions refund options. See AT&T payment documentation for a complete set of refund options and restrictions.
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    refundTransaction: function(options) {
        // Set required value for TransactionOperationgStatus
        options.refundOptions.TransactionOperationStatus = 'Refunded';
        this.doApiCall('refundTransaction', [
             options.transactionId,
             options.refundOptions
         ], options);
    },

    /**
     * Issues a request to cancel a subscription
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.transactionId transaction id to revoke.
     *   @param {object} options.refundOptions refund options. See AT&T payment documentation for a complete set of refund options and restrictions.
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    cancelSubscription: function(options) {
        // Set required value for TransactionOperationgStatus
        options.refundOptions.TransactionOperationStatus = 'SubscriptionCancelled';
        this.doApiCall('refundTransaction', [
             options.transactionId,
             options.refundOptions
         ], options);
    },

    /**
     * Issues a commit to a previously authorized transaction
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.transactionId transaction id to revoke.
     *   @param {object} options.commitOptions commit options. See AT&T payment documentation for a complete set of commit options and restrictions.
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     * @hide
     * @deprecated  
     */
    commitTransaction: function(options) {
        // Set required value for TransactionOperationgStatus
        options.commitOptions.TransactionOperationStatus = 'Charged';
        this.doApiCall('commitTransaction', [
             options.transactionId,
             options.commitOptions
         ], options);
    },

    /**
     * Encrypts the payload param so that it can be used in other Payment API calls
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {object} options.payload The JSON payload that you want to sign.
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    signPayload: function(options) {
        this.doApiCall('signPayload', [
             options.payload
         ], options);
    },

    /**
     * Returns information on a device
     * @param {object} options An object which may contain the following properties:
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    getDeviceInfo: function(options) {
        this.doApiCall('deviceInfo', [], options);
    },

    /**
     * Given an authScope, returns the corresponding AT&T oAuth URL
     * @private
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.authScope a comma separated list of services that the app requires access to
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    getAuthorizationUrl: function(options) {
        this.doApiCall('oauthUrl', [options.authScope || this.getAuthScope()], options);
    },

    /**
     * Returns location info for a device
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {number} options.requestedAccuracy The requested accuracy is given in meters. This parameter shall be present in the resource URI as query parameter. If the requested accuracy cannot be supported, a service exception (SVC0001) with additional information describing the error is returned.  Default is 100 meters.
     *   @param {number} options.acceptableAccuracy The acceptable accuracy is given in meters and influences the type of location service that is used. This parameter shall be present in the resource URI as query parameter.
     *   @param {string} options.tolerance This parameter defines the application's priority of response time versus accuracy.
     *
     * Valid values are:
     *
     * - **NoDelay** No compromise on the priority of the response time over accuracy
     * - **LowDelay** The response time could have a minimum delay for a better accuracy
     * - **DelayTolerant** Response time could be compromised to have high delay for better accuracy
     *
     * Note :If this parameter is not passed in the request, the default value is DelayTolerant.
     *
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     *
     * Usage:
     *
        var provider = new Att.Provider();

        provider.getDeviceLocation({
            requestedAccuracy: 1000
        });
     *
     */
    getDeviceLocation: function(options) {
        // apply defaults
        Ext.applyIf(options, {
            requestedAccuracy : 100,
            acceptableAccuracy : 10000,
            tolerance : 'DelayTolerant'
        });

        this.doApiCall('deviceLocation', [
            options.requestedAccuracy,
            options.acceptableAccuracy,
            options.tolerance
        ], options);
    },

    /**
     * Sends an SMS to a recipient
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.address Wireless number of the recipient(s). Can contain comma separated list for multiple recipients.
     *   @param {string} options.message The text of the message to send
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    sendSms: function(options) {
        this.doApiCall('sendSms', [
            options.address,
            options.message
        ], options);
    },

    /**
     * Checks the status of a sent SMS
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.smsId The unique SMS ID as retrieved from the response of the sendSms method
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    getSmsStatus: function(options) {
        this.doApiCall('smsStatus', [
            options.smsId
        ], options);
    },

    /**
     * Retrieves a list of SMSs sent to the application's short code
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {number} options.registrationId ShortCode/RegistrationId to receive messages from.
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    receiveSms: function(options) {
        this.doApiCall('receiveSms', [
            options.registrationId
        ], options);
    },

    /**
     * Sends an MMS to a recipient
     *
     *  MMS allows for the delivery of different file types please see the [developer documentation](https://developer.att.com/docs) for an updated list.
     *
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.address Wireless number of the recipient(s). Can contain comma separated list for multiple recipients.
     *   @param {string} options.fileId The reference to a file to be sent in the MMS.  The server will map the fileId to a real file location.
     *   @param {string} options.message The text of the message to send.
     *   @param {string} options.priority The priority of the message.
     *
     * Valid values are:
     *
     * - **Low**
     * - **Normal**
     * - **High**
     *
     * Note :If this parameter is not passed in the request, the default value is Normal.
     *
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    sendMms: function(options) {
        Ext.applyIf(options, {
            priority : "Normal"
        });

        this.doApiCall('sendMms', [
            options.address,
            options.fileId,
            options.message,
            options.priority
        ], options);
    },

    /**
     * Checks the status of a sent MMS
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.mmsId The unique MMS ID as retrieved from the response of the sendMms method
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     */
    getMmsStatus: function(options) {
        this.doApiCall('mmsStatus', [
            options.mmsId
        ], options)  ;
    },

    /**
     * Sends a WAP Push message
     *
     * @param {object} options An object which may contain the following properties:
     *   @param {string} options.address Wireless number of the recipient(s). Can contain comma separated list for multiple recipients.
     *   @param {string} options.message The XML document containing the message to be sent.
     *   @param {function} options.success success callback function
     *   @param {function} options.failure failure callback function
     * @method wapPush
     */
    wapPush: function(options) {

        this.doApiCall('wapPush', [
            options.address,
            options.message
        ], options);
    },

    /**
     * @beta
     * Retrieves SMS and MMS message headers.
     *
     * @param {object} options An object containing the following parameters:
     *  @param {integer} options.headerCount The number of message headers to retrieve.
     *  @param {string} [options.indexCursor] Pointer to start of records to retrieve, obtained from previous call to this method. This value should always be empty when this method is first called.
     *  @param {function} options.success success callback function
     *  @param {function} options.failure failure callback function
     *
     */
     getMessageHeaders: function(options) {
        this.doApiCall('getMessageHeaders', [
            options.headerCount,
            options.indexCursor
        ], options);
     },

    /**
     * @beta
     * Sends a Message on behalf Of 
     * @param {object} options An object containing the following parameters:
     * @param {string} options.address Comma separated address list where message will be sent. Those address can be email, phone or short code.
     * @param {string} options.message The message to be sent.
     * @param {string} options.subject Message subject.
     * @param {boolean} options.group Flag to signify if message is being sent to a group.
     * @param {string|array} options.files Names of files to be included in this message.
     * @param {function} options.success success callback function
     * @param {function} options.failure failure callback function
     */
    sendMobo: function(options) {
        this.doApiCall('sendMobo', [
             options.address,
             options.message,
             options.subject,
             options.group,
             options.files
        ], options);
    },

    /**
     * Sends an audio file to retrieve the translation to text
     * 
     * @param options
     * @param {string} options.fileName fileName to be sent to translate
     * @param {string} options.fileContentType content-type of the file.
     * @param {string} options.chunked "true" to send the file as chunked
     * @param {string} options.context determines the speech context to be applied to the transcribed text
     * @param {string|array} options.xarg key/value pairs for x-arg parameter of speech.
     */
    speechToText: function(options){
        this.doApiCall('speechToText', [
            options.fileName,
            options.fileContentType,
            options.chunked,
            options.context,
            options.xarg
        ], options);
    },

    /**
     * Initiates a Tropo Session and delivers an object of key/value pairs to pass to the Tropo script
     * @param options
     * @param {string} options.parameters JSON string of key value pairs
     * @param {function} options.success Success callback function
     * @param {function} options.failure Failure callback function
     */
    cmsCreateSession: function(options) {
        this.doApiCall('cmsCreateSession', [
            options.parameters
        ], options);
    },

    /**
     * Sends a signal to an active CMS session script.
     * @param options
     * @param {string} options.sessionId The session ID to which to send a signal
     * @param {string} options.signal A signal to send to your active CMS script
     * @param {function} options.success Success callback function
     * @param {function} options.failure Failure callback function
     */
    cmsSendSignal : function(options) {
        this.doApiCall('cmsSendSignal', [
            options.sessionId,
            options.signal
        ], options);
    },

    /**
     * @hide
     * Retrieves an ad from AT&T ad server API
     * @param options
     * @param {string} options.udid A random 30 character id which must be changed every 30 days
     * @param {object} options.object A JSON object of key/value pairs which specify criteria for ad selection. Please refer to API documentation for more information.
     * @param {function} options.success Success callback function
     * @param {function} options.failure Failure callback function
     */
//    getAd: function(options) {
//        this.doApiCall('getAd', [
//            options.udid,
//            options.parameters
//        ], options);
//    },

    /**
     * @private
     * Makes an Api Call using the configured Ext.Direct router
     * @param method
     * @param args
     * @param options
     */
    doApiCall: function(method, args, options) {
        var me = this,
            successCallback = options.success,
            failureCallback = options.failure,
            scope = options.scope;

        if (!Att.ServiceProvider[method]) {
            console.warn('Calling a non existing API on Att.Provider');
        } else {
            Att.ServiceProvider[method].apply(Att.ServiceProvider, args.concat([function(result, event) {
                if (event.getStatus() === true) {
                    if (successCallback) {
                        successCallback.call(scope || me, result);
                    }
                } else {
                    if (failureCallback) {
                        var error = event.getError(),
                            xhr = event.getXhr(),
                            xhrError = {
                                xhrError : {
                                    status : '500',
                                    statusText : 'Internal Server Error'
                                }
                            };

                        if (error) {
                            failureCallback.call(scope || me, error);
                        } else {
                            if (xhr) {
                                xhrError = {
                                    xhrError : {
                                        status : xhr.status,
                                        statusText : xhr.statusText
                                    }
                                };
                            }
                            failureCallback.call(scope || me, xhrError);
                        }
                    }
                }
            }]));
        }
    }
});