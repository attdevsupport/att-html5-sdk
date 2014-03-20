<?php
// Include codekit files
require_once __DIR__ . '/Html5_ServiceProvider_Base_Att.php';
require_once __DIR__ . '/../codekit.lib/ADS/ADSService.php';
require_once __DIR__ . '/../codekit.lib/ADS/OptArgs.php';

// use any namespaced classes
use Att\Api\ADS\ADSService;
use Att\Api\ADS\OptArgs;

	/**
	 * The ADS_ServiceProvider class.
	 *
	 * This class provides reusable and extendable server code written in PHP. The SDK server takes requests from the client side Att.Provider 
	 * object and maps them to the corresponding server side method which takes care of sending the requests to the AT&T API Platform.
	 *
	 * You can create an instance directly like this:
	 *
	 *      $ads_provider = new ADS_ServiceProvider(array(
	 *          "AppKey"            => "XXXXXX",
	 *          "Secret" 	        => "XXXXXX",
	 *          "localServer"       => "http://127.0.0.1:8888",
	 *          "apiHost"           => "https://api.att.com",
	 *          "clientModelScope"  => "ADS"
	 *      ));
	 *
	 *
	 * @class ADS_ServiceProvider
	 * @extends Html5_ServiceProvider_Base_Att
	 *
	 * @cfg {string} AppKey The AppKey generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} Secret The Secret generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} localServer The url of the locally running server that is used to build the callback urls.
	 * @cfg {string} apiHost The url endpoint through which all AT&T API requests are made.
	 * @cfg {string} clientModelScope The list of scopes that the application wants to gain access to when making API calls that use Autonomous Client.
	 */
	class ADS_ServiceProvider extends Html5_ServiceProvider_Base_Att {

		public function __construct($config) {
			parent::__construct($config);
		}

		/**
		 * Sends a request to the API for getting an advertisement.
		 *
		 * @method getAdvertisement
		 *
		 * @param {string} $category 	category of the add requested.
		 * @param {string} $udid 		specifies a universally unique identifier, which must be at least 30 characters in length.
		 * @param {string} $userAgent	user agent string to send to API.
		 * @param {Object}  $optArgs 	any optional Key/Value JSON for API parameters.
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function getAdvertisement($category, $udid, $userAgent, $optJson) {
			$token = $this->getCurrentClientToken();
			$adsSrvc = new ADSService($this->base_url, $token);
			$optArgs = null;
			if ($optJson != null)
			{
				$keywords = array();
				$optArgs = new OptArgs();
				if (isset($optJson->AgeGroup)) {
					$optArgs->setAgeGroup($optJson->AgeGroup);
					$optArgs->addKeyword("AgeGroup");
				}
				if (isset($optJson->Gender)) {
					$optArgs->setGender($optJson->Gender);
					$optArgs->addKeyword("Gender");
				}
			}
			return $adsSrvc->getAdvertisement($category, $udid, $userAgent, $optArgs, true);
		}
	}
?>