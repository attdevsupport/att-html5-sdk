<?php
require_once("config.php");
header("Content-Type:application/json");

try {
	$response = "Invalid API Call";
	// Get OAuth token
	$token = $html5_provider->getSessionConsentToken('IMMN');	
	// Debug::init();Debug::write("\nLine:".__LINE__.": File: ".__FILE__.". Token: ".var_dump($token));Debug::end();
	//echo var_dump($token);

	list($blank, $version, $messages, $operation, $data) = split('[/]', $_SERVER['PATH_INFO']);
	switch ($operation) {
		case "getMessageList":
			// Get OAuth token
			$token = $html5_provider->getSessionConsentToken('MIM');
			//echo var_dump($token);
			$headerCount = isset($_GET['headerCount']) ? $_GET['headerCount'] : '1';
			$indexCursor = isset($_GET['indexCursor']) ? $_GET['indexCursor'] : '';
			$response = $html5_provider->getMessageHeaders($token, $headerCount, $indexCursor);
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
