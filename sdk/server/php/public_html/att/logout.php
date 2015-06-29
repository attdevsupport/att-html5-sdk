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

	if (isset($_GET['scope'])) {
		$scope = $_GET['scope'];
		if (DEBUG) {
			Debug::init();
			$a = $_SESSION['consent_refresh_tokens'][$scope];
			Debug::write("Revoke Old Refresh token: $a.\n");
			Debug::end();	
		}
		if (isset($_SESSION['consent_tokens'][$scope])) {
			$html5_serviceprovider_base->revokeConsentToken($scope);
			//unset($_SESSION['consent_tokens'][$scope]);
		}
	} else {
		if (DEBUG) {
			Debug::init();
			$a = $_SESSION['consent_refresh_tokens']['MIM'];
			Debug::write("Revoke Old Refresh token: $a.\n");
			Debug::end();	
		}
		$html5_serviceprovider_base->revokeConsentToken('MIM');
		$html5_serviceprovider_base->revokeConsentToken('IMMN');
	}
	
	echo "{\"authorized\": false }";
}
catch(ServiceException $se) {
	return_json_error($se->getErrorCode(), $se->getErrorResponse());
}
catch(Exception $e) {
	return_json_error(400, $e->getMessage());
}

?>
