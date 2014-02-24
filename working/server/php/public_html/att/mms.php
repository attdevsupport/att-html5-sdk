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
				$response = $html5_provider->mmsStatus($token, $data);
			} else {
				$addresses = isset($_GET['addresses']) ? $_GET['addresses'] : null;
				$subject = isset($_GET['message']) ? $_GET['message'] : null;
				$fileId = isset($_GET['fileId']) ? $_GET['fileId'] : null;
				$priority = isset($_GET['priority']) ? $_GET['priority'] : null;
				$fileId = __DIR__ . '/' . $fileId; // Assumes that just one filename is sent. TO-DO parse comma separated file names.
				$files = explode(',', $fileId);
				$response = $html5_provider->sendMms($token, $addresses, $files, $subject, $priority);
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
