<?php

require_once("../config.php");

$bool = "false";
if(isset($_SESSION['token'])) {
	$bool = "true";
}
echo "{\"authorized\": " . $bool . "}";

?>
