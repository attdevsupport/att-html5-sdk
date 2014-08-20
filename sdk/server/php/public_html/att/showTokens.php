<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

$client_token = isset($_SESSION['client_token']) ? $_SESSION['client_token'] : 'No client_tokens saved.';

echo 'Time Now: ' . date("r") . ' (' . getdate()[0] . ')' . '<br><br>';
echo '<table border="1"><tr><td>Scopes</td><td>Access Token</td><td>Refresh Token</td><td>Expires</td><td>Expires Time</td></tr>';
echo '<tr><td>'.$config['clientModelScope'].'</td><td>';
echo $_SESSION['client_token'].'</td><td>';
echo $_SESSION['client_refresh_token'].'</td><td>';
echo $_SESSION['client_expires_at'].'</td><td>';
echo date("r", $_SESSION['client_expires_at']) .'</td></tr>';

$consent_tokens	= isset($_SESSION['consent_tokens']) ? $_SESSION['consent_tokens'] : '';
if (is_array($consent_tokens)) {
	foreach ($consent_tokens as $key => $value) {
		echo '<tr><td>'.$key.'</td><td>';
		echo $_SESSION['consent_tokens'][$key].'</td><td>';
		echo $_SESSION['consent_refresh_tokens'][$key].'</td><td>';
		echo $_SESSION['consent_expires_at'][$key].'</td><td>';
		echo date("r", $_SESSION['consent_expires_at'][$key]) .'</td></tr>';
	}
}
echo '</table>';

?>
