<?php

require_once("../config.php");

$bool 		 = "false";
$scope 		 = isset($_GET['scope']) ? $_GET['scope'] : '';
$tokens		 = isset($_SESSION['tokens']) ? $_SESSION['tokens'] : '';

if (is_array($tokens)) {
	foreach ($tokens as $key => $value) {
		if ($key == $scope) {
			$bool = "true";
		}
	}
}

echo "{\"authorized\": $bool }";

?>
