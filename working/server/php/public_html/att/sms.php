<?php
require_once("config.php");

try {
	$response = "Invalid API Call";
	
	// Get OAuth token
	$token = $html5_provider->getCurrentClientToken();

	list($blank, $version, $messaging, $operation, $data) = split('[/]', $_SERVER['PATH_INFO']);
	switch ($operation) {
		case "outbox":
			if (count($data) > 0) {
				$response = $html5_provider->smsStatus($token, $data);
			} else {
				$addresses = isset($_GET['addresses']) ? $_GET['addresses'] : null;
				$message = isset($_GET['message']) ? $_GET['message'] : null;
				$response = $html5_provider->sendSms($token, $addresses, $message);
			}
			break;
		case "inbox":
			$response = $html5_provider->getSms($token, $data);
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
