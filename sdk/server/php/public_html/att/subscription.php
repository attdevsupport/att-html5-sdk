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
    if (!file_exists("service_provider/Subscription_ServiceProvider.php")) throw new Exception ('service_provider/Subscription_ServiceProvider.php does not exist'); 
    else require_once("service_provider/Subscription_ServiceProvider.php");

    $response = "Invalid API Call";
    $operation = 'unknown';
    $registrationId = '';
    $imagefile = '';
    $subscription_provider = new Subscription_ServiceProvider($config);
    
    $params = split('[/]', $_SERVER['PATH_INFO']);
	$request_method = strtoupper($_SERVER['REQUEST_METHOD']);
    $operation = 'createSubscription';
    
    /*
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
    */
    
    switch ($operation) {
        case "createSubscription":
            $response = $subscription_provider->createSubscription(["TEXT", "MMS"], "foo", 3600);
            http_response_code(200);
            header("Content-Type:application/json");
            echo $response;
            break;
        default:
            $response = 'Invalid API Call - operation ' . $operation . ' is not supported. PATH_INFO: ' . var_dump($_SERVER['PATH_INFO']);
            return_json_error(400, $response);
    }
    if (DEBUG) {
        Debug::init();
        $objDateTime = new DateTime('NOW');
        $now = $objDateTime->format('c');
        Debug::write("$now : $operation : $response");
        Debug::end();
    }
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
