<?php
require_once("config.php");

try {
	$response = "Invalid API Call";	
	$operation = 'unknown';
	$registrationId = '';
	$imagefile = '';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	switch(count($params)) {
		case 3:
			if ($params[2] == 'ads') {
				$operation = 'getAdvertisement';
			}
			break;
	}

	switch ($operation) {
		case "getAdvertisement":
			if (isset($_GET['Category']) || isset($_POST['category'])) {
				$category = isset($_GET['Category']) ? $_GET['Category'] : $_POST['category'];
				$udid = $config['ads_udid'];
				echo var_dump($_REQUEST); exit;
				$response = $html5_provider->getAdvertisement($category, $udid);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"category querystring parameters must be specified\"}";
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
