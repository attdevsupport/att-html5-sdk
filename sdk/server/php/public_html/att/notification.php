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
    if (!file_exists("service_provider/Notification_ServiceProvider.php")) throw new Exception ('service_provider/Notification_ServiceProvider.php does not exist'); 
    else require_once("service_provider/Notification_ServiceProvider.php");

    $response = "Invalid API Call";
    $operation = 'unknown';
    $subscriptionId = '';
    $imagefile = '';
    $service_provider = new Notification_ServiceProvider($config);
    
    $params = split('[/]', $_SERVER['PATH_INFO']);
    $request_method = strtoupper($_SERVER['REQUEST_METHOD']);
    error_Log(count($params));
    error_Log($request_method);
    error_Log($params[0]);
    error_Log($params[1]);
    error_Log($params[2]);
    switch(count($params)) {
        case 4: // notification/v1/subscriptions/some-subscription-id
            switch ($request_method) {
                case "DELETE":
                    $subscriptionId = $params[3];
                    $operation = 'deleteSubscription';
                    break;
            }
            break;
        case 3: // notification/v1/subscriptions
            switch ($request_method) {
                case "POST":
                    $operation = 'createSubscription';
                    break;
            }
            break;
    }
    
    switch ($operation) {
        case "createSubscription":
            $postBody = file_get_contents('php://input');
            $subscriptionParams = json_decode($postBody);
            if (!$subscriptionParams) {
                error_Log("JSON error: " . json_last_error_msg());
                error_Log("JSON data: " . $postBody);
            }
            $response = $service_provider->createSubscription(
                $subscriptionParams->events,
                $subscriptionParams->callbackData,
                $subscriptionParams->expiresIn
            );
            http_response_code(200);
            header("Content-Type:application/json");
            echo $response;
            break;
        case "deleteSubscription":
            $service_provider->deleteSubscription($subscriptionId);
            http_response_code(204);
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
