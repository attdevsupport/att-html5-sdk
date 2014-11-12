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
	if (!file_exists("service_provider/DC_ServiceProvider.php")) throw new Exception ('service_provider/DC_ServiceProvider.php does not exist'); 
	else require_once("service_provider/DC_ServiceProvider.php");

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
