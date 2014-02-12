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
$filepath = __DIR__ . '/media/' . $_GET['filename']; // SpeechToTextCustom codekit function requires absolute path.

list($blank, $version, $operation) = split('[/]', $_SERVER['PATH_INFO']);

try {
	$response = "Invalid API Call";
	switch ($operation) {
		case "speechToText":
			$postedFile = $_FILES['speechaudio'];
			if ($postedFile != null) {
				// Undefined | Multiple Files | $_FILES Corruption Attack
				if (!isset($postedFile['error']) || is_array($postedFile['error'])) {
					throw new RuntimeException('Invalid file received.');
				}

				$response = $speechSrvc->speechToTextWithFileType($postedFile['tmp_name'], $postedFile['type'], $_GET['context'], null, $_GET['xargs'], $_GET['chunked']);
			}
			else {
				$response = $speechSrvc->speechToText($filepath, $_GET['context'], null, $_GET['xargs'], $_GET['chunked']);
			}
			break;
		case "speechToTextCustom":	
			$response = $speechSrvc->speechToTextCustom($_GET['context'], $filepath, $grammar_file, $dictionary_file, $_GET['xargs']);
			break;
		case "textToSpeech":
			$response = $speechSrvc->textToSpeech('text/plain', $_GET['text'], $_GET['xargs']);
			break;
		default:
			$response = 'Invalid API Call - operation ' . $operation . 'not supported.';
	}
	echo $response;
}
catch(ServiceException $se) {
	http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	echo('ServiceException: ErrorCode'. $se->getErrorCode(). '. Response: ' . $se->_errorResponse());
}
catch(Exception $e) {
	http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	echo('Exception: '.$e->getMessage());
}

?>
