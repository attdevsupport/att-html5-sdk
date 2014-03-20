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
			$notarySrvc = new NotaryService($this->base_url, $this->client_id, $this->client_secret);
			return $notarySrvc->getNotary($toSign, true);
		}

		/**
		 * Returns the URL to the consent flow page for creating a new transaction.
		 *
		 * @param string $FQDN     fully qualified domain name
		 * @param string $clientId client id
		 * @param {json} $payload   A json array of payment parameters to send to Notary
		 *
		 * @return {string} New transaction URL as json string
		 */
		public function newTransaction($json_payload) {
			//$token = $this->getCurrentClientToken();
			$notarySrvc = new NotaryService($this->base_url, $this->client_id, $this->client_secret);
			$notarized = $notarySrvc->getNotary(json_encode($json_payload));
			$url = PaymentService::newTransaction($this->base_url, $this->client_id, $notarized, true);
			return '{ url: "'.$url.'" }';
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
			//$token = $this->getCurrentClientToken();
			$notarySrvc = new NotaryService($this->base_url, $this->client_id, $this->client_secret);
			$notarized = $notarySrvc->getNotary(json_encode($json_payload));
			$url = PaymentService::newSubscription($this->base_url, $this->client_id, $notarized, true);
			return '{ url: "'.$url.'" }';
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
	}
?>