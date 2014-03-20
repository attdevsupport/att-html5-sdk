<?php
require_once("config.php");
require_once("service_provider/ADS_ServiceProvider.php");
require_once("service_provider/Payment_ServiceProvider.php");

try {
	$response = "Invalid API Call";	
	$operation = 'unknown';
	$type = '';
	$transactionId = '';
	$imagefile = '';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	$request_method = $_SERVER['REQUEST_METHOD'];
	switch(count($params)) {
		case 2:
			if (strtolower($params[1]) == 'ads') {
				$operation = 'getAdvertisement';
			}
			break;
		case 5:
			if (strtolower($params[2]) == 'commerce') {
				$operation = 'newTransaction';				
			}
			break;
		case 6:
			if (strtolower($params[2]) == 'commerce') {
				$operation = 'transactionStatus';	
				$transactionId = $params[5];
				$type = 'TransactionId';
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
	}
	//echo "OPERATION=".$operation."\n".var_dump($params); exit;
	switch ($operation) {
		case "getAdvertisement":
			if (isset($_GET['Category'])) {
				$category = urldecode($_GET['Category']);
				$udid = isset($_GET['Udid']) ? urldecode($_GET['Udid']) : 'HTML5 SDK Sample ID providing a short-term unique advertising identity for the user';
				$userAgent = isset($_GET['UserAgent']) ? urldecode($_GET['UserAgent']) : $_SERVER['HTTP_USER_AGENT'];
				$optJson = isset($_GET['opts']) ? json_decode(urldecode($_GET['opts'])) : null;
				//echo var_dump($_REQUEST); exit;
				$ads_provider = new ADS_ServiceProvider($config);
				$response = $ads_provider->getAdvertisement($category, $udid, $userAgent, $optJson);
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
				return $response;
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"payload parameter must be posted\"}";
			}
			break;
		case "transactionStatus":
			if (strtoupper($request_method) == "GET") {
				//echo var_dump($params)."\n".$type."---Id---".$transactionId; exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->transactionStatus($type, $transactionId);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"invalid request method for transactionStatus\"}";
			}
			break;
		case "subscriptionStatus":
			if (strtoupper($request_method) == "GET") {
				echo var_dump($params)."\n"; exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->subscriptionStatus($type, $transactionId);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"invalid request method for subscriptionStatus\"}";
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
