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

    switch(count($params)) {
        
        
        case 3:
            switch ($params[2]) {
                case "subscriptions": // notification/v1/subscriptions
                    switch ($request_method) {
                        case "GET":
                            $operation = 'getSessionSubscription';
                            break;
                        case "POST":
                            $operation = 'createSubscription';
                            break;
                        case "PUT":
                            $operation = 'updateSessionSubscription';
                            break;
                        case "DELETE":
                            $operation = 'deleteSessionSubscription';
                            break;
                    }
                    break;
                case "notifications": // notification/v1/notifications
                    switch ($request_method) {
                        case "GET":
                            $operation = 'getNotificationsForSessionSubscription';
                            break;
                        case "DELETE":
                            $operation = 'deleteNotificationsForSessionSubscription';
                            break;
                    }
                    break;
                case "callback": // notification/v1/callback
                    $operation = 'receiveNotifications';
                    break;
            }
            break;
        case 4:
            $subscriptionId = $params[3];
            switch ($params[2]) {
                case "subscriptions": // notification/v1/subscriptions/some-subscription-id
                    switch ($request_method) {
                        case "GET":
                            $operation = 'getSubscription';
                            break;
                        case "PUT":
                            $operation = 'updateSubscription';
                            break;
                        case "DELETE":
                            $operation = 'deleteSubscription';
                            break;
                    }
                    break;
                case "notifications": // notification/v1/notifications/some-subscription-id
                    switch ($request_method) {
                        case "GET":
                            $operation = 'getNotifications';
                            break;
                        case "DELETE":
                            $operation = 'deleteNotifications';
                            break;
                    }
                    break;
            }
            break;
    }
    
    switch ($operation) {
        case "createSubscription":
            $postBody = file_get_contents('php://input');
            $subscriptionParams = json_decode($postBody)->subscription;
            if (!$subscriptionParams) {
                error_Log("JSON error: " . json_last_error_msg());
                error_Log("JSON data: " . $postBody);
                return_json_error(400, json_last_error_msg . " : " . $postBody);
                break;
            }
            if (!isset($subscriptionParams->events)) {
                return_json_error(400, "parameter 'events' required to create a subscription");
                break;
            }
            $callbackData = null;
            $expiresIn = 3600;
            if (isset($subscriptionParams->callbackData)) {
                $callbackData = $subscriptionParams->callbackData;
            }
            if (isset($subscriptionParams->expiresIn)) {
                $expiresIn = $subscriptionParams->expiresIn;
            }
            $response = $service_provider->createSubscription(
                $subscriptionParams->events,
                $callbackData,
                $expiresIn
            );
            $_SESSION['subscription_id'] = json_decode($response)->subscription->subscriptionId;
            http_response_code(200);
            header("Content-Type:application/json");
            echo $response;
            break;
        case "getSubscription":
            $response = $service_provider->getSubscription($subscriptionId);
            http_response_code(200);
            header("Content-Type:application/json");
            echo $response;
            break;
        case "deleteSubscription":
            $service_provider->deleteSubscription($subscriptionId);
            http_response_code(204);
            break;
        case "getSessionSubscription":
            $response = $service_provider->getSubscription($_SESSION['subscription_id']);
            http_response_code(200);
            header("Content-Type:application/json");
            echo $response;
            break;
        case "updateSessionSubscription":
            $postBody = file_get_contents('php://input');
            $subscriptionParams = json_decode($postBody);
            if (!$subscriptionParams) {
                error_Log("JSON error: " . json_last_error_msg());
                error_Log("JSON data: " . $postBody);
                return_json_error(400, json_last_error_msg . " : " . $postBody);
                break;
            }
            $callbackData = null;
            $expiresIn = 3600;
            if (isset($subscriptionParams->callbackData)) {
                $callbackData = $subscriptionParams->callbackData;
            }
            if (isset($subscriptionParams->expiresIn)) {
                $expiresIn = $subscriptionParams->expiresIn;
            }
            $response = $service_provider->updateSubscription(
                $_SESSION['subscription_id'],
                $subscriptionParams->events,
                $callbackData,
                $expiresIn
            );
            http_response_code(200);
            header("Content-Type:application/json");
            echo $response;
            break;
        case "deleteSessionSubscription":
            $service_provider->deleteSubscription($_SESSION['subscription_id']);
            http_response_code(204);
            break;
        case "getNotificationsForSessionSubscription":
            $notifications_json = file_get_contents('notifications.json');
            if (!$notifications_json) {
                $notifications_json = '{}';
            }
            $subscription_id = $_SESSION['subscription_id'];
            $notifications = json_decode($notifications_json, true);
            if (array_key_exists($subscription_id, $notifications)) {
                $notifications_for_subscription = $notifications[$subscription_id];
            } else {
                $notifications_for_subscription = array();
            }
            $response = json_encode(array('notificationEvents' => $notifications_for_subscription));
            http_response_code(200);
            echo $response;
            break;
        case "deleteNotificationsForSessionSubscription":
            $notifications_json = file_get_contents('notifications.json');
            if (!$notifications_json) {
                $notifications_json = '{}';
            }
            $notifications = json_decode($notifications_json, true);
            $subscription_id = $_SESSION['subscription_id'];
            if (array_key_exists($subscription_id, $notifications)) {
                $notifications_for_subscription = $notifications[$subscription_id];
            } else {
                $notifications_for_subscription = array();
            }
            $response = json_encode(array('notificationEvents' => $notifications_for_subscription));
            $notifications[$subscription_id] = array();
            file_put_contents('notifications.json', json_encode($notifications), LOCK_EX);
            http_response_code(200);
            echo $response;
            break;
        case "updateSubscription":
            $postBody = file_get_contents('php://input');
            $subscriptionParams = json_decode($postBody);
            if (!$subscriptionParams) {
                error_Log("JSON error: " . json_last_error_msg());
                error_Log("JSON data: " . $postBody);
                return_json_error(400, json_last_error_msg . " : " . $postBody);
                break;
            }
            $callbackData = null;
            $expiresIn = 3600;
            if (isset($subscriptionParams->callbackData)) {
                $callbackData = $subscriptionParams->callbackData;
            }
            if (isset($subscriptionParams->expiresIn)) {
                $expiresIn = $subscriptionParams->expiresIn;
            }
            $response = $service_provider->updateSubscription(
                $subscriptionId,
                $subscriptionParams->events,
                $callbackData,
                $expiresIn
            );
            http_response_code(200);
            header("Content-Type:application/json");
            echo $response;
            break;
        case "getNotifications":
            $notifications_json = file_get_contents('notifications.json');
            if (!$notifications_json) {
                $notifications_json = '{}';
            }
            $notifications = json_decode($notifications_json, true);
            if (array_key_exists($subscription_id, $notifications)) {
                $notifications_for_subscription = $notifications[$subscription_id];
            } else {
                $notifications_for_subscription = array();
            }
            $response = json_encode(array('notificationEvents' => $notifications_for_subscription));
            http_response_code(200);
            echo $response;
            break;
        case "deleteNotifications":
            $notifications_json = file_get_contents('notifications.json');
            if (!$notifications_json) {
                $notifications_json = '{}';
            }
            $notifications = json_decode($notifications_json, true);
            if (array_key_exists($subscription_id, $notifications)) {
                $notifications_for_subscription = $notifications[$subscription_id];
            } else {
                $notifications_for_subscription = array();
            }
            $response = json_encode(array('notificationEvents' => $notifications_for_subscription));
            $notifications[$subscription_id] = array();
            file_put_contents('notifications.json', json_encode($notifications), LOCK_EX);
            http_response_code(200);
            echo $response;
            break;
        case "receiveNotifications":
            $notifications_json = file_get_contents('notifications.json');
            if (!$notifications_json) {
                $notifications_json = '{}';
            }
            $stored_notifications = json_decode($notifications_json, true);

            $body_json = file_get_contents('php://input');
            $body = json_decode($body_json, true);
            $subscriptions_from_request = $body['notification']['subscriptions'];
            foreach ($subscriptions_from_request as $subscription) {
                $subscription_id = $subscription['subscriptionId'];
                $notifications_from_request = $subscription['notificationEvents'];
                if (array_key_exists('messageId', $notifications_from_request)) {
                    $notifications_from_request = array($notifications_from_request);
                }
                if (array_key_exists($subscription_id, $stored_notifications)) {
                    $stored_notifications_for_subscription = $stored_notifications[$subscription_id];
                    $stored_notifications[$subscription_id] = array_merge($stored_notifications_for_subscription, $notifications_from_request);
                } else {
                    $stored_notifications[$subscription_id] = $notifications_from_request;
                }
            }
            file_put_contents('notifications.json', json_encode($stored_notifications), LOCK_EX);
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
