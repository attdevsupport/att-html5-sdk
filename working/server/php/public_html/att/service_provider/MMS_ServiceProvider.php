<?php
// Include codekit files
require_once __DIR__ . '/Html5_ServiceProvider_Base_Att.php';
require_once __DIR__ . '/../codekit.lib/MMS/MMSService.php';

// use any namespaced classes
use Att\Api\MMS\MMSService;

	/**
	 * The MMS_ServiceProvider class.
	 *
	 * This class provides reusable and extendable server code written in PHP. The SDK server takes requests from the client side Att.Provider 
	 * object and maps them to the corresponding server side method which takes care of sending the requests to the AT&T API Platform.
	 *
	 * You can create an instance directly like this:
	 *
	 *      $mms_provider = new MMS_ServiceProvider(array(
	 *          "AppKey"            => "XXXXXX",
	 *          "Secret" 	        => "XXXXXX",
	 *          "localServer"       => "http://127.0.0.1:8888",
	 *          "apiHost"           => "https://api.att.com",
	 *          "clientModelScope"  => "ADS"
	 *      ));
	 *
	 *
	 * @class MMS_ServiceProvider
	 * @extends Html5_ServiceProvider_Base_Att
	 *
	 * @cfg {string} AppKey The AppKey generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} Secret The Secret generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} localServer The url of the locally running server that is used to build the callback urls.
	 * @cfg {string} apiHost The url endpoint through which all AT&T API requests are made.
	 * @cfg {string} clientModelScope The list of scopes that the application wants to gain access to when making API calls that use Autonomous Client.
	 */
	class MMS_ServiceProvider extends Html5_ServiceProvider_Base_Att {

		public function __construct($config) {
			parent::__construct($config);
		}

		/**
		 * Sends an MMS to a recipient
		 *
		 * MMS allows for the delivery of different file types. Please see the developer documentation for an updated list:
		 *  https://developer.att.com/apis/sms/docs
		 *
		 * @param {string} $address (tel) Comma separated list of wireless numbers of the recipients
		 * @param {string} $files The path and name of the files
		 * @param {string|null} $subject The subject line for the MMS
		 * @param {string|null} $priority Can be "Default", "Low", "Normal" or "High"
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 * @method sendMms
		 */
		public function sendMms($address, $files, $subject, $priority) {
			$token = $this->getCurrentClientToken();			
			$mmsSrvc = new MMSService($this->base_url, $token);
			
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
			
			//return var_dump($files);

			return $mmsSrvc->sendMMS($address, $files, $subject, $priority, false, true);
		}

		/**
		 * Queries the status of a sent MMS
		 *
		 * @method mmsStatus
		 *
		 * @param {string} $mmsId The ID of the MMS as received in the returned data when sending an MMS
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function mmsStatus($mmsId) {
			$token = $this->getCurrentClientToken();
			$mmsSrvc = new MMSService($this->base_url, $token);
			return $mmsSrvc->getMMSStatus($mmsId, true);
		}
	}
?>