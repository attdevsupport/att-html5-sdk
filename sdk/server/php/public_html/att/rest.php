<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

try {
	if (!file_exists("service_provider/ADS_ServiceProvider.php")) throw new Exception ('service_provider/ADS_ServiceProvider.php does not exist'); 
	else require_once("service_provider/ADS_ServiceProvider.php");

	$response = "Invalid API Call";	
	$operation = 'unknown';
	$type = '';
	$transactionId = '';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	$request_method = strtoupper($_SERVER['REQUEST_METHOD']);
	switch(count($params)) {
		case 3:
			if (strtolower($params[2]) == 'ads') {
				$operation = 'getAdvertisement';
			}
			break;
	}
	//echo "OPERATION=".$operation."\n".var_dump($params); exit;
	switch ($operation) {
		case "getAdvertisement":
			if (isset($_GET['Category'])) {
				$category = urldecode($_GET['Category']);
				$udid = isset($_GET['Udid']) ? urldecode($_GET['Udid']) : 'HTML5 SDK Sample ID providing a short-term unique advertising identity for the user';
				$userAgent = isset($_GET['UserAgent']) ? urldecode($_GET['UserAgent']) : $_SERVER['HTTP_USER_AGENT'];
				//$optJson = isset($_GET['opts']) ? json_decode(urldecode($_GET['opts'])) : null;
				//echo var_dump($_REQUEST); exit;
				$ads_provider = new ADS_ServiceProvider($config);
				$response = $ads_provider->getAdvertisement($category, $udid, $userAgent, $_GET);
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
    switch ($se->getErrorCode()) {
    case 400: // invalid_grant. Invalid Refresh token.
    case 401: // UnAuthorized Access. Invalid access token.
        unset($_SESSION['client_token']);
        if (DEBUG) {
                Debug::init();
                Debug::write("Removed cached client token. Errocode=". $se->getErrorCode() ."\n");
                Debug::end();	
        }
        break;		
    }
    return_json_error($se->getErrorCode(), $se->getErrorResponse());
}
catch(Exception $e) {
    $error = $e->getMessage();
    // some operations in the codekit do not throw ServiceException
    if (stripos($error, 'UnAuthorized Request') !== false) {
        unset($_SESSION['client_token']);        
        if (DEBUG) {
                Debug::init();
                Debug::write("token removed.\n");
                Debug::end();	
        }
        return_json_error(401, "UnAuthorized Request. Try again to obtain a new access token.");
    } else {
        return_json_error(400, $error);
    }
}

?>
