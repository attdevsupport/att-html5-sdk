<?php
require_once("config.php");
require_once("service_provider/DC_ServiceProvider.php");

try {
	$response = "Invalid API Call";

	list($blank, $operation) = split('[/]', $_SERVER['PATH_INFO']);
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
	return_json_error($se->getErrorCode(), $se->getErrorResponse());
}
catch(Exception $e) {
	return_json_error(400, $e->getMessage());
}

?>
