<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}
if (!file_exists("service_provider/Html5_ServiceProvider_Base_Att.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"service_provider/Html5_ServiceProvider_Base_Att.php does not exist.\"}";
	exit;
} else {
	require_once("service_provider/Html5_ServiceProvider_Base_Att.php");
}

#
# The oAuth Consent Request page hands off to this routine after the user has either entered their credentials or
# has denied the application access to the requested functionality.
#
# If authorized, a request code is passed in the request body.
# If denied, an error is generated and submitted along with an error description.
#

if (isset($_GET['code'])) {
    # Once the user has logged-in with their credentials, they get re-directed to this URL
    # with a 'code' parameter. This is exchanged for an access token which can be used in any
    # future calls to the AT&T APIs
	
	if (isset($_GET['returnUrl'])) {
		$return_url = urldecode($_GET['returnUrl']);
	} else {
		http_response_code(500); // Set response code to 500
		echo "user authentication completed but I don't have a returnUrl to go back to";
		exit;
	}
	
    $code = trim($_GET['code']);

	try {
		$html5_provider = new Html5_ServiceProvider_Base_Att($config);
		$token = $html5_provider->getToken($code);
		# Store the auth token in the session for use in future API calls
		if (isset($_GET['scopes'])) {
			$scopes = explode(",", $_GET['scopes']);
			foreach ($scopes as $key => $value) {
				$_SESSION['tokens'][$value] = $token->getAccessToken();
				$_SESSION['refresh_tokens'][$value] = $token->getRefreshToken();
			}
		}
	} catch (Exception $e) {
		if (strpos($return_url, '?') === FALSE) $return_url = $return_url . "?"; 
		else $return_url = $return_url . "&";
		$return_url = $return_url . "error=" . urlencode($error);
	}
}
else {
	$error = "no code and no error message returned from the user authentication";
    if (isset($_GET['error'])) {
		$error = $_GET['error'];
		if (isset($_GET['error_description'])) {
			$error = $error . " - " . $_GET['error_description'];
		}
    }
	if (!isset($_GET['returnUrl'])) {
		http_response_code(500); // Set response code to 500
		echo "user authentication completed but I don't have a returnUrl to go back to";
		exit;
	}
	$return_url = urldecode($_GET['returnUrl']);
	if (strpos($return_url, '?') === FALSE) $return_url = $return_url . "?"; 
	else $return_url = $return_url . "&";
	$return_url = $return_url . "error=" . urlencode($error);
}
//http_redirect ($return_url);
header("Location: ".$return_url);

?>