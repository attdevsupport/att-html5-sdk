<?php
require_once("config.php");
header("Content-Type:application/json");
if ((isset($_GET['returnUrl']) && isset($_GET['scope'])) {
  $encoded_scope = $_GET['scope'];
  $encoded_return_url = $_GET[['returnUrl'];
  $user_auth_url = $html5_provider->oauthUrl($encoded_scope, $encoded_return_url);
  echo "{\"url\": \"" . json_encode($user_auth_url) . "\"}";
} else {
	http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
    echo "{\"error\": \"scope and returnUrl querystring parameters must be specified\"}";
}
?>