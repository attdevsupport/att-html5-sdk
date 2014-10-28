<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

require_once __DIR__ . '/Html5_ServiceProvider_Base_Att.php';

try {
	if (!file_exists("service_provider/Html5_ServiceProvider_Base_Att.php")) throw new Exception ('service_provider/Html5_ServiceProvider_Base_Att.php does not exist'); 
	else require_once("service_provider/Html5_ServiceProvider_Base_Att.php");
	
	$html5_serviceprovider_base = new Html5_ServiceProvider_Base_Att($config); 

	if (isset($_GET['scope'])) {
		$scope = $_GET['scope'];
		if (isset($_SESSION['consent_tokens'][$scope])) {
			$html5_serviceprovider_base->revokeConsentToken($scope);
			//unset($_SESSION['consent_tokens'][$scope]);
		}
	} else {
		try {
			$html5_serviceprovider_base->revokeConsentToken('MIM');
			$html5_serviceprovider_base->revokeConsentToken('IMMN');
			//$html5_serviceprovider_base->revokeConsentToken('DC');
		}
		catch (Exception $e) {			
		}
		//unset($_SESSION['consent_tokens']);
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
