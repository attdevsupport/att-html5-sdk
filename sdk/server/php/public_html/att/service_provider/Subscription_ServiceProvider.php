<?php
// Include codekit files
require_once __DIR__ . '/Html5_ServiceProvider_Base_Att.php';
require_once __DIR__ . '/../codekit.lib/Webhooks/WebhooksService.php';

// use any namespaced classes
use Att\Api\Webhooks\WebhooksService;

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
	class Subscription_ServiceProvider extends Html5_ServiceProvider_Base_Att {

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
		public function createSubscription($phoneNumber, $events, $callbackData, $expiresIn) {
			$token = $this->getSessionConsentToken('MIM');
			$webhooksSrvc = new WebhooksService($this->base_url, $token);
            $createArgs = new CreateSubscriptionArgs($channelId, $events, $callbackData, $expiresIn);
            $rsp = $webhooksSrvc->createNotificationSubscription($createArgs);
            $this->SubscriptionIdStore->put($phoneNumber, $rsp->getSubscription()->getSubscriptionId());
        }
	}
?>