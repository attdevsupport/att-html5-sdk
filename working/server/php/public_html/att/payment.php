<?php

require_once("config.php");

$response = array();

if (isset($_GET['TransactionAuthCode'])) {
    $authCode = trim($_GET['TransactionAuthCode']);
} 

if (isset($_GET['SubscriptionAuthCode'])) {
    $authCode = trim($_GET['SubscriptionAuthCode']);
}

$response = array();

if (isset($authCode)) {
    $response["success"] = true;
    $response["TransactionAuthCode"] = $authCode;
}
else {
    # Check for errors
    # Attempt to normalize error messages...
    $response["success"] = false;

    # If the payment fails to complete, the app will have one set of query parameters
    if ($_GET['success'] == "false") {
        $response["error_reason"] = $_GET["faultCode"];
        $response["error_description"] = $_GET["faultDescription"];
    } else {
        # If the user clicks Cancel, then we get a different set of errors.
        $response["error"] = $_GET["error"];
        $response["error_reason"] = $_GET["error_reason"];
        $response["error_description"] = $_GET["error_description"];
    }
}

# Send back our JSON wrapped in html.
$response_json = json_encode($response);
if (DEBUG) {
	Debug::init();
	$objDateTime = new DateTime('NOW');
	$now = $objDateTime->format('c');
	Debug::write("$now : Payment-Callback : $response_json");
	Debug::end();
}
header('Content-Type: text/html');
echo  REDIRECT_HTML_PRE . $response_json . REDIRECT_HTML_POST;
?>