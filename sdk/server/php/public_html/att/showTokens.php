<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

$tokens		 = isset($_SESSION['tokens']) ? $_SESSION['tokens'] : 'No tokens saved.';
$client_token = isset($_SESSION['client_token']) ? $_SESSION['client_token'] : 'No client_tokens saved.';

echo 'Time Now=' . getdate()[0] . '=' . date("r") . '<br>';
echo var_dump($tokens) . '<br>';
echo 'Client Token:'. $client_token . '. Refresh Token:' . $_SESSION['client_refresh_token'];
echo '. Expires at:' . $_SESSION['client_expires_at'] . '=' . date("r", $_SESSION['client_expires_at']) . '<br>';

?>
