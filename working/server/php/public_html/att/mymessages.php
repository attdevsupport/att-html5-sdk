<?php
require_once("config.php");
header("Content-Type:application/json");

try {
	$response = "Invalid API Call";
	$operation = 'unknown';
	$idParam = '';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	switch(count($params)) {
		case 5:
			$operation = $params[3];
			switch ($params[3]) { // placeholder for future code
				case "outbox":
					$idParam = $params[4];
					$operation = 'smsStatus';
					break;
				case "inbox":
					$idParam = $params[4];
					$operation = 'getSms';
					break;
			}
			break;
		case 4:
			$operation = $params[3];
			break;
	}
	switch ($operation) {
		case "getMessageList":
			$headerCount = isset($_GET['headerCount']) ? $_GET['headerCount'] : '1';
			$indexCursor = isset($_GET['indexCursor']) ? $_GET['indexCursor'] : '';
			$response = $html5_provider->getMessageHeaders($headerCount, $indexCursor);
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
	echo $response;
}
catch(ServiceException $se) {
	//http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	header('X-PHP-Response-Code: 400'); // Set response code to 400 - Bad Request in case of all exceptions
	echo('ServiceException: ErrorCode: '.$se->getErrorCode().'. Response: ' . $se->_errorResponse());
}
catch(Exception $e) {
	//http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	header('X-PHP-Response-Code: 400'); // Set response code to 400 - Bad Request in case of all exceptions
	echo('Exception: '.$e->getMessage());
}

?>
