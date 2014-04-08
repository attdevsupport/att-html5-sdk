<?php
// Include codekit files
require_once __DIR__ . '/Html5_ServiceProvider_Base_Att.php';
require_once __DIR__ . '/../codekit.lib/Notary/NotaryService.php';
require_once __DIR__ . '/../codekit.lib/Notary/Notary.php';
require_once __DIR__ . '/../codekit.lib/Payment/PaymentService.php';

// use any namespaced classes
use Att\Api\Notary\NotaryService;
use Att\Api\Notary\Notary;
use Att\Api\Payment\PaymentService;

	/**
	 * The Payment_ServiceProvider class.
	 *
	 * This class provides reusable and extendable server code written in PHP. The SDK server takes requests from the client side Att.Provider 
	 * object and maps them to the corresponding server side method which takes care of sending the requests to the AT&T API Platform.
	 *
	 * You can create an instance directly like this:
	 *
	 *      $payment_provider = new Payment_ServiceProvider(array(
	 *          "AppKey"            => "XXXXXX",
	 *          "Secret" 	        => "XXXXXX",
	 *          "localServer"       => "http://127.0.0.1:8888",
	 *          "apiHost"           => "https://api.att.com",
	 *          "clientModelScope"  => "ADS"
	 *      ));
	 *
	 *
	 * @class Payment_ServiceProvider
	 * @extends Html5_ServiceProvider_Base_Att
	 *
	 * @cfg {string} AppKey The AppKey generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} Secret The Secret generated when creating an app in the AT&T Dev Connect portal.
	 * @cfg {string} localServer The url of the locally running server that is used to build the callback urls.
	 * @cfg {string} apiHost The url endpoint through which all AT&T API requests are made.
	 * @cfg {string} clientModelScope The list of scopes that the application wants to gain access to when making API calls that use Autonomous Client.
	 */
	class Payment_ServiceProvider extends Html5_ServiceProvider_Base_Att {

		public function __construct($config) {
			parent::__construct($config);
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
			$notarySrvc = new NotaryService($this->base_url, $this->client_id, $this->client_secret);
			return $notarySrvc->getNotary($toSign, true);
		}

		/**
		 * Returns the URL to the consent flow page for creating a new transaction.
		 *
		 * @param string $FQDN     fully qualified domain name
		 * @param string $clientId client id
		 * @param {json} $payload  A json array of payment parameters to send to Notary
		 *
		 * @return {string} New transaction URL as json string
		 */
		public function newTransaction($json_payload) {
			$codekit_payload = json_encode($this->createSinglePaymentDescription(
				$json_payload->amount, $json_payload->category, $json_payload->desc, 
				$json_payload->merch_prod_id, $json_payload->merch_trans_id, $json_payload->redirect_uri
				));
			//echo var_dump($codekit_payload); exit;
			$notarySrvc = new NotaryService($this->base_url, $this->client_id, $this->client_secret);
			$notarized = $notarySrvc->getNotary($codekit_payload);
			$url = PaymentService::newTransaction($this->base_url, $this->client_id, $notarized, true);
			return '{ "url": "'.$url.'" }';
		}

		/**
		 * Returns the URL to the consent flow page for creating a new subscription.
		 *
		 * @param string $FQDN     fully qualified domain name
		 * @param string $clientId client id
		 * @param {json} $payload   A json array of payment parameters to send to Notary
		 *
		 * @return {string} New subcription URL as json string
		 */
		public function newSubscription($json_payload) {
			$codekit_payload = json_encode($this->createSubscriptionPaymentDescription(
				$json_payload->amount, $json_payload->category, $json_payload->desc, 
				$json_payload->merch_prod_id, $json_payload->merch_trans_id, $json_payload->redirect_uri,
				$json_payload->merch_sub_id_list, $json_payload->sub_recurrences
				));
			//createSubscriptionPaymentDescription($amount, $category, $paymentDescription, $productDescription, $merchantTransactionId, $paymentRedirectUrl, $merchantSubscriptionIdList, $freePeriods)	
			$notarySrvc = new NotaryService($this->base_url, $this->client_id, $this->client_secret);
			$notarized = $notarySrvc->getNotary($codekit_payload);
			$url = PaymentService::newSubscription($this->base_url, $this->client_id, $notarized, true);
			return '{ "url": "'.$url.'" }';
		}

		/**
		 * Queries the status of a transaction
		 *
		 * @param {string} type search field: [ TransactionId | MerchantTransactionId | TransactionAuthCode ]
		 * @param {string} value transaction search value  
		 *
		 * @return {Response} Returns Response object
		 *
		 * @method transactionStatus
		 */
		public function transactionStatus($type, $value) {
			$token = $this->getCurrentClientToken();
			$paymentSrvc = new PaymentService($this->base_url, $token);
			//return "Type:".$type." Value:".$value;
			return $paymentSrvc->getTransactionStatus($type, $value, true);
		}

		/**
		 * Queries the status of a subscription
		 *
		 * @param {string} type subscription search field: [ SubscriptionId | MerchantTransactionId | SubscriptionAuthCode ]
		 * @param {string} value subscription search value  
		 *
		 * @return {Response} Returns Response object
		 *
		 * @method subscriptionStatus
		 */
		public function subscriptionStatus($type, $value) {
			$token = $this->getCurrentClientToken();
			$paymentSrvc = new PaymentService($this->base_url, $token);
			return $paymentSrvc->getSubscriptionStatus($type, $value, true);
		}

		/**
		 * Sends an API request for getting details about a subscription.
		 * 
		 * @method getSubscriptionDetails
		 * 
		 * @param {string} $merchantId merchant subscription id
		 * @param {string} $consumerId  consumer id 
		 *
		 * @return json api response
		 * @throws ServiceException if api request was not successful
		 */
		public function getSubscriptionDetails($merchantSubscriptionId, $consumerId) {
			$token = $this->getCurrentClientToken();
			$paymentSrvc = new PaymentService($this->base_url, $token);
			return $paymentSrvc->getSubscriptionDetails($merchantSubscriptionId, $consumerId, true);
		}
		
		/**
		 * Sends an API request for refunding a transaction.
		 *
		 * @method refundTransaction
		 * 
		 * @param {string} $transId    transaction id
		 * @param {string} $reasonTxt  reason for refunding 
		 * @param {int}    $reasonCode reason code for refunding
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if api request was not successful
		 */
		public function refundTransaction($transId, $reasonTxt, $reasonCode) {
			$token = $this->getCurrentClientToken();
			$paymentSrvc = new PaymentService($this->base_url, $token);
			return $paymentSrvc->refundTransaction($transId, $reasonTxt, $reasonCode, true);
		}

		
		/**
		 * Sends an API request to cancel a subscription.
		 *
		 * @method cancelSubscription
		 * 
		 * @param {string} $subId    subscription id
		 * @param {string} $reasonTxt  reason for refunding 
		 * @param {int}    $reasonCode reason code for refunding
		 *
		 * @return {Response} Returns Response object
		 * @throws ServiceException if api request was not successful
		 */
		public function cancelSubscription($subId, $reasonTxt, $reasonCode) {
			$token = $this->getCurrentClientToken();
			$paymentSrvc = new PaymentService($this->base_url, $token);
			return $paymentSrvc->cancelSubscription($subId, $reasonTxt, $reasonCode, true);
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
  		 * @param {integer} sub_recurrences Number of recurrence 
  		 *
  		 * @return {object} Returns an object of the payment parameters.
    	 */
		public function createSubscriptionPaymentDescription($amount, $category, $paymentDescription, $productDescription, $merchantTransactionId, $paymentRedirectUrl, $merchantSubscriptionIdList, $sub_recurrences) {
	       	$payment = $this->createSinglePaymentDescription($amount,$category,$paymentDescription,$productDescription,$merchantTransactionId,$paymentRedirectUrl);
    	   	$payment->MerchantSubscriptionIdList = $merchantSubscriptionIdList;
       		$payment->SubscriptionRecurrences = $sub_recurrences;
       		$payment->SubscriptionPeriod = "MONTHLY";
       		$payment->SubscriptionPeriodAmount = 1;
       		$payment->IsPurchaseOnNoActiveSubscription = false;
       		//$payment->FreePeriods = $freePeriods;
       		return $payment;
		}
	}
?>