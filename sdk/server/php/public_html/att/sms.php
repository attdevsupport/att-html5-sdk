<?php
require_once("../config.php");
require_once __DIR__ . '/codekit.lib/OAuth/OAuthTokenService.php';
require_once __DIR__ . '/codekit.lib/SMS/SMSService.php';

// use any namespaced classes
use Att\Api\OAuth\OAuthTokenService;
use Att\Api\SMS\SMSService;

$clientId = $config['AppKey'];
$clientSecret = $config['Secret'];
$baseUrl = $config['apiHost'];

// Create service for requesting an OAuth token
$osrvc = new OAuthTokenService($baseUrl, $clientId, $clientSecret);

// Get OAuth token
$token = $osrvc->getToken('SMS,MMS,SPEECH,TTS,STTC,PAYMENT');
// Create service to call the Speech API using Codekit
$smsSrvc = new SMSService($baseUrl, $token);
$smsSrvc->setReturnJsonResponse(true); // 2/10/2014. Added the global flag in codekit to return json response
$xargs = isset($_GET['xargs']) ? $_GET['xargs'] : null;

list($blank, $version, $operation) = split('[/]', $_SERVER['PATH_INFO']);

try {
	$response = "Invalid API Call";
	switch ($operation) {
		case "sendSms":	
			$response = sendSMS($smsSrvc);
			break;
		case "smsStatus":
			$response = smsStatus($smsSrvc);
			break;
		case "receiveSms":
			$response = receiveSms($smsSrvc);
			break;
		default:
			$response = 'Invalid API Call - operation ' . $operation . ' is not supported.';
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
 * Sends an SMS to a recipient
 *
 * @method sendSms
 *
 * @param {array} data An array of SMS options. Options should include:
 * @param {string} data.0 (token) The oAuth access token
 * @param {string} data.1 (tel) Wireless number of the recipient(s). Can contain comma separated list for multiple recipients.
 * @param {string} data.2 (message) The text of the message to send
 *
 * @return {Response} Returns Response object 
 */
function sendSms($smsSrvc) {
	$address = isset($_GET['address']) ? $_GET['address'] : null;
	$message = isset($_GET['message']) ? $_GET['message'] : null;
	if (strstr($address, ",")) {
		// If it's csv, split and iterate over each value prepending each value with "tel:"
		$address = explode(",", $address);
		foreach ($address as $key => $value) {
			$address[$key] = parseAddress($value);
		}
	} else {
		$address = parseAddress($address); 
	}

	return $smsSrvc->sendSMS($address, $message, false);
}


/**
 * Check the status of a sent SMS
 *
 * @method smsStatus
 *
 * @param {array} data An array of SMS options, which should include:
 * @param {string} data.0 (token) The oAuth access token
 * @param {string} data.1 (tel) The unique SMS ID as retrieved from the response of the sendSms method
 *
 * @return {Response} Returns Response object
 */
function smsStatus($smsSrvc) {
	$smsId = isset($_GET['smsId']) ? $_GET['smsId'] : null;
	return $smsSrvc->getSMSDeliveryStatus($smsId);
}

/**
 * Retrieves a list of SMSs sent to the application's short code
 *
 * @param {array} data An array of SMS options, which should include:
 * @param {string} data.0 (token) The oAuth access token
 * @param {string} data.1 (registrationId) The registrationId to receive messages from.
 * @return {Response} Returns Response object
 * @method receiveSms
 */
function receiveSms($smsSrvc) {
	$registrationId = isset($_GET['registrationId']) ? $_GET['registrationId'] : null;
	return $smsSrvc->getMessages($registrationId);
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
