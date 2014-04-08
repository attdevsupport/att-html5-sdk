<?php
require_once("config.php");

if (isset($_GET['scope'])) {
	$scope = $_GET['scope'];
	if (isset($_SESSION['tokens'][$scope])) unset($_SESSION['tokens'][$scope]);
} else {
	unset($_SESSION['tokens']);
}

echo "{\"authorized\": false }";

?>
