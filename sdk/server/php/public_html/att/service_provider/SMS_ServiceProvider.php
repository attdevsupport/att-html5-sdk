<?php
// Include codekit files
require_once __DIR__ . '/Html5_ServiceProvider_Base_Att.php';
require_once __DIR__ . '/../codekit.lib/SMS/SMSService.php';

// use any namespaced classes
use Att\Api\SMS\SMSService;

	/**
	 * The SMS_ServiceProvider class.
	 *
	 * This class provides reusable and extendable server code written in PHP. The SDK server takes requests from the client side Att.Provider 
	 * object and maps them to the corresponding server side method which takes care of sending the requests to the AT&T API Platform.
	 *
	 * You can create an instance directly like this:
	 *
	 *      $sms_provider = new SMS_ServiceProvider(array(
	 *          "AppKey"            => "XXXXXX",
	 *          "Secret" 	        => "XXXXXX",
	 *          "localServer"       => "http://127.0.0.1:8888",
	 *          "apiHost"           => "https://api.att.com",
	 *          "clientModelScope"  => "ADS"
	 *      ));
	 *
	 *
	 * @class SMS_ServiceProvider
	 * @extends Html5_ServiceProvider_Base_Att
	 *
	 * @cfg {string} AppKey The AppKey generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} Secret The Secret generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} localServer The url of the locally running server that is used to build the callback urls.
	 * @cfg {string} apiHost The url endpoint through which all AT&T API requests are made.
	 * @cfg {string} clientModelScope The list of scopes that the application wants to gain access to when making API calls that use Autonomous Client.
	 */
	class SMS_ServiceProvider extends Html5_ServiceProvider_Base_Att {

		public function __construct($config) {
			parent::__construct($config);
		}

		/**
		 * Sends an SMS to a recipient
		 *
		 * @method sendSms
		 *
		 * @param {string} address Wireless number of the recipient(s). Can contain comma separated list for multiple recipients.
		 * @param {string} message The text of the message to send
		 *
		 * @return {Response} Returns Response object 
		 * @throws ServiceException if API request was not successful.
		 */
		public function sendSms($address, $message) {
			$token = $this->getCurrentClientToken();
			$smsSrvc = new SMSService($this->base_url, $token);

			if (strstr($address, ",")) {
				// If it's csv, split and iterate over each value prepending each value with "tel:"
				$address = explode(",", $address);
				foreach ($address as $key => $value) {
					$address[$key] = $this->parseAddress($value);
				}
			} else {
				$address = $this->parseAddress($address); 
			}
			
			return $smsSrvc->sendSMS($address, $message, false, true);
		}

		/**
		 * Check the status of a sent SMS
		 *
		 * @method smsStatus
		 *
		 * @param {string} smsId The unique SMS ID as retrieved from the response of the sendSms method
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function smsStatus($smsId) {
			$token = $this->getCurrentClientToken();
			$smsSrvc = new SMSService($this->base_url, $token);

			return $smsSrvc->getSMSDeliveryStatus($smsId, true);
		}

		/**
		 * Retrieves a list of SMSs sent to the application's short code
		 *
		 * @method getSms
		 *
		 * @param {string} registrationId The registrationId to receive messages from.
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if API request was not successful.
		 */
		public function getSms($registrationId) {
			$token = $this->getCurrentClientToken();
			$smsSrvc = new SMSService($this->base_url, $token);

			return $smsSrvc->getMessages($registrationId, true);
		}
	}
?>