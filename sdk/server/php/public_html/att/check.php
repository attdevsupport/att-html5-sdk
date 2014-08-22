<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

if (!file_exists("service_provider/Html5_ServiceProvider_Base_Att.php")) throw new Exception ('service_provider/Html5_ServiceProvider_Base_Att.php does not exist'); 
else require_once("service_provider/Html5_ServiceProvider_Base_Att.php");

$reduce_token_expiry_by = isset($config['ReduceTokenExpiryInSeconds_Debug']) ? (int) $config['ReduceTokenExpiryInSeconds_Debug'] : 0;

$bool = "false";
if (isset($_GET['scope'])) {
	$tokens	= isset($_SESSION['consent_tokens']) ? $_SESSION['consent_tokens'] : '';

	$scopes = explode(",", $_GET['scope']);

	if (is_array($tokens)) {
		foreach($scopes as $s) {
			$temp_bool = false;
			foreach ($tokens as $key => $value) {
				if ($key == $s) {
					$expires_at = $_SESSION['consent_expires_at'][$key];
					$time_now = getdate()[0];
					$expires_in = $expires_at - $time_now  - $reduce_token_expiry_by;
					if ($expires_in > 0) {
						$bool = "true";
						$temp_bool = true;												
					} else {
						$html5_provider = new Html5_ServiceProvider_Base_Att($config);	
						// Try to get the token, this will try the refresh logic
						$token = $html5_provider->getSessionConsentToken($key);
						if ($token != null) {
							$bool = "true";
							$temp_bool = true;												
						}
					}
				}
			}
			if (!$temp_bool) {
				$bool = "false";
				break;
			}
		}
	}
}

header("Content-Type:application/json");
header("Cache-Control:no-cache, no-store, must-revalidate");
header("Pragma:no-cache");
header("Expires:0");
echo "{\"authorized\": $bool }";

?>
