<?php
require_once("config.php");
require_once("service_provider/SMS_ServiceProvider.php");

try {
	$response = "Invalid API Call";
	$operation = 'unknown';
	$registrationId = '';
	$imagefile = '';
	$sms_provider = new SMS_ServiceProvider($config);	
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	switch(count($params)) {
		case 5:
			switch ($params[3]) {
				case "outbox":
					$registrationId = $params[4];
					$operation = 'smsStatus';
					break;
				case "inbox":
					$registrationId = $params[4];
					$operation = 'getSms';
					break;
			}
			break;
		case 4:
			switch ($params[3]) {
				case "outbox":
					$operation = 'sendSms';
					break;
			}
			break;
		case 2:
			if ($params[1] == 'votegetter') {
				$operation = 'votegetter';
			}
			break;
	}
	switch ($operation) {
		case "sendSms":
			if (isset($_GET['addresses']) && isset($_GET['message'])) {
				$addresses = $_GET['addresses'];
				$message = $_GET['message'];
				$response = $sms_provider->sendSms($addresses, $message);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"addresses and message querystring parameters must be specified\"}";
			}
			break;
		case "smsStatus":
			$response = $sms_provider->smsStatus($registrationId);
			break;
		case "getSms":
			$response = $sms_provider->getSms($registrationId);
			break;
		case "votegetter":
			$voteFile 		= __DIR__  . "/votes.json";
			if (file_exists($voteFile)) {
				$response 	= file_get_contents($voteFile);
			}
			else {
				$response = '{"success":true,"total":0,"data":[{"sport":"Football","votes":0},{"sport":"Baseball","votes":0},{"sport":"Basketball","votes":0}]}';
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
