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
	if (!file_exists("service_provider/Html5_ServiceProvider_Base_Att.php")) throw new Exception ('service_provider/Html5_ServiceProvider_Base_Att.php does not exist'); 
	else require_once("service_provider/Html5_ServiceProvider_Base_Att.php");
	
	$html5_serviceprovider_base = new Html5_ServiceProvider_Base_Att($config);
	$revoke ='';
	if (isset($_GET['revoke'])) {
		$revoke = $_GET['revoke'];
	} else if (isset($_POST['revoke'])) {
		$revoke = $_POST['revoke'];
	}
	if ($revoke == 'client') $html5_serviceprovider_base->revokeClientToken();
	else if ($revoke == 'consent') {
		$html5_serviceprovider_base->revokeConsentToken('MIM');
		$html5_serviceprovider_base->revokeConsentToken('IMMN');
	} else if ($revoke == 'client_ex') { // to test external revoke
		$refresh_token_string = isset($_SESSION['client_refresh_token']) ? $_SESSION['client_refresh_token'] : '';
		if (!empty($refresh_token_string)) {
			if (DEBUG) {
				Debug::init();
				Debug::write("Revoke Client Refresh token: $refresh_token_string.\n");
				Debug::end();	
			}
			$html5_serviceprovider_base->revokeRefreshToken($refresh_token_string);
		}
	} else if ($revoke == 'consent_ex') { // to test external revoke
		$refresh_token_string = isset($_SESSION['consent_refresh_tokens']['MIM']) ? $_SESSION['consent_refresh_tokens']['MIM'] : '';
		if (!empty($refresh_token_string)) {
			if (DEBUG) {
				Debug::init();
				Debug::write("Revoke Consent Refresh token: $refresh_token_string.\n");
				Debug::end();	
			}
			$html5_serviceprovider_base->revokeRefreshToken($refresh_token_string);
		}
	}
}
catch(ServiceException $se) {
	return_json_error($se->getErrorCode(), $se->getErrorResponse());
}
catch(Exception $e) {
	return_json_error(400, $e->getMessage());
}

$reduce_token_expiry_by = isset($config['ReduceTokenExpiryInSeconds_Debug']) ? (int) $config['ReduceTokenExpiryInSeconds_Debug'] : 0;

echo 'Time Now: ' . date("r") . ' (' . getdate()[0] . ')<br>';
echo 'Reduce token expiry by: ' . $reduce_token_expiry_by. ' seconds.<br>';
echo '<table border="1"><tr><td>Scopes</td><td>Access Token</td><td>Refresh Token</td><td>Actual Expiry</td><td>Expires Time with reduction</td></tr>';
echo '<tr><td>'.$config['clientModelScope'].'</td><td>';
echo '***...'.substr($_SESSION['client_token'], -6).'</td><td>';
echo '***...'.substr($_SESSION['client_refresh_token'], -6).'</td><td>';
echo $_SESSION['client_expires_at'].'</td><td>';
echo date("r", ($_SESSION['client_expires_at'] - $reduce_token_expiry_by)) .'</td></tr>';

$consent_tokens	= isset($_SESSION['consent_tokens']) ? $_SESSION['consent_tokens'] : '';
if (is_array($consent_tokens)) {
	foreach ($consent_tokens as $key => $value) {
		echo '<tr><td>'.$key.'</td><td>';
                echo '***...'.substr($_SESSION['consent_tokens'][$key], -6).'</td><td>';
                echo '***...'.substr($_SESSION['consent_refresh_tokens'][$key], -6).'</td><td>';
		echo $_SESSION['consent_expires_at'][$key].'</td><td>';
		echo date("r", ($_SESSION['consent_expires_at'][$key] - $reduce_token_expiry_by)) .'</td></tr>';
	}
}
echo '</table><br><br>';
?>
<strong>Revoke Token Tests</strong><br>
<form method="post">
<input type="hidden" id="revoke" name="revoke" value="client" />
<button onclick="submit();">Revoke Client Credential Token</button><br>
</form>
<form method="post">
<input type="hidden" id="revoke" name="revoke" value="consent" />
<button onclick="submit();">Revoke User Consent Tokens</button><br>
</form>
