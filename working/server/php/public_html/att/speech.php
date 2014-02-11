<?php
require_once("../config.php");
require_once __DIR__ . '/codekit.lib/OAuth/OAuthTokenService.php';
require_once __DIR__ . '/codekit.lib/Speech/SpeechService.php';

// use any namespaced classes
use Att\Api\OAuth\OAuthTokenService;
use Att\Api\Speech\SpeechService;

$tokens = isset($_SESSION['tokens']) ? $_SESSION['tokens'] : '';

# Define our PROVIDER constant
define("PROVIDER", "ServiceProvider");

// Enter the value from 'App Key' field
$clientId = 'c2cbh0asdnb7n4lamb57hyf5dnsxy0ah';

// Enter the value from 'Secret' field
$clientSecret = 'hs12sa8vx8csfpmqla3xpja7f71tgcaa';

// Enter path of file to translate
$grammar_file = __DIR__ . '/media/' . 'grammar.srgs'; // TODO: Read grammar file name from config file
$dictionary_file = __DIR__ . '/media/' . 'dictionary.pls'; // TODO: Read dictionary file name from config file

// Create service for requesting an OAuth token
$osrvc = new OAuthTokenService('https://api.att.com', $clientId, $clientSecret);

// Get OAuth token
$token = $osrvc->getToken('SPEECH,TTS,STTC');
// Create service to call the Speech API using Codekit
$speechSrvc = new SpeechService('https://api.att.com', $token);
$speechSrvc->setReturnJsonResponse(true); // 2/10/2014. Added the global flag in codekit to return json response
$filepath = __DIR__ . '/media/' . $_GET['filename']; // SpeechToTextCustom codekit function requires absolute path.

list($blank, $version, $operation) = split('[/]', $_SERVER['PATH_INFO']);

switch ($operation) {
    case "speechToText":
		$postedFile = $_FILES['speechaudio'];
		if ($postedFile != null) {
			// Undefined | Multiple Files | $_FILES Corruption Attack
			if (!isset($postedFile['error']) || is_array($postedFile['error'])) {
				throw new RuntimeException('Invalid file received.');
			}
			// TODO: Minor Enhancement. Verify that file type is valid. Just in case some client decided to send wrong type. API will anyways throw error.
			$response = $speechSrvc->speechToTextWithFileType($postedFile['tmp_name'], $postedFile['type'], $_GET['context'], null, $_GET['xargs'], $_GET['chunked']);
		}
		else {
			$response = $speechSrvc->speechToText($filepath, $_GET['context'], null, $_GET['xargs'], $_GET['chunked']);
		}
		echo $response;
        break;
    case "speechToTextCustom":	
		$response = $speechSrvc->speechToTextCustom($_GET['context'], $filepath, $grammar_file, $dictionary_file, $_GET['xargs']);
		echo $response;
        break;
    case "textToSpeech":
        echo $speechSrvc->textToSpeech('text/plain', $_GET['text'], $_GET['xargs']);
        break;
	default:
		echo "Invalid API Call";
}

?>
