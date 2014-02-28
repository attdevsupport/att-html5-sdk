<?php
// Include codekit files
require_once __DIR__ . '/../codekit.lib/OAuth/OAuthTokenService.php';
require_once __DIR__ . '/../codekit.lib/OAuth/OAuthCode.php';
require_once __DIR__ . '/../codekit.lib/OAuth/OAuthToken.php';
require_once __DIR__ . '/../codekit.lib/OAuth/OAuthCodeRequest.php';
require_once __DIR__ . '/../codekit.lib/Speech/SpeechService.php';
require_once __DIR__ . '/../codekit.lib/SMS/SMSService.php';
require_once __DIR__ . '/../codekit.lib/MMS/MMSService.php';
require_once __DIR__ . '/../codekit.lib/IMMN/IMMNService.php';
require_once __DIR__ . '/../codekit.lib/DC/DCService.php';

// use any namespaced classes
use Att\Api\OAuth\OAuthTokenService;
use Att\Api\OAuth\OAuthCode;
use Att\Api\OAuth\OAuthToken;
use Att\Api\OAuth\OAuthCodeRequest;
use Att\Api\Speech\SpeechService;
use Att\Api\SMS\SMSService;
use Att\Api\MMS\MMSService;
use Att\Api\IMMN\IMMNService;
use Att\Api\DC\DCService;

	function exception_handler($exception) {
		error_log("Fatal error: " . $exception->getMessage());
	}
	set_exception_handler("exception_handler");

	/**
	 * The Html5_ServiceProvider_Base_Att class.
	 *
	 * This class provides reusable and extendable server code written in PHP. The SDK server takes requests from the client side Att.Provider 
	 * object and maps them to the corresponding server side method which takes care of sending the requests to the AT&T API Platform.
	 *
	 * You can create an instance directly like this:
	 *
	 *      $html5_provider = new Html5_ServiceProvider_Base_Att(array(
	 *          "AppKey"            => "XXXXXX",
	 *          "Secret" 	        => "XXXXXX",
	 *          "localServer"       => "http://127.0.0.1:8888",
	 *          "apiHost"           => "https://api.att.com",
	 *          "clientModelScope"  => "WAP,SMS,MMS,PAYMENT,IMMN,SPEECH"
	 *      ));
	 *
	 *
	 * @class Html5_ServiceProvider_Base_Att
	 * @extends Base
	 *
	 * @cfg {string} AppKey The AppKey generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} Secret The Secret generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} localServer The url of the locally running server that is used to build the callback urls.
	 * @cfg {string} apiHost The url endpoint through which all AT&T API requests are made.
	 * @cfg {string} clientModelScope The list of scopes that the application wants to gain access to when making API calls that use Autonomous Client.
	 */
	class Html5_ServiceProvider_Base_Att extends Base {

		private $client_id 			= "";
		private $client_secret 		= "";
		private $local_server 		= "";
		private $base_url 			= "";
		private $clientModelScope	= "";
		
		// 2/11/2014. Added accessor functions
		public function getClientId() { return $client_id; }
		public function getClientSecret() { return $client_secret; }
		public function getLocalServer() { return $local_server; }
		public function getBaseUrl() { return $base_url; }
		public function getClientModelScope() { return $clientModelScope; }

		private $ad_urn				= "rest/1/ads";
		private $cms_urn			= "rest/1/Sessions";
		private $dc_urn				= "rest/2/Devices/Info";
		private $oauth_urn			= "oauth/acces_token";
		private $payment_urn		= "rest/3/Commerce/Payment";
		private $sms_urn			= "rest/3/sms/messaging";
		private $mobo_urn			= "rest/1/MyMessages";
		private $mim_urn			= "rest/1/MyMessages";
		private $tl_urn				= "rest/2/devices";
		private $mms_urn			= "messaging/mms/rest/2/outbox";
		private $wap_urn			= "messaging/wappush/rest/2/outbox";
		private $speech_urn			= "rest/2/SpeechToText";

		private $addressPatterns     = array(
			"tel"   => array('pattern' => "/^(\+?[1]-?)?[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/i", 'prefix' => 'tel:'),
			"email" => array('pattern' => "/^[a-zA-Z]\w+(.\w+)*@\w+(.[0-9a-zA-Z]+)*.[a-zA-Z]{2,4}$/i", 'prefix' => ''),
			"short" => array('pattern' => "/^\d{3,8}$/", 'prefix' => 'short:')
		);

		public function __construct($config) {

			if (!$config['AppKey']) throw new Exception("AppKey must be set");
			if (!$config['Secret']) throw new Exception("Secret must be set");
			if (!$config['localServer']) throw new Exception("localServer must be set");
			if (!$config['apiHost']) throw new Exception("apiHost must be set");

			$this->client_id 		= $config['AppKey'];
			$this->client_secret 	= $config['Secret'];
			$this->local_server 	= $config['localServer'];
			$this->base_url 		= $config['apiHost'];
			$this->clientModelScope = $config['clientModelScope'];

			if (DEBUG) {
				Debug::init();
				Debug::write("\nAT&T Provider initialized.\n");
				Debug::dumpBacktrace();
				Debug::write("API endpoint: $this->base_url\nClient ID: $this->client_id\nClient Secret: $this->client_secret\nLocal Server: $this->local_server\n\n");
				Debug::end();
			}
		}

		/**
		 * Generate the oauth redirect URL depending on the scope requested by the client.
		 * The scope is specified as a parameter in the GET request and passed to the provider
		 * library to obtain the appropriate oAuth URL
		 *
		 * @param {String} scope a comma separated list of services that the app requires access to
		 *
		 * @return {string} Returns the oAuth URL 
		 * @method oauthUrl
		 *
		 */
		public function oauthUrl($encoded_scope, $encoded_return_url) {
			$scope = urldecode($encoded_scope);
			$return_url = urldecode($encoded_return_url);
			$redirect_uri = $this->local_server . "/att/callback_debug.php?scopes=" . $scope . "&returnUrl=" . $return_url;
 			
			// Create object to get an OAuth Code Location URL
			$oacr = new OAuthCodeRequest($this->base_url, $this->client_id, $scope, $redirect_uri);			
			return $oacr->getCodeLocation();
		}

	   	/**
		 * Retrieves an access token from AT&T once the user has authorized the application and has returned with an auth code
		 *
		 * @method getToken
		 * @param {string} code The code returned by the authorize operation.
		 *
		 * @return {Response} Returns Response object
		 */
		public function getToken($code) {
			$oauthcode = new OAuthCode ($code);
			// Create service for requesting an OAuth token
			$osrvc = new OAuthTokenService($this->base_url, $this->client_id, $this->client_secret);
			// Get OAuth token
			return $osrvc->getTokenUsingCode($oauthcode);
		}

		/**
		 * Refreshes an access token from AT&T, given a refresh token from a previous oAuth session
		 *
		 * @param {OAuthToken} refresh_token The refresh token from a previous oAuth session passed as OAuthToken object.
		 *						only $refresh_token->getRefreshToken() value is used by the called operation.
		 *
		 * @method refreshToken
		 * @return {Response} Returns Response object
		 */
		public function refreshToken($refresh_token) {
 			// Create service for requesting an OAuth token
			$osrvc = new OAuthTokenService($this->base_url, $this->client_id, $this->client_secret);
			// Get OAuth token
			return $osrvc->refreshToken($refresh_token);
		}

		/**
		 * Retrieves a client token from AT&T
		 *
		 * @method getClientCredentials
		 *
		 * @return {Response} Returns Response object
		 */
		public function getClientCredentials() {
			// Create service for requesting an OAuth token
			$osrvc = new OAuthTokenService($this->base_url, $this->client_id, $this->client_secret);
			// Get OAuth token
			return $osrvc->getToken($this->clientModelScope);
		}

		/**
		 * Retrieves the current client token from the user's session.
		 * If the client token does not exist in the session, a call
		 * to getClientCredentials is made in order to get a new one
		 * from AT&T
		 *
		 * @method getCurrentClientToken
		 *
		 * @return {string} token
		 */
		public function getCurrentClientToken() {
			$token = null;
			
			// NOTE: error_Log comments are left here on purpose, so that a developer may uncomment them for troubleshooting.
			if(isset($_SESSION['client_token']) && $_SESSION['client_token'] <> '') {
//				error_Log( "Checking for client_token in Session");
				$session_token = $_SESSION['client_token'];
				$expires_in = isset($_SESSION['expires_in']) ? $_SESSION['expires_in'] : '';
				$refresh_token = isset($_SESSION['refresh_token']) ? $_SESSION['refresh_token'] : '';
				$token = new OAuthToken(
					$session_token,
					$expires_in,
					$refresh_token
				);		
//				error_Log(  "session client_token = " . $token->access_token);
			} else {
//				error_Log( "No valid client_token in Session so fetching new client_token");
				try {
					$token = $this->getClientCredentials();
					$_SESSION['client_token'] = $token->getAccessToken();
					$_SESSION['expires_in'] = $token->getTokenExpiry();
					$_SESSION['refresh_token'] = $token->getRefreshToken();
//				   	error_Log("fetched new client_token = " . $token);
				} catch (Exception $e) {
//					error_log('Error retrieving credentials: ' . $e->getMessage());
					if (isset($_SESSION['client_token'])) {
						unset($_SESSION['client_token']);
					}  
					$token = null;
				}
				
			}
			return $token;
		}


		/**
		 * Retrieves the current user consent access token from the user's session for a given scope.
		 * If the client token does not exist in the session. Returns null if no token exists.
		 *
		 * @method getSessionConsentToken
		 * @param {String} scope the service that the app requires access to
		 *
		 * @return {string} token
		 */
		public function getSessionConsentToken($scope) {
			$token = null;
			
			// NOTE: error_Log comments are left here on purpose, so that a developer may uncomment them for troubleshooting.
			if(isset($_SESSION['tokens'][$scope]) && $_SESSION['tokens'][$scope] <> '') {
//				error_Log( "Checking for client_token in Session");
				$session_token = $_SESSION['tokens'][$scope];
				$expires_in = '';
				$refresh_token = isset($_SESSION['refresh_tokens'][$scope]) ? $_SESSION['refresh_tokens'][$scope] : '';
				$token = new OAuthToken(
					$session_token,
					$expires_in,
					$refresh_token
				);		
//				error_Log(  "session client_token = " . $token->access_token);
			}
			return $token;
		}


		/**
		 *
		 * Return information on a device
		 * @method deviceInfo
		 *
		 * @param {array} data An array of Device Info options. Options should include:
		 * @param {string} data.0 (token) The oAuth access token
		 * @param {string} data.1 (tel) wireless number of the device to query
		 *
		 * @return {Response} Return Response object
		 *
		 */
 		public function deviceInfo($token) {
			$dcSrvc = new DCService($this->base_url, $token);
			$dcSrvc->setReturnJsonResponse(true); 

			return $dcSrvc->getDeviceInformation();
 		}

		/**
		 * Return location info for a device
		 *
		 * @method deviceLocation
		 *
		 * @param {array} data An array of Device Info options, which should include:
		 *   @param {string} data.0 (token) The oAuth access token
		 *   @param {number} data.1 (requestedAccuracy) The requested accuracy (optional)
		 *   @param {number} data.2 (acceptableAccuracy) The acceptable accuracy (optional)
		 *   @param {number} data.3 (tolerance) The tolerance (optional)
		 *
		 * @return {Response} Returns Response object
		 */
		public function deviceLocation($data) {
			$params = array();

            $url = "$this->base_url/2/devices/location";

			if (intval($data[1]) > 0) {
				array_push($params, "requestedAccuracy=$data[1]");
			}

			if (intval($data[2]) > 0) {
				array_push($params, "acceptableAccuracy=$data[2]");
			}

			if (strlen($data[3]) > 0) {
				array_push($params, "tolerance=$data[3]");
			}

			if (count($params) > 0) {
				$url .= "?" . implode("&", $params);
			}

			$request = new Request(array(
				"headers"   => array(
					"Authorization" => "Bearer $data[0]"
				)
			));

			return $this->makeRequest("GET", $url, $request);
		}


		/**
		 * Sends an SMS to a recipient
		 *
		 * @method sendSms
		 *
		 * @param {array} data An array of SMS options. Options should include:
		 * @param {string} data.0 (token) The oAuth access token
		 * @param {string} data.1 (tel) Wireless number of the recipient(s). Can contain comma separated list for multiple recipients.
		 * @param {string} data.2 (message) The text of the message to send
		 *
		 * @return {Response} Returns Response object 
		 */
		public function sendSms($token, $address, $message) {
			$smsSrvc = new SMSService($this->base_url, $token);
			$smsSrvc->setReturnJsonResponse(true); 

			if (strstr($address, ",")) {
				// If it's csv, split and iterate over each value prepending each value with "tel:"
				$address = explode(",", $address);
				foreach ($address as $key => $value) {
					$address[$key] = $this->parseAddress($value);
				}
			} else {
				$address = $this->parseAddress($address); 
			}
			
			return $smsSrvc->sendSMS($address, $message, false);
		}


		/**
		 * Check the status of a sent SMS
		 *
		 * @method smsStatus
		 *
		 * @param {array} data An array of SMS options, which should include:
		 * @param {string} data.0 (token) The oAuth access token
		 * @param {string} data.1 (tel) The unique SMS ID as retrieved from the response of the sendSms method
		 *
		 * @return {Response} Returns Response object
		 */
		public function smsStatus($token, $smsId) {
			$smsSrvc = new SMSService($this->base_url, $token);
			$smsSrvc->setReturnJsonResponse(true); 

			return $smsSrvc->getSMSDeliveryStatus($smsId);
		}

		/**
		 * Retrieves a list of SMSs sent to the application's short code
		 *
		 * @param {array} data An array of SMS options, which should include:
		 * @param {string} data.0 (token) The oAuth access token
		 * @param {string} data.1 (registrationId) The registrationId to receive messages from.
		 * @return {Response} Returns Response object
		 * @method receiveSms
		 */
		public function getSms($token, $registrationId) {
			$smsSrvc = new SMSService($this->base_url, $token);
			$smsSrvc->setReturnJsonResponse(true); 

			return $smsSrvc->getMessages($registrationId);
		}

		/**
		 * Retrieve Message Headers from Server
		 *
		 * @method getMessageHeaders
		 *
		 * @param {array} data, An array containing:
		 * @param {string} data.0 (token) The oAuth access token
		 * @param {integer} data.1 (headerCount) - the number of records to retrieve
		 * @param {string} data.2 (indexCursor) - pointer to last message returned. This value is returned by this method and must be saved in order to properly fetch the next set of headers.
		 *
		 * @return {Response} Returns Response object
		 */
		public function getMessageHeaders($token, $headerCount, $indexCursor) {
			$immnSrvc = new IMMNService($this->base_url, $token);
			$immnSrvc->setReturnJsonResponse(true);
			
			return $immnSrvc->getMessageList($headerCount, $indexCursor);
		}

		/**
		 * Retrieves the contents of an MMS message part.
		 *
		 * @method getMessageContents
		 * @param {array} data, An array of options for getMessageContents, which should include:
		 * @param {string} data.0 (token) The oAuth access token
		 * @param {string} data.1 (messageId) The messageId of the message 
		 * @param {string} data.2 (partNumber) The partNumber to retrieve
		 *
		 * @return {Response} Returns Response object
		 * 
		 */
		public function getMessageContents($data) {
			$messageId      = $data[1];
			$messagePart    = $data[2] <> '' ? '/' . $data[2] : '';
			$url            = "$this->base_url/$this->mim_urn/$messageId$messagePart";

			$request = new Request(array(
				"headers"   => array(
					"Authorization" => "Bearer $data[0]"
				)
			));

			return $this->makeRequest("GET", $url, $request);
		}

		/**
		 * Sends a IMMN to a recipient
		 *
		 * @method sendMobo
		 * @param {Array} data An array of SMS options. Options should include:
		 * @param {String} data.0 (token) The oAuth access token
		 * @param {String} data.1 (tel) Wireless number of the recipient(s). Can contain comma separated list for multiple recipients.
		 * @param {String} data.2 (message) The text of the message to send
		 * @param {String} data.3 (subject) Subject of message
		 * @param {Boolean} data.4 (group) Send as group message. Defaults to false;
		 *
		 * @return {Response} Returns Response object
		 *
		 */
		public function sendMobo($data) {
			$address     = $data[1];
			$message     = $data[2];
			$subject     = $data[3];
			$group       = $data[4];

			if (count($data) > 5) {
				$files = $data[5];
			}

			$url = "$this->base_url/$this->mobo_urn";

			// Parse address(es)
			if (strstr($address, ",")) {
				// If it's csv, split and iterate over each value prepending each value with "tel:"
				$address = explode(",", $address);
				foreach ($address as $key => $value) {
					// Determine if string is tel, short or email
					$address[$key] = $this->parseAddress($value); 
				}
			} else {
				$address = $this->parseAddress($address);
			}

			$postfields = array(
				"Addresses" => (array) $address,
				"Text"      => $message,
				"Subject"   => $subject,
				"Group"     => $group
			);

			$payloadSize = strlen($subject . $message);

			$request = new Request(array(
				"headers"   => array(
					"Authorization" => "Bearer $data[0]"
				),
				"postfields"    => $postfields
			));

			if ($payloadSize > 160 || isset($files) || $group) {
				// Must sent as MMS

				$request->forceMultiPart();

				foreach ((array) $files as $file) {
					try {
						$encoded_file = $this->base64Encode($file);
					} catch (Exception $e) {
						$response = new Response(array("error" => "File Not Found"));
						return $response;
					}

					$request->addContent(array(
						"headers" => array(
							"Content-Type" => $this->getMimeType($file),
							"Content-Transfer-Encoding" => "base64",
							"Content-Disposition" => "attachment; name=$file"
						),
						"content" => $encoded_file
					));
					
				}
			}

			return $this->makeRequest("POST", $url, $request);
		}

		/**
		 * Sends audio file to API and a text representation is sent back.
		 *
		 * @method speechToText
		 *
		 * @param {string} data.0 Token for authentication
		 * @param {string} data.1 Name and path of local audio file to send to codekit
		 * @param {string} data.2 Speech context for translation. Please see SpeechToText API documentation for parameter values
		 * @param {array} data.3 X-Arg objects. Please see SpeechToText API documentation for information about this parameter
		 * @param {boolean} data.4 True to send the file using chunked transfer.
		 * @return {Response} Returns Response object.
		 *
		 */
		public function speechToText($token, $file, $context, $xargs, $chunked) {
			try {
				$filecontents = $this->getFile($file);
			}
			catch (Exception $e) {
				$response = new Response(array("error" => "File not found"));
				return $response;
			}
			
			$speechSrvc = new SpeechService($this->base_url, $token);
			$speechSrvc->setReturnJsonResponse(true);
			
			return $speechSrvc->speechToText($file, $context, null, $xargs, $chunked);
		}

		/**
		 * Sends audio file to API and a text representation is sent back. Used to process posted file data.
		 *
		 * @method speechToTextWithFileType
		 *
		 * @param {string} data.0 Token for authentication
		 * @param {string} data.1 Name and path of local audio file to send to codekit
		 * @param {string} data.2 Filetype to send to the codekit
		 * @param {string} data.3 Speech context for translation. Please see SpeechToText API documentation for parameter values
		 * @param {array} data.4 X-Arg objects. Please see SpeechToText API documentation for information about this parameter
		 * @param {boolean} data.5 True to send the file using chunked transfer.
		 * @return {Response} Returns Response object.
		 *
		 */
		public function speechToTextWithFileType($token, $file, $filetype, $context, $xargs, $chunked) {
			try {
				$filecontents = $this->getFile($file);
			}
			catch (Exception $e) {
				$response = new Response(array("error" => "File not found"));
				return $response;
			}
			
			$speechSrvc = new SpeechService($this->base_url, $token);
			$speechSrvc->setReturnJsonResponse(true);
			
			return $speechSrvc->speechToTextWithFileType($file, $filetype, $context, null, $xargs, $chunked);
		}

		/**
		 * Sends audio file to API and a text representation is sent back. Supports custom dictionary and/or grammar file.
		 *
		 * @method speechToTextCustom
		 *
		 * @param {string} data.0 Token for authentication
		 * @param {string} data.1 Name and path of local audio file to send to codekit
		 * @param {string} data.2 Speech context for translation. Please see SpeechToText API documentation for parameter values
		 * @param {boolean} data.3 Name and path of the grammar file.
		 * @param {boolean} data.4 Name and path of the dictionary file.
		 * @param {array} data.5 X-Arg objects. Please see SpeechToText API documentation for information about this parameter
		 * @return {Response} Returns Response object.
		 *
		 */
		public function speechToTextCustom($token, $file, $context, $grammar_file, $dictionary_file, $xargs) {
			try {
				$filecontents = $this->getFile($file);
			}
			catch (Exception $e) {
				$response = new Response(array("error" => "File not found"));
				return $response;
			}
			
			$speechSrvc = new SpeechService($this->base_url, $token);
			$speechSrvc->setReturnJsonResponse(true);
			
			return $speechSrvc->speechToTextCustom($context, $file, $grammar_file, $dictionary_file, $xargs);
		}

		/**
		 * Sends the text for conversion to the codekit and returns the audio file.
		 *
		 * @method textToSpeech
		 *
		 * @param {string} data.0 Token for authentication
		 * @param {string} data.1 Content type - generally 'text/plain'
		 * @param {string} data.2 Text to be converted to speech
		 * @param {array} data.3 X-Arg objects. Please see SpeechToText API documentation for information about this parameter
		 * @return {Response} Returns Response object.
		 *
		 */
		public function textToSpeech($token, $ctype, $text, $xargs) {
			$speechSrvc = new SpeechService($this->base_url, $token);
			//$speechSrvc->setReturnJsonResponse(true);
			
			return $speechSrvc->textToSpeech($ctype, $text, $xargs);
		}

		/**
		 * requestChargeAuth
		 *
		 * @param {array} data An array of charge options.
		 * @param {string} data.0 (token) The oAuth access token
		 * @param {string} data.1 (type) The charge type
		 * @param {object} data.2 (paymentDetails) The paymentDetails as an oject.
		 *
		 * @method requestChargeAuth
		 */
		public function requestChargeAuth($data) {
			$type = $data[1];
			$paymentDetails = $data[2];

			if($type == "SUBSCRIPTION") {
				$type = "Subscriptions";
			}

			if($type == "SINGLEPAY") {
				$type = "Transactions";
			}

			if (! isset($paymentDetails->MerchantPaymentRedirectUrl) ) {
				$paymentDetails->MerchantPaymentRedirectUrl = "{$this->local_server}/att/payment";
			}

			$signed = $this->signPayload($paymentDetails);
			$doc 	= $signed->data()->SignedDocument;
			$sig 	= $signed->data()->Signature;
			$url 	= "$this->base_url/$this->payment_urn/$type?clientid={$this->client_id}&Signature=$sig&SignedPaymentDetail=$doc";

			$request = new Request();
			$response = $this->makeRequest("GET", $url, $request);

			if ($response->isError()) {
				return $response;
			}
			else {
				$temp = array();
				$test = $response->getHeaders();
 				$temp["adviceOfChargeUrl"] = $test["Location"];
				return $temp; 
			}
		}

		/**
		 * Sign a document
		 *
		 * @method signPayload
		 * @param {array} toSign An array of payment parameters to send to Notary
		 *
		 * @return {Response} Returns Response object
		 */
		public function signPayload($toSign) {
			$url = "$this->base_url/Security/Notary/Rest/1/SignedPayload?&client_id={$this->client_id}&client_secret={$this->client_secret}";

			$request = new Request(array(
				"postfields"    => $toSign
			));

			return $this->makeRequest("POST", $url, $request);
		}

		/**
		 * Queries the status of a transaction
		 *
		 * @param {Array} data - An array of calling parameters:
		 *
		 * @param {string} data.0 access_token The oAuth access token
		 * @param {string} data.1 transaction search field: [ TransactionId | MerchantTransactionId | TransactionAuthCode ]
		 * @param {string} data.2 transaction search value  
		 *
		 * @return {Response} Returns Response object
		 *
		 * @method transactionStatus
		 */
		public function transactionStatus($data) {
			$url = "$this->base_url/$this->payment_urn/Transactions/$data[1]/$data[2]"; 

			$request = new Request(array(
				"headers"   => array(
					"Authorization" => "Bearer $data[0]"
				)
			));

			return $this->makeRequest("GET", $url, $request);
		}

		/**
		 * Queries the status of a subscription
		 *
		 * @param {array} data - An array of calling parameters:
		 *
		 * @param {string} data.0 access_token The oAuth access token
		 * @param {string} data.1 subscription search field: [ SubscriptionId | MerchantTransactionId | SubscriptionAuthCode ]
		 * @param {string} data.2 subscription search value  
		 *
		 * @return {Response} Returns Response object
		 *
		 * @method subscriptionStatus
		 */
		public function subscriptionStatus($data) {
			$url = "$this->base_url/$this->payment_urn/Subscriptions/$data[1]/$data[2]";

			$request = new Request(array(
				"headers"   => array(
					"Authorization" => "Bearer $data[0]"
				)
			));

			return $this->makeRequest("GET", $url, $request);
		}

		/**
		 * Commits a previously authorized transaction
		 *
		 * @method commitTransaction
		 *
		 * @param {Array} data - An array of calling parameters:
		 *
		 *  @data[0] {String} access_token The oAuth access token
		 *  @data[1] {String} transaction id
		 *  @data[2] {String} details - the commit body.
		 *
		 * @hide
		 */
		public function commitTransaction($data) {
			$url = "$this->base_url/this->payment_urn/Transactions/TransactionId/$data[1]";

			$request = new Request(array(
				"headers"       => array(
					"Authorization" => "Bearer $data[0]"
				),
				"postfields"    => json_encode($data[2])

			));

			return $this->makeRequest("PUT", $url, $request);
		}
		
		/**
		 * Issues a refund for a transaction
		 *
		 * @param {array} data, An arry of refundTransaction options, which should include:
		 * @param {string} data.0 (access_token) The oAuth access token
		 * @param {string} data.1 (transaction_id) The id of the transaction
		 * @param {string} data.2 (details) The json data
		 *
		 * @return {Response} Returns Response object
		 *
		 * @method refundTransaction
		 */
		public function refundTransaction($data) {
			$url = "$this->base_url/$this->payment_urn/Transactions/$data[1]?Action=refund";

			$request = new Request(array(
				"headers" => array(
					"Authorization"	=> "Bearer $data[0]"
				),
				"postfields"	=> json_encode($data[2])
			));

			return $this->makeRequest("PUT", $url, $request);
		}

		/**
		 * Retrieves the subscription details
		 *
		 * @param {array} data, An array of subscriptionDetails options, which should include:
		 * @param {string} data.0 (access_token) The oAuth access token
		 * @param {string} data.1 (merchant_subscription_id) The merchant subscription id
		 * @param {string} data.2 (consumer_id) The consumer id
		 *
		 * @return {Response} Returns Response object
		 * @method subscriptionDetails
		 */
		public function subscriptionDetails($data) {
			$url = "$this->base_url/$this->payment_urn/Subscriptions/$data[1]/Detail/$data[2]";

			$request = new Request(array(
				"headers" => array(
					"Authorization" => "Bearer $data[0]"
				)
			));

			return $this->makeRequest("GET", $url, $request);
		}

		/**
		 * Retrieves a notification object
		 *
		 * @param {array} data, An array of getNotifcation options, which should include:
		 * @param {string} data.0 (access_token) The oAuth access token
		 * @param {string} data.1 (notification_id) The notification id
		 *
		 * @return {Response} Returns Response object
		 *
		 * @method getNotification
		 */
		public function getNotification($data) {
			$url = "$this->base_url/$this->payment_urn/Notifications/$data[1]";

			$request = new Request(array(
				"headers" => array(
					"Authorization" => "Bearer $data[0]"
				)
			));

			return $this->makeRequest("GET", $url, $request);
		}

		/**
		 * Stops the notification from being sent to the notification callback
		 *
		 * @param {array} data, An array of acknowledgeNotification options, which should include:
		 * @param {string} data.0 (access_token) The oAuth access token
		 * @param {string} data.1 (notification_id) The notification id
		 *
		 * @return {Response} Returns Response object
		 * @method acknowledgeNotification
		 */
		public function acknowledgeNotification($data) {
			$url = "$this->base_url/$this->payment_urn/Notifications/$data[1]";

			$request = new Request(array(
				"headers" => array(
					"Authorization" => "Bearer $data[0]"
				)
			));

			return $this->makeRequest("PUT", $url, $request);
		}

		/**
		 * Sends an MMS to a recipient
		 *
		 * MMS allows for the delivery of different file types. Please see the developer documentation for an updated list:
		 *  https://developer.att.com/docs
		 *
		 * @param {array} data An array of sendMms options, which should include:
		 * @param {string} data.0 (access_token) The oAuth access token
		 * @param {string} data.1 (tel) Comma separated list of wireless numbers of the recipients
		 * @param {string} data.2 (file_name) The name of the file, eg logo.jpg
		 * @param {string} data.3 (subject) The subject line for the MMS
		 * @param {string} data.4 (priority) Can be "Default", "Low", "Normal" or "High"
		 *
		 * @return {Response} Returns Response object
		 * @method sendMms
		 */
		public function sendMms($token, $address, $files, $subject, $priority) {
			$mmsSrvc = new MMSService($this->base_url, $token);
			$mmsSrvc->setReturnJsonResponse(true); 
			
			// Parse address(es)
			if (strstr($address, ",")) {
				// If it's csv, split and iterate over each value prepending each value with "tel:"
				$address = explode(",", $address);
				foreach ($address as $key => $value) {
					// Determine if string is tel, short or email
					$address[$key] = $this->parseAddress($value); 
				}
			} else {
				$address = $this->parseAddress($address);
			}

			return $mmsSrvc->sendMMS($address, $files, $subject, $priority, false);
		}

		/**
		 * Queries the status of a sent MMS
		 *
		 * @method mmsStatus
		 *
		 * @param {array} data An array of SMS options, which should include:
		 * @param {string} data.0 (token) The oAuth access token
		 * @param {string} data.1 (mms_id) The ID of the MMS as received in the returned data when sending an MMS
		 *
		 * @return {Response} Returns Response object
		 */
		public function mmsStatus($token, $mmsId) {
			$mmsSrvc = new MMSService($this->base_url, $token);
			$mmsSrvc->setReturnJsonResponse(true); 
			return $mmsSrvc->getMMSStatus($mmsId);
		}

		/**
		 * Sends a WAP Push to a device
		 *
		 * @param {array} data An array of WAP options, which should include:
		 * @param {string} data.0 (token) The oAuth access token
		 * @param {string} data.1 (tel) A comma separated list of wireless numbers of the recipients
		 * @param {string} data.2 (message) The message to send
		 *
		 * @return {Response} Returns Response object
		 * @method wapPush
		 */
		public function wapPush($data) {
			$address = $data[1];
			$message = $data[2];
//			$subject = $data[3];
//			$priority = $data[4];

            $url = "$this->base_url/1/messages/outbox/wapPush"; 

			// Parse address(es)

			if (strstr($address, ",")) {
				// If it's csv, split and iterate over each value prepending each value with "tel:"
				$address = explode(",", $address);
				foreach ($address as $key => $value) {
					// Determine if string is tel, short or email
					$address[$key] = $this->parseAddress($value); 
				}
			} else {
				$address = $this->parseAddress($address);
			}

			$postfields = array(
				"address" => $address
//				"subject" => $subject,
//				"priority" => $priority		
			);

			$request = new Request(array(
				"headers"	=> array(
					"Authorization" 	=> "Bearer $data[0]"
				),
				"postfields" => $postfields
			));

            $request->addContent(array(
                "headers" => array(
                	"Content-Type" => "text/xml"
                ),
                "content" => 
                	"Content-Type: text/vnd.wap.si\n" .
                	"Content-Disposition: form-data; name=\"PushContent\"\n". 
                	"X-Wap-Application-Id: x-wap-application:wml.ua\n\n" .
                	$message
            ));

			return $this->makeRequest("POST", $url, $request);
		}

		/**
		 * Retrieve an ad from AT&T servers
		 *
		 * @param {data} array An array of ad specification values including
		 * @param {string} data.0 oAuth access token
		 * @param {string} data.1. Udid oh no you didn't ...
		 * @param {object} data.2 Key/Value pairs of API parameters
		 * @return {Request} Returns a Request object
		 */
//		public function getAd($data) {
//			$params = '';
//			$udid = $data[1];
//
//			if (gettype($data[2]) === 'object') {
//				foreach ($data[2] as $key => $value) {
//					if ($value !== '' && $value !== null) {
//						$params .= ($params ? "&" : '') . "$key=" . urlencode($value);
//					}
//				}
//			}
//
//			$url = "$this->base_url/$this->ad_urn?$params";
//			$browser = "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
//
//			$request = new Request(array(
//				"headers" => array(
//					"User-agent" => $_SERVER['HTTP_USER_AGENT'],
//					"Authorization" => "Bearer $data[0]",
//					"UDID" => $udid
//				)
//			));
//
//			return $this->makeRequest("GET", $url, $request);
//		}


		/**
		 * Create Content Management Session
		 *
		 * @method cmsCreateSession
		 * @param {array} data Array of parameters
		 * @param {string} data.0 oAuth access token
		 * @param {string} data.1 json string of key/value pairs to pass to CMS script
		 *
		 */
		public function cmsCreateSession($data) {
			$url = "$this->base_url/$this->cms_urn";

			$request = new Request(array(
				"headers" => array(
					"Authorization" => "Bearer $data[0]"
				),
				"postfields" => $data[1]
			));

			return $this->makeRequest("POST", $url, $request);
		}

		/**
		 * Send CMS Signal 
		 * @method cmsSendSignal
		 * @param {array} data - json string of data
		 *
		 * @param {string} data.0 oAuth access token
		 * @param {string} data.1 Session ID
		 * @param {string} data.2 Signal to send
		 */
		public function cmsSendSignal($data) {
			$sessionId = $data[1];
			$url = "$this->base_url/$this->cms_urn/$sessionId/Signals";

			$request = new Request(array(
				"headers" => array(
					"Authorization" => "Bearer $data[0]"
				),
				"postfields" => "{ \"signal\" : \"{$data[2]}\" }"
			));

			return $this->makeRequest("POST", $url, $request);
		}

 		/**
  		 * Helper method to create a hash array of values to send to the Notary for a single payment transaction.
		 *
  		 * @method createSinglePaymentDescription
		 *
  		 * @param {float} amount Amount of Transaction with a maximum of 2 decimals
  		 * @param {string} category Product category
  		 * @param {string} paymentDescription Short description of the entire purchase
  		 * @param {string} productDescription Product name or short description
	     * @param {string} merchantTransactionId the id for the merchantTransaction.
  		 * @param {string} paymentRedirectUrl url used when the transaction is completed
  		 *
  		 * @return {object} Returns an object of the payment parameters.
  		 */
		public function createSinglePaymentDescription($amount, $category, $paymentDescription, $productDescription, $merchantTransactionId, $paymentRedirectUrl) {

       		return (object) array(
         		"Amount" => $amount,
         		"Category" => $category,
         		"Channel" => "MOBILE_WEB",
         		"Description" => $paymentDescription,
         		"MerchantTransactionId" => $merchantTransactionId,
         		"MerchantProductId"  => $productDescription,
         		"MerchantPaymentRedirectUrl"  => $paymentRedirectUrl
       		);
		}

		/**
  		 * Helper method which creates a hash array ov values to send to the Notary for a subscription payment transaction.
		 *
  		 * @method createSubscriptionPaymentDescription
		 *
  		 * @param {float} amount Amount of Transaction with a maximum of 2 decimals
    	 * @param {string} category Product category
  		 * @param {string} paymentDescription Short description of the entire purchase
  		 * @param {string} productDescription Product name or short description
	     * @param {string} merchantTransactionId the id for the merchantTransaction.
  		 * @param {string} paymentRedirectUrl url used when the transaction is completed
	     * @param {string} merchantSubscriptionIdList One or more subscription IDs that this transaction is associated with. Each ID has a maximum length of 12 alphanumeric characters, and commas are used to separate the values.  
  		 * @param {integer} freePeriods Number of free days before charging begings. Range is 0-90 
  		 *
  		 * @return {object} Returns an object of the payment parameters.
    	 */
		public function createSubscriptionPaymentDescription($amount, $category, $paymentDescription, $productDescription, $merchantTransactionId, $paymentRedirectUrl, $merchantSubscriptionIdList, $freePeriods) {
	       	$payment = $this->createSinglePaymentDescription($amount,$category,$paymentDescription,$productDescription,$merchantTransactionId,$paymentRedirectUrl);
    	   	$payment->MerchantSubscriptionIdList = $merchantSubscriptionIdList;
       		$payment->SubscriptionRecurrences = 99999;
       		$payment->SubscriptionPeriod = "MONTHLY";
       		$payment->SubscriptionPeriodAmount = 1;
       		$payment->IsPurchaseOnNoActiveSubscription = false;
       		$payment->FreePeriods = $freePeriods;
       		return $payment;
		}

		/*
		 * Helper method which cancels an existing subscription
		 * 
		 * @param {string} transactionOperationStatus The status of the transaction
		 * @param {string} refundReasonCode User defined reason code for the cancellation
		 * @param {string} refundReasonText User defined reason text for the cancellation
		 *
 		 * @return {object} Returns an object of the cancel parameters
		 */
		public function cancelSubscriptionDescription($transactionOperationStatus, $refundReasonCode, $refundReasonText) {
			return (object) array(
				"TransactionOperationStatus" => $transactionOperationStatus,
				"RefundReasonCode" => $refundReasonCode,
				"RefundReasonText" => $refundReasonText
			);
		}

		/*
		 * Helper method which refunds a payment
		 *
		 * @param {string} transactionOperationStatus The status of the transaction
		 * @param {string} refundReasonCode User defined reason code for the refund
		 * @param {string} refundReasonText User defined reason text for the refund
		 *
 		 * @return {object} Returns an object of the cancel parameters
		 */
		public function refundTransactionDescription($transactionOperationStatus, $refundReasonCode, $refundReasonText) {
			return (object) array(
				"TransactionOperationStatus" => $transactionOperationStatus,
				"RefundReasonCode" => $refundReasonCode,
				"RefundReasonText" => $refundReasonText
			);
		}
     
		public function __call($name, $args) {
			preg_match("/^direct_(.*)$/", $name, $matches);
			if ($method = $matches[1]) {
				// $args is an array of the passed params (this is important to know since we're calling methods using call_user_func_array())
				// Also, return value must be cast to an object as it will then be merged into another object
				$response = $this->$method($args);
				if ($response instanceof Response) {
					if ($response->isError()) {
						return (object) array("error" => $response->error());
					} else {
						return (object) array("result" => $response->getParsedResponse());
					}
				} else {
					// For APIs like oauthUrl that only return a string and don't wrap a cURL response in a Response object, $response will be a string
					return (object) array("result" => $response);
				}
			} else {
				return (object) array("error" => "No such method");
			}
		}

		private function parseAddress($address) {
			foreach ($this->addressPatterns as $key => $pattern ) {
				if (preg_match($this->addressPatterns[$key]['pattern'], $address)) {
					return $this->addressPatterns[$key]['prefix'] . preg_replace("/[\+\-]/", "", $address);
				}
			}
			return "";
		}
		
	}
?>