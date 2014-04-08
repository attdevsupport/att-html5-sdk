<?php
require_once("config.php");
require_once("service_provider/Payment_ServiceProvider.php");

try {
	$response = "Invalid API Call";
	$operation = 'unknown';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	// /Notary/Rest/1/SignedPayload
	switch(count($params)) {
		case 5:
			switch ($params[4]) {
				case "SignedPayload":
					$registrationId = $params[4];
					$operation = 'SignedPayload';
					break;
			}
			break;
	}
	//echo "OPERATION=".$operation."\n".var_dump($params); exit;
	switch ($operation) {
		case "SignedPayload":
			if (file_get_contents('php://input') != null) {
				$payload = file_get_contents('php://input');
				//echo var_dump($params)."\n".var_dump($payload); exit;
				$payment_provider = new Payment_ServiceProvider($config);
				$response = $payment_provider->signPayload($payload);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"payload parameter must be posted\"}";
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
	return_json_error($se->getErrorCode(), $se->getErrorResponse());
}
catch(Exception $e) {
	return_json_error(400, $e->getMessage());
}

?>
