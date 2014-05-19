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

header("Content-Type:application/json");
if (isset($_GET['returnUrl']) && isset($_GET['scope'])) {
  $scope = $_GET['scope'];
  $return_url = $_GET['returnUrl'];
  $html5_provider = new Html5_ServiceProvider_Base_Att($config);
  $user_auth_url = $html5_provider->oauthUrl(urlencode($scope), urlencode($return_url));
  echo "{\"url\":\"" . $user_auth_url . "\"}";
} else {
	http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
    echo "{\"error\": \"scope and returnUrl querystring parameters must be specified\"}";
}
?>