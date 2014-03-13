<?php
require_once("config.php");
require_once("service_provider/ADS_ServiceProvider.php");
require_once("service_provider/Payment_ServiceProvider.php");

try {
	$response = "Invalid API Call";	
	$operation = 'unknown';
	$transactionId = '';
	$imagefile = '';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	switch(count($params)) {
		case 3:
			if (strtolower($params[2]) == 'ads') {
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
			}
			break;
	}
	//echo "OPERATION=".$operation."\n".var_dump($params); exit;
	switch ($operation) {
		case "getAdvertisement":
			if (isset($_GET['Category']) || isset($_POST['category'])) {
				$category = isset($_GET['Category']) ? $_GET['Category'] : $_POST['category'];
				$udid = $config['ads_udid'];
				//echo var_dump($_REQUEST); exit;
				$ads_provider = new ADS_ServiceProvider($config);
				$response = $ads_provider->getAdvertisement($category, $udid);
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
				$response =  "{\"error\": \"paylod parameter must be posted\"}";
			}
			break;
		case "transactionStatus":
			if (strtoupper($request_method) == "GET") {
				echo var_dump($params)."\n"; exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->transactionStatus($transactionId);
				return $response;
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"invalid request method for transactionStatus\"}";
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
