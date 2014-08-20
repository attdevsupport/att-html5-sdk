<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

$reduce_token_expiry_by = isset($config['ReduceTokenExpiryInSeconds_Debug']) ? (int) $config['ReduceTokenExpiryInSeconds_Debug'] : 0;

echo 'Time Now: ' . date("r") . ' (' . getdate()[0] . ')<br>';
echo 'Reduce token expiry by: ' . $reduce_token_expiry_by. ' seconds.<br>';
echo '<table border="1"><tr><td>Scopes</td><td>Access Token</td><td>Refresh Token</td><td>Actual Expiry</td><td>Expires Time with reduction</td></tr>';
echo '<tr><td>'.$config['clientModelScope'].'</td><td>';
echo $_SESSION['client_token'].'</td><td>';
echo $_SESSION['client_refresh_token'].'</td><td>';
echo $_SESSION['client_expires_at'].'</td><td>';
echo date("r", ($_SESSION['client_expires_at'] - $reduce_token_expiry_by)) .'</td></tr>';

$consent_tokens	= isset($_SESSION['consent_tokens']) ? $_SESSION['consent_tokens'] : '';
if (is_array($consent_tokens)) {
	foreach ($consent_tokens as $key => $value) {
		echo '<tr><td>'.$key.'</td><td>';
		echo $_SESSION['consent_tokens'][$key].'</td><td>';
		echo $_SESSION['consent_refresh_tokens'][$key].'</td><td>';
		echo $_SESSION['consent_expires_at'][$key].'</td><td>';
		echo date("r", ($_SESSION['consent_expires_at'][$key] - $reduce_token_expiry_by)) .'</td></tr>';
	}
}
echo '</table>';

?>
