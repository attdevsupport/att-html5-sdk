<?php
require_once("config.php");
require_once("service_provider/DC_ServiceProvider.php");

try {
	$response = "Invalid API Call";

	list($blank, $Devices, $operation) = split('[/]', $_SERVER['PATH_INFO']);
	$dc_provider = new DC_ServiceProvider($config);	
	switch (strtolower($operation)) {
		case "info":
			$response = $dc_provider->deviceInfo();
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
