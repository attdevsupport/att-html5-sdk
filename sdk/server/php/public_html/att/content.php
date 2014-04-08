<?php

require_once("../config.php");

$tokens = isset($_SESSION['tokens']) ? $_SESSION['tokens'] : '';

if ($_SERVER['REQUEST_METHOD'] === "GET") {

    # Define our PROVIDER constant
    define("PROVIDER", "ServiceProvider");

    $messageId = $_REQUEST['messageId'];
    $partNumber = $_REQUEST['partNumber'];

    # Get raw post data
    $data = json_decode(trim(file_get_contents("php://input")));

    $data = (object) array();

    $data->action = PROVIDER;
    $data->method = "getMessageContents";
    $data->tid    = 1;
    $data->data[0] = $messageId;
    $data->data[1] = $partNumber;

    $response = (object) array(
        "type" => "rpc",
        "tid" => $data->tid,
        "action" => $data->action,
        "method" => $data->method
    );

    $method_whitelist = array("oauthUrl", "signPayload");
    $method_tokenlist   = array(
        "deviceInfo"        => "DC",
        "deviceLocation"    => "TL",
        "getMessageHeaders" => "IMMN",
        "getMessageContents" => "IMMN",
        "sendMobo"          => "IMMN"
    );    
    $client_credentials = array("sendSms", "smsStatus", "receiveSms", "mmsStatus", "wapPush", "sendMms",  "requestChargeAuth", "subscriptionDetails", "refundTransaction", "transactionStatus", "subscriptionStatus", "getNotification", "acknowledgeNotification", "speechToText");

    # This passes white-listed methods through to the Provider instance

    if ($data->action === PROVIDER && in_array($data->method, $method_whitelist)) {
        $response = (object) array_merge((array) $response, (array) $provider->{"direct_" . $data->method}($data->data[0]));

    } elseif ($data->action === PROVIDER) {

        # If client credentials can be used, set token to this
        if (isset($method_tokenlist[$data->method])) {
            $scope = $method_tokenlist[$data->method];
            if (is_array($tokens)) {
                foreach ($tokens as $key => $value) {
                    if ($key == $scope) {
                        $token = $value;
                    }
                }
            }
        }

        # If client credentials can be used, set token to this
        if(in_array($data->method, $client_credentials)) {
            $token = $provider->getCurrentClientToken();
        }

        if (! isset($token)) {
            $response->error = "No token set. Unauthorized request";
        } else {
            if (!$data->data) { //some methods like receiveSms have a null value for $data->data;
                $data->data = array();
            }

            # Always push the token to the front of the data array
            array_unshift($data->data, $token);

            # The router makes dynamic function calls with a variable number of arguments
            $response = $provider->getMessageContents($data->data); 
        }

    } else {
        $response->error = "Unrecognized method";
    }

    if ($response->isError()) {
        //$response = (object) array_merge((array) $response, array("type" => "exception", "error" => $response->error()));
        error_log("I got an error");
        header("HTTP/1.1 " . $response->getErrorCode());
        print $response->getRawResponse();
    }
    else {
        $headers = $response->getHeaders();
        header("Content-Type: " . $headers["Content-Type"]);
        print $response->getRawResponse();
    }
}
?>
