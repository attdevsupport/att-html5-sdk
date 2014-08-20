<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

if (isset($_GET['scope'])) {
	$scope = $_GET['scope'];
	if (isset($_SESSION['consent_tokens'][$scope])) unset($_SESSION['consent_tokens'][$scope]);
} else {
	unset($_SESSION['consent_tokens']);
}

echo "{\"authorized\": false }";

?>
