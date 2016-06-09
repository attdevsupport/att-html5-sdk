<?php
// Include codekit files
require_once __DIR__ . '/Html5_ServiceProvider_Base_Att.php';
require_once __DIR__ . '/../codekit.lib/Webhooks/WebhooksService.php';

// use any namespaced classes
use Att\Api\Srvc\ServiceException;
use Att\Api\Webhooks\Channel;
use Att\Api\Webhooks\CreateSubscriptionArgs;
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
     *          "Secret"            => "XXXXXX",
     *          "localServer"       => "http://127.0.0.1:8888",
     *          "apiHost"           => "https://api.att.com",
     *          "clientModelScope"  => "NOTIFICATIONCHANNEL"
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
    class Notification_ServiceProvider extends Html5_ServiceProvider_Base_Att {

        public function __construct($config) {
            parent::__construct($config);
        }

        /**
         * Creates a subscription, which generates notification messages from
         * AT&T to the configured endpoint.
         *
         * @method createSubscription
         *
         * @param {array} events array containing "TEXT", "MMS", or both.
         * @param {string} callbackData to be returned with any requested notifications.
         * @param {number} expiresIn seconds until the subscription expires.
         *
         * @return {string} JSON description of created subscription.
         * @throws ServiceException if API request was not successful.
         */
        public function createSubscription($events, $callbackData, $expiresIn) {
            $token = $this->getSessionConsentToken('MIM');
            $webhooksSrvc = new WebhooksService($this->base_url, $token);
            $channelId = $this->getChannelId();
            $createArgs = new CreateSubscriptionArgs($channelId, $events, $callbackData, $expiresIn);
            return $webhooksSrvc->createNotificationSubscription($createArgs);
        }
        
        /**
         * Get details of a subscription.
         *
         * @method getSubscription
         *
         * @param {string} subscriptionId of the requested subscription.
         *
         * @return {string} JSON details of the requested subscription.
         * @throws ServiceException if API request was not successful.
         */
        public function getSubscription($subscriptionId) {
            $token = $this->getSessionConsentToken('MIM');
            $webhooksSrvc = new WebhooksService($this->base_url, $token);
            $channelId = $this->getChannelId();
            return $webhooksSrvc->getNotificationSubscription($channelId, $subscriptionId);
        }
     
        /**
         * Updates an existing subscription.
         *
         * @method updateSubscription
         *
         * @param {string} subscriptionId to be returned with any requested notifications.
         * @param {array} events array containing "TEXT", "MMS", or both.
         * @param {string} callbackData to be returned with any requested notifications.
         * @param {number} expiresIn seconds until the subscription expires.
         *
         * @return {string} JSON description of the updated subscription.
         * @throws ServiceException if API request was not successful.
         */
        public function updateSubscription($subscriptionId, $events, $callbackData, $expiresIn) {
            $token = $this->getSessionConsentToken('MIM');
            $webhooksSrvc = new WebhooksService($this->base_url, $token);
            $channelId = $this->getChannelId();
            $updateArgs = new UpdateSubscriptionArgs($channelId, $subscriptionId, $events, $callbackData, $expiresIn);
            return $webhooksSrvc->updateNotificationSubscription($updateArgs);
        }
     
        /**
         * Delete a subscription.
         *
         * @method deleteSubscription
         *
         * @param {string} subscriptionId of the subscription to be deleted.
         *
         * @throws ServiceException if API request was not successful.
         */
        public function deleteSubscription($subscriptionId) {
            $token = $this->getCurrentClientToken();
            $webhooksSrvc = new WebhooksService($this->base_url, $token);
            $channelId = $this->getChannelId();
            return $webhooksSrvc->deleteNotificationSubscription($channelId, $subscriptionId);
        }
        
        private function getChannelId() {
            if ($this->channel_id != "") {
                return $this->channel_id;
            }
            $token = $this->getCurrentClientToken();
            $webhooksSrvc = new WebhooksService($this->base_url, $token);
            $channel = new Channel("MIM", "application/json", 1);
            $rsp = null;
            try {
                $rsp = $webhooksSrvc->createNotificationChannel($channel);
                $this->channel_id = $rsp->getChannel()->getChannelId();
                return $this->channel_id;
            }
            catch (ServiceException $ex) {
                $exObjectParts = explode(":4", $ex->getMessage());
                $exObject = json_decode($exObjectParts[0]);
                if (   isset($exObject->RequestError)
                    && isset($exObject->RequestError->MessageId)
                    && $exObject->RequestError->MessageId == "POL1001") 
                {
                    $this->channel_id = explode(":", $exObject->RequestError->Variables)[1];
                    return $this->channel_id;
                }
                throw $ex;
            }
        }
    }
?>