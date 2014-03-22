<?php
require_once("config.php");
require_once("service_provider/ADS_ServiceProvider.php");
require_once("service_provider/Payment_ServiceProvider.php");

try {
	$response = "Invalid API Call";	
	$operation = 'unknown';
	$type = '';
	$transactionId = '';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	$request_method = strtoupper($_SERVER['REQUEST_METHOD']);
	switch(count($params)) {
		case 3:
			if (strtolower($params[2]) == 'ads') {
				$operation = 'getAdvertisement';
			}
			break;
		case 5:
			if (strtolower($params[2]) == 'commerce') {
				switch(strtolower($params[4])) {
					case 'transactions':
						if ($request_method == 'POST') {
							$operation = 'newTransaction';
						} else if ($request_method == 'PUT') {
							if (isset($_GET['state'])) {
								$state = strtolower(urldecode($_GET['state']));
								if ($state == 'refunded') {
									$operation = 'refundTransaction';
								} else if ($state == 'subscriptioncancelled') {
									$operation = 'cancelSubscription';
								}
							} else {
								$operation = 'refundTransaction';
							}
						}
						break;
					case 'subscriptions':
						if ($request_method == 'POST') {
							$operation = 'newSubscription';
						} else if ($request_method == 'PUT') {
							$operation = 'cancelSubscription';
						}
						break;
				}
			}
			break;
		case 6:
			if (strtolower($params[2]) == 'commerce') {
				$transactionId = $params[5];
				switch(strtolower($params[4])) {
					case 'transactions':
						$operation = 'transactionStatus';	
						$type = 'TransactionId';
						break;
					case 'subscriptions':
						$operation = 'subscriptionStatus';	
						$type = 'SubscriptionId';
						break;
				}
			}
			break;
		case 7:
			if (strtolower($params[2]) == 'commerce') {
				$type = $params[5];
				$transactionId = $params[6];
				if (strtolower($params[4]) == 'transactions') {
					$operation = 'transactionStatus';
				} else if (strtolower($params[4]) == 'subscriptions') {
					$operation = 'subscriptionStatus';
				}
			}
			break;
		case 8:
			// /rest.php/3/Commerce/Payment/Subscriptions/{{MerchantSubscriptionId}}/Detail/{{ConsumerId}
			if (strtolower($params[2]) == 'commerce') {
				$type = $params[5];
				$transactionId = $params[7];
				if (strtolower($params[4]) == 'subscriptions' && strtolower($params[6]) == 'detail') {
					$operation = 'getSubscriptionDetails';
				}
			}
			break;
	}
	//echo "OPERATION=".$operation."\n".var_dump($params); exit;
	switch ($operation) {
		case "getAdvertisement":
			if (isset($_GET['Category'])) {
				$category = urldecode($_GET['Category']);
				$udid = isset($_GET['Udid']) ? urldecode($_GET['Udid']) : 'HTML5 SDK Sample ID providing a short-term unique advertising identity for the user';
				$userAgent = isset($_GET['UserAgent']) ? urldecode($_GET['UserAgent']) : $_SERVER['HTTP_USER_AGENT'];
				//$optJson = isset($_GET['opts']) ? json_decode(urldecode($_GET['opts'])) : null;
				//echo var_dump($_REQUEST); exit;
				$ads_provider = new ADS_ServiceProvider($config);
				$response = $ads_provider->getAdvertisement($category, $udid, $userAgent, $_GET);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"category querystring parameters must be specified\"}";
			}
			break;
		case "newTransaction":
			if (file_get_contents('php://input') != null) {
				$json = json_decode(file_get_contents('php://input'));
				//echo var_dump($params)."\n".var_dump($json); exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->newTransaction($json);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"payload parameter must be posted\"}";
			}
			break;
		case "newSubscription":
			if (file_get_contents('php://input') != null) {
				$json = json_decode(file_get_contents('php://input'));
				//echo var_dump($params)."\n".var_dump($json); exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->newSubscription($json);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"payload parameter must be posted\"}";
			}
			break;
		case "transactionStatus":
			if ($request_method == "GET") {
				//echo var_dump($params)."\n".$type."---Id---".$transactionId; exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->transactionStatus($type, $transactionId);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"invalid request method for transactionStatus\"}";
			}
			break;
		case "subscriptionStatus":
			if ($request_method == "GET") {
				//echo var_dump($params)."\n"; exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->subscriptionStatus($type, $transactionId);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"invalid request method for subscriptionStatus\"}";
			}
			break;
		case "getSubscriptionDetails":
			if ($request_method == "GET") {
				//echo var_dump($params)."\n".$type."---Id---".$transactionId; exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->getSubscriptionDetails($type, $transactionId);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"invalid request method for getSubscriptionDetails\"}";
			}
			break;
		case "refundTransaction":
			if (isset($_GET['transactionId']) && isset($_GET['reasonText'])) {
				$transactionId = urldecode($_GET['transactionId']);
				$reasonText = urldecode($_GET['reasonText']);
				$reasonId = isset($_GET['reasonId']) ? urldecode($_GET['reasonId']) : '1';
				//echo var_dump($_REQUEST); exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->refundTransaction($transactionId, $reasonText, $reasonId);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"transactionId and reasonText querystring parameters must be specified\"}";
			}
			break;		
		case "cancelSubscription":
			if (isset($_GET['transactionId']) && isset($_GET['reasonText'])) {
				$transactionId = urldecode($_GET['transactionId']);
				$reasonText = urldecode($_GET['reasonText']);
				$reasonId = isset($_GET['reasonId']) ? urldecode($_GET['reasonId']) : '1';
				//echo var_dump($_REQUEST); exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->refundTransaction($transactionId, $reasonText, $reasonId);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"transactionId and reasonText querystring parameters must be specified\"}";
			}
			break;		
		default:
			$response = 'Invalid API Call - operation ' . $operation . ' is not supported. PATH_INFO: ' . var_dump($_SERVER['PATH_INFO']);
	}
	if (DEBUG) {
		Debug::init();
		$objDateTime = new DateTime('NOW');
		$now = $objDateTime->format('c');
		Debug::write("$now : $operation : $response");
		Debug::end();
	}
	header("Content-Type:application/json");
	echo $response;
}
catch(ServiceException $se) {
	http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	echo('ServiceException: ErrorCode: '.$se->getErrorCode().'. Response: ' . $se->_errorResponse());
}
catch(Exception $e) {
	http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	echo('Exception: '.$e->getMessage());
}

?>
