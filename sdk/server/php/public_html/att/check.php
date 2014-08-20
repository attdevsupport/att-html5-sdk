<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

$bool = "false";
if (isset($_GET['scope'])) {
	$tokens	= isset($_SESSION['consent_tokens']) ? $_SESSION['consent_tokens'] : '';

	$scopes = explode(",", $_GET['scope']);

	if (is_array($tokens)) {
		foreach($scopes as $s) {
			$temp_bool = false;
			foreach ($tokens as $key => $value) {
				if ($key == $s) {
					$bool = "true";
					$temp_bool = true;
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
