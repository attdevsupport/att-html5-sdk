<?php
require_once("../config.php");
require_once __DIR__ . '/codekit.lib/OAuth/OAuthTokenService.php';
require_once __DIR__ . '/codekit.lib/MMS/MMSService.php';

// use any namespaced classes
use Att\Api\OAuth\OAuthTokenService;
use Att\Api\MMS\MMSService;

$clientId = $config['AppKey'];
$clientSecret = $config['Secret'];
$baseUrl = $config['apiHost'];

// Create service for requesting an OAuth token
$osrvc = new OAuthTokenService($baseUrl, $clientId, $clientSecret);

// Get OAuth token
$token = $osrvc->getToken('SMS,MMS,SPEECH,TTS,STTC,PAYMENT');
// Create service to call the Speech API using Codekit
$mmsSrvc = new MMSService($baseUrl, $token);
$mmsSrvc->setReturnJsonResponse(true); 
$xargs = isset($_GET['xargs']) ? $_GET['xargs'] : null;

list($blank, $version, $messaging, $operation, $data) = split('[/]', $_SERVER['PATH_INFO']);

try {
	$response = "Invalid API Call";
	switch ($operation) {
		case "outbox":
			if (count($data) > 0) {
				$response = mmsStatus($smsSrvc, $data);
			} else {
				$addresses = isset($_GET['addresses']) ? $_GET['addresses'] : null;
				$subject = isset($_GET['message']) ? $_GET['message'] : null;
				$fileId = isset($_GET['fileId']) ? $_GET['fileId'] : null;
				$priority = isset($_GET['priority']) ? $_GET['priority'] : null;
				$fileId = __DIR__ . '/' . $fileId; // Assumes that just one filename is sent. TO-DO parse comma separated file names.
				$files = explode(',', $fileId);
				$response = sendMms($mmsSrvc, $addresses, $files, $subject, $priority);
			}
			break;
		case "smsStatus":
			// $smsId = isset($_GET['smsId']) ? $_GET['smsId'] : null;
			$response = mmsStatus($mmsSrvc, $data);
			break;
		case "inbox":
			//$response = receiveSms($smsSrvc, $data);
			break;
		default:
			$response = 'Invalid API Call - operation ' . $operation . ' is not supported.' . var_dump($parts);
	}
	if (DEBUG) {
		Debug::init();
		$objDateTime = new DateTime('NOW');
		$now = $objDateTime->format('c');
		Debug::write("$now : $operation : $response");
		Debug::end();
	}
	header("Content-Type:application/json;charset=utf-8");
	echo $response;
}
catch(ServiceException $se) {
	http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	echo('ServiceException: ErrorCode: '.$se->getErrorCode().'. Response: ' . $se->_errorResponse());
}
catch(Exception $e) {
	http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	echo('Exception: '.$e->getMessage());
}

/**
 * Sends an MMS to a recipient
 *
 * MMS allows for the delivery of different file types. Please see the developer documentation for an updated list:
 *  https://developer.att.com/docs
 *
 * @param {array} data An array of sendMms options, which should include:
 * @param {string} data.0 (access_token) The oAuth access token (included in the service object)
 * @param {string} data.1 (tel) Comma separated list of wireless numbers of the recipients
 * @param {string} data.2 (file_name) The name of the file, eg logo.jpg
 * @param {string} data.3 (subject) The subject line for the MMS
 * @param {string} data.4 (priority) Can be "Default", "Low", "Normal" or "High"
 *
 * @return {Response} Returns Response object
 * @method sendMms
 */
function sendMms($mmsSrvc, $address, $files, $subject, $priority) {
	if (strstr($address, ",")) {
		// If it's csv, split and iterate over each value prepending each value with "tel:"
		$address = explode(",", $address);
		foreach ($address as $key => $value) {
			$address[$key] = parseAddress($value);
		}
	} else {
		$address = parseAddress($address); 
	}

	return $mmsSrvc->sendMMS($address, $files, $subject, $priority, false);
}


/**
 * Queries the status of a sent MMS
 *
 * @method mmsStatus
 *
 * @param {array} data An array of SMS options, which should include:
 * @param {string} data.0 (token) The oAuth access token (included in the mmsSrvc object)
 * @param {string} data.1 (mms_id) The ID of the MMS as received in the returned data when sending an MMS
 *
 * @return {Response} Returns Response object
 */
function mmsStatus($mmsSrvc, $mmsId) {
	return $mmsSrvc->getMMSStatus($mmsId);
}

function parseAddress($address) {
	$addressPatterns = array(
		"tel"   => array('pattern' => "/^(\+?[1]-?)?[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/i", 'prefix' => 'tel:'),
		"email" => array('pattern' => "/^[a-zA-Z]\w+(.\w+)*@\w+(.[0-9a-zA-Z]+)*.[a-zA-Z]{2,4}$/i", 'prefix' => ''),
		"short" => array('pattern' => "/^\d{3,8}$/", 'prefix' => 'short:')
	);
	foreach ($addressPatterns as $key => $pattern ) {
		if (preg_match($addressPatterns[$key]['pattern'], $address)) {
			return $addressPatterns[$key]['prefix'] . preg_replace("/[\+\-]/", "", $address);
		}
	}
	return "";
}

?>
