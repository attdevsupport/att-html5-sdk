<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

$bool 		 = "false";
if (isset($_GET['scope'])) {
	$tokens		 = isset($_SESSION['tokens']) ? $_SESSION['tokens'] : '';

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
echo "{\"authorized\": $bool }";

?>
