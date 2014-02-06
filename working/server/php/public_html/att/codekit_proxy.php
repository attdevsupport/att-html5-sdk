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
$fname = 'Bananas.amr';

// Create service for requesting an OAuth token
$osrvc = new OAuthTokenService('https://api.att.com', $clientId, $clientSecret);

// Get OAuth token
$token = $osrvc->getToken('SPEECH,TTS,STTC');

// Call the Speech API using the Codekit
switch ($_GET['request']) {
    case "speechToText":
		$arr = SpeechToText($fname, $token);
		echo json_encode($arr);
        break;
    case "speechToTextCustom":
        echo "Not implemented.";
        break;
    case "textToSpeech":
        echo "Not implemented.";
        break;
	default:
		echo "Invalid API Call";
}

function SpeechToText($file, $token)
{
	// Create service for interacting with the Speech api
	$speechSrvc = new SpeechService('https://api.att.com', $token);

	// Translate file
	$response = $speechSrvc->speechToText($_GET['filename'], $_GET['context'], null, $_GET['xargs'], $_GET['chunked'], true);
	
	return $response;
	
	// TODO: Delete this code at clean-up
	//$response = $speechSrvc->speechToText($_GET['filename'], $_GET['context'], null, $_GET['xargs'], $_GET['chunked']);
	//return NBestToArray($response->getNBest());
}

// TODO: Delete this function on clean-up. Not used anymore
// Note: Codekit should implement the helper function to convert NBest to Array OR json
function NBestToArray($nBest)
{
	$arr[] = array(
		'Hypothesis' => $nBest->getHypothesis(),
		'LanguageId' => $nBest->getLanguageId(),
		'Confidence' => $nBest->getConfidence(),
		'Grade'=> $nBest->getGrade(),
		'ResultText' => $nBest->getResultText(),
		'Words' => $nBest->getWords(),
		'WordScores' => $nBest->getWordScores()
	);

	return $arr;
}

?>
