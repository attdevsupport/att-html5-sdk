<?php
require_once("../config.php");
require_once __DIR__ . '/codekit.lib/OAuth/OAuthTokenService.php';
require_once __DIR__ . '/codekit.lib/Speech/SpeechService.php';

// use any namespaced classes
use Att\Api\OAuth\OAuthTokenService;
use Att\Api\Speech\SpeechService;

// Enter path of file to translate
$grammar_file = __DIR__ . '/media/' . $config['defaultGrammarFile']; 
$dictionary_file = __DIR__ . '/media/' . $config['defaultDictionaryFile']; 

$clientId = $config['AppKey'];
$clientSecret = $config['Secret'];
$baseUrl = $config['apiHost'];

// Create service for requesting an OAuth token
$osrvc = new OAuthTokenService($baseUrl, $clientId, $clientSecret);

// Get OAuth token
$token = $osrvc->getToken('SPEECH,TTS,STTC');
// Create service to call the Speech API using Codekit
$speechSrvc = new SpeechService($baseUrl, $token);
$speechSrvc->setReturnJsonResponse(true); // 2/10/2014. Added the global flag in codekit to return json response
$filepath = isset($_GET['filename']) ? __DIR__ . '/media/' . $_GET['filename'] : null;
$context = isset($_GET['context']) ? $_GET['context'] : null;
$xargs = isset($_GET['xargs']) ? $_GET['xargs'] : null;
$chunked = isset($_GET['chunked']) ? $_GET['chunked'] : null;

list($blank, $version, $operation) = split('[/]', $_SERVER['PATH_INFO']);

try {
	$response = "Invalid API Call";
	switch ($operation) {
		case "speechToText":
			if (isset($_FILES['speechaudio'])) {
				$postedFile = $_FILES['speechaudio'];
				// Undefined | Multiple Files | $_FILES Corruption Attack
				if (!isset($postedFile['error']) || is_array($postedFile['error'])) {
					throw new RuntimeException('Invalid file received.');
				}

				$response = $speechSrvc->speechToTextWithFileType($postedFile['tmp_name'], $postedFile['type'], $context, null, $xargs, $chunked);
			}
			else {
				$response = $speechSrvc->speechToText($filepath, $context, null, $xargs, $chunked);
			}
			break;
		case "speechToTextCustom":	
			$response = $speechSrvc->speechToTextCustom($context, $filepath, $grammar_file, $dictionary_file, $xargs);
			break;
		case "textToSpeech":
			$response = $speechSrvc->textToSpeech('text/plain', $_GET['text'], $xargs);
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
	if ($operation == "textToSpeech") {
		header("Content-Type:audio/wav");
	} else {
		header("Content-Type:application/json");
	}
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

?>
