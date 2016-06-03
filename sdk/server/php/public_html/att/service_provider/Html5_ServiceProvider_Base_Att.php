<?php
require_once 'Base.php';
// Include codekit files
require_once __DIR__ . '/../codekit.lib/OAuth/OAuthTokenService.php';
require_once __DIR__ . '/../codekit.lib/OAuth/OAuthCode.php';
require_once __DIR__ . '/../codekit.lib/OAuth/OAuthToken.php';
require_once __DIR__ . '/../codekit.lib/OAuth/OAuthCodeRequest.php';

// use any namespaced classes
use Att\Api\OAuth\OAuthTokenService;
use Att\Api\OAuth\OAuthCode;
use Att\Api\OAuth\OAuthToken;
use Att\Api\OAuth\OAuthCodeRequest;

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
	 *          "clientModelScope"  => "SMS,SPEECH,TTS,STTC"
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

		protected $client_id 			= "";
		protected $client_secret 		= "";
		protected $local_server 		= "";
		protected $base_url 			= "";
		protected $clientModelScope		= "";
		protected $channel_id           = "";
		
		protected $reduce_token_expiry_by 	= 0;
		protected $user_consent_custom_param_default 	= null;
		
		// 2/11/2014. Added accessor functions
		public function getClientId() { return $client_id; }
		public function getClientSecret() { return $client_secret; }
		public function getLocalServer() { return $local_server; }
		public function getBaseUrl() { return $base_url; }
		public function getClientModelScope() { return $clientModelScope; }


		public $addressPatterns     = array(
			"tel"   => array('pattern' => "/^(\+?[1]-?)?[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/i", 'prefix' => 'tel:'),
			"email" => array('pattern' => "/^[a-zA-Z]\w+(.\w+)*@\w+(.[0-9a-zA-Z]+)*.[a-zA-Z]{2,4}$/i", 'prefix' => ''),
			"short" => array('pattern' => "/^\d{3,8}$/", 'prefix' => 'short:')
		);

		public function __construct($config) {

			if (!$config['AppKey']) throw new Exception("AppKey must be set");
			if (!$config['Secret']) throw new Exception("Secret must be set");
			if (!$config['localServer']) throw new Exception("localServer must be set");
			if (!$config['apiHost']) throw new Exception("apiHost must be set");

			$this->client_id 	= $config['AppKey'];
			$this->client_secret 	= $config['Secret'];
			$this->local_server 	= $config['localServer'];
			$this->base_url 	= $config['apiHost'];
			$this->clientModelScope = $config['clientModelScope'];
			$this->reduce_token_expiry_by = isset ($config['ReduceTokenExpiryInSeconds_Debug']) ?
								(int) $config['ReduceTokenExpiryInSeconds_Debug'] : 0;

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
		 * @param {String} return_url address to redirect the callback to after authcode is obtained
		 * @param {String} $custom_param a comma separated value to by pass on-net OR suppress landing page
		 *
		 * @return {string} Returns the oAuth URL 
		 * @method oauthUrl
		 *
		 */
		public function oauthUrl($scope, $return_url, $custom_param) {
			$encoded_return_url = urlencode($return_url);
			$redirect_uri = $this->local_server . "/att/callback.php?scopes=" . $scope . "&returnUrl=" . $encoded_return_url;
 			
			// Create object to get an OAuth Code Location URL
			$oacr = new OAuthCodeRequest($this->base_url."/oauth/v4/authorize", $this->client_id, $scope, $redirect_uri);
			// Append custom param, if it was sent or is set in the config file
			$oAuthUrl = $oacr->getCodeLocation();
			if ($custom_param != null) {
				if (DEBUG) {
					Debug::init();
					Debug::write("Custom params are: $custom_param\n");
					Debug::end();	
				}
				$oAuthUrl = $oAuthUrl . '&custom_param=' . $custom_param;
			}
			
			if (DEBUG) {
				Debug::init();
				Debug::write("OAuth URL for authorize is: $oAuthUrl\n");
				Debug::end();	
			}
			return $oAuthUrl;
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
		 *			only $refresh_token->getRefreshToken() value is used by the called operation.
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
		public function refreshClientToken($old_token) {
 			// Create service for requesting an OAuth token
			$osrvc = new OAuthTokenService($this->base_url, $this->client_id, $this->client_secret);
			// Refresh Client token
			if (DEBUG) {
				Debug::init();
				$a = $old_token->getRefreshToken();
				Debug::write("Old Refresh token: $a.\n");
				Debug::end();	
			}
			$token = $osrvc->refreshToken($old_token);
			if (DEBUG) {
				Debug::init();
				$a = $token->getAccessToken();
				$b = $token->getTokenExpiry();
				$c = $token->getRefreshToken();
				Debug::write("New Token: $a. New Expiry: $b. New Refresh Token: $c.\n");
				Debug::end();	
			}
			$_SESSION['client_token'] = $token->getAccessToken();
			$_SESSION['client_refresh_token'] = $token->getRefreshToken();
			$_SESSION['client_expires_at'] = $token->getTokenExpiry();
			return $token;
		}
		public function refreshConsentToken($old_token, $scope) {
 			// Create service for requesting an OAuth token
			$osrvc = new OAuthTokenService($this->base_url, $this->client_id, $this->client_secret);
			// Refresh Consent token
			if (DEBUG) {
				Debug::init();
				$a = $old_token->getRefreshToken();
				Debug::write("Old Refresh token: $a.\n");
				Debug::end();	
			}
			$token = $osrvc->refreshToken($old_token);
			if (DEBUG) {
				Debug::init();
				$a = $token->getAccessToken();
				$b = $token->getTokenExpiry();
				$c = $token->getRefreshToken();
				Debug::write("New Token: $a. New Expiry: $b. New Refresh Token: $c.\n");
				Debug::end();	
			}
			// Parse the consent_tokens array and update each taken that matches old_token
			$consent_tokens	= isset($_SESSION['consent_tokens']) ? $_SESSION['consent_tokens'] : '';
			foreach ($consent_tokens as $key => $value) {
				if ($_SESSION['consent_tokens'][$key] == $old_token->getAccessToken()) {
					$_SESSION['consent_tokens'][$key] = $token->getAccessToken();
					$_SESSION['consent_refresh_tokens'][$key] = $token->getRefreshToken();
					$_SESSION['consent_expires_at'][$key] = $token->getTokenExpiry();
				}
			}
			return $token;
		}

		/**
		 * Revokes the specified token.
		 *
		 * @param string $token token to revoke
		 * @param string $hint hint for token type
		 *
		 * @throws OAuthException if API gateway returned an error
		 */
		public function revokeRefreshToken($refresh_token_string) {
 			// Create service for requesting an OAuth token
			$osrvc = new OAuthTokenService($this->base_url, $this->client_id, $this->client_secret);
			// Revoke OAuth token using refresh_token as hint
			if (!empty($refresh_token_string)) {
				$osrvc->revokeToken($refresh_token_string, 'refresh_token');
			} else {
				throw new Exception('Invalid argument passed to revokeRefreshToken method.');
			}
		}
		public function revokeClientToken() {
			$refresh_token_string = isset($_SESSION['client_refresh_token']) ? $_SESSION['client_refresh_token'] : '';
			if (empty($refresh_token_string)) return;

			// Revoke Client token
			if (DEBUG) {
				Debug::init();
				$a = $refresh_token_string;
				Debug::write("Revoke Client Refresh token: $a.\n");
				Debug::end();	
			}
			$this->revokeRefreshToken($refresh_token_string);
			unset($_SESSION['client_token']);
			unset($_SESSION['client_refresh_token']);
			unset($_SESSION['client_expires_at']);
		}
		public function revokeConsentToken($scope) {
 			// Create service for requesting an OAuth token
			$osrvc = new OAuthTokenService($this->base_url, $this->client_id, $this->client_secret);
			$refresh_token_string = isset($_SESSION['consent_refresh_tokens'][$scope]) ? $_SESSION['consent_refresh_tokens'][$scope] : '';
			if (empty($refresh_token_string)) return;
			
			if (DEBUG) {
				Debug::init();
				$a = $refresh_token_string;
				Debug::write("Revoke Consent Refresh token: $a.\n");
				Debug::end();	
			}
			$this->revokeRefreshToken($refresh_token_string);
			// Parse the consent_tokens array and update each taken that matches old_token
			$consent_tokens	= isset($_SESSION['consent_refresh_tokens']) ? $_SESSION['consent_refresh_tokens'] : '';
			foreach ($consent_tokens as $key => $value) {
				if ($_SESSION['consent_refresh_tokens'][$key] == $refresh_token_string) {
					unset($_SESSION['consent_tokens'][$key]);
					unset($_SESSION['consent_refresh_tokens'][$key]);
					unset($_SESSION['consent_expires_at'][$key]);
				}
			}
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
			$token = $osrvc->getToken($this->clientModelScope);
			$_SESSION['client_token'] = $token->getAccessToken();
			$_SESSION['client_expires_at'] = (int) $token->getTokenExpiry();
			$_SESSION['client_refresh_token'] = $token->getRefreshToken();
			return $token;
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
				$refresh_token = isset($_SESSION['client_refresh_token']) ? $_SESSION['client_refresh_token'] : '';
				$expires_at = isset($_SESSION['client_expires_at']) ? (int) $_SESSION['client_expires_at'] : 0;
				$time_now = getdate()[0];
				$expires_in = $expires_at - $time_now  - $this->reduce_token_expiry_by;
				$token = new OAuthToken(
					$session_token,
					$expires_at,
					$refresh_token
				);
				// Check for token expiry and try refresh
				if ($expires_in < 0) {
					try {
						$token = $this->refreshClientToken($token);
					} catch (Exception $e) {
//						error_log('Error retrieving refresh token: ' . $e->getMessage());
						$token = $this->getClientCredentials();
					}
				}
//				error_Log(  "session client_token = " . $token->getAccessToken());
			} else {
				error_Log( "No valid client_token in Session so fetching new client_token");
				try {
					$token = $this->getClientCredentials();
				   	error_Log("fetched new client_token = " . $token->getAccessToken());
				} catch (Exception $e) {
					error_log('Error retrieving credentials: ' . $e->getMessage());
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
			if(isset($_SESSION['consent_tokens'][$scope]) && $_SESSION['consent_tokens'][$scope] <> '') {
				// error_Log( "Checking for client_token in Session");
				$session_token = $_SESSION['consent_tokens'][$scope];
				$expires_at = $_SESSION['consent_expires_at'][$scope];
				$refresh_token = $_SESSION['consent_refresh_tokens'][$scope];
				$token = new OAuthToken(
					$session_token,
					$expires_at,
					$refresh_token
				);		
				$time_now = getdate()[0];
				$expires_in = $expires_at - $time_now  - $this->reduce_token_expiry_by;
				if ($expires_in < 0) {
					// Try refresh token. If refresh fails, then return false.
					error_Log("refreshing the consent token for " . $scope);
					try {
						$token = $this->refreshConsentToken($token, $scope);
					} catch (Exception $e) {
						$token = null;
					}
				}
				// error_Log(  "session client_token = " . $token->getAccessToken());
			}
			return $token;
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

		public function parseAddress($address) {
			foreach ($this->addressPatterns as $key => $pattern ) {
				if (preg_match($this->addressPatterns[$key]['pattern'], $address)) {
					return $this->addressPatterns[$key]['prefix'] . preg_replace("/[\+\-]/", "", $address);
				}
			}
			return "";
		}
		
	}
?>