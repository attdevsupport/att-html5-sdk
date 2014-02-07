<?php
require_once("../config.php");
require_once __DIR__ . '/../codekit.lib/OAuth/OAuthTokenService.php';
require_once __DIR__ . '/../codekit.lib/Speech/SpeechService.php';

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
$grammar_file = __DIR__ . '\\' . 'grammar.srgs'; // TODO: Read grammar file name from config file
$dictionary_file = __DIR__ . '\\' . 'dictionary.pls'; // TODO: Read dictionary file name from config file

// Create service for requesting an OAuth token
$osrvc = new OAuthTokenService('https://api.att.com', $clientId, $clientSecret);

// Get OAuth token
$token = $osrvc->getToken('SPEECH,TTS,STTC');
// Create service to call the Speech API using Codekit
$speechSrvc = new SpeechService('https://api.att.com', $token);

switch ($_GET['request']) {
    case "speechToText":
		$response = $speechSrvc->speechToText($_GET['filename'], $_GET['context'], null, $_GET['xargs'], $_GET['chunked'], true);
		echo json_encode($response);
        break;
    case "speechToTextCustom":	// Need to troubleshoot. Does not work yet.	
		$filepath = __DIR__ . '\\' . $_GET['filename']; // This codekit function requires absolute path.
		//$response = $speechSrvc->speechToTextCustom($_GET['context'], $filepath, $grammar_file, $dictionary_file, $_GET['xargs']);
		//echo json_encode($response);
		echo "Not implemented!";
        break;
    case "textToSpeech":
        echo $speechSrvc->textToSpeech('text/plain', $_GET['text'], $_GET['xargs']);
        break;
	default:
		echo "Invalid API Call";
}

?>
