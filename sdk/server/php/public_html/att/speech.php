<?php
require_once("config.php");
require_once("service_provider/Speech_ServiceProvider.php");

$filepath = isset($_GET['filename']) ? __DIR__ . '/media/' . $_GET['filename'] : null;
$context = isset($_GET['context']) ? $_GET['context'] : null;
$xargs = isset($_GET['xargs']) ? $_GET['xargs'] : null;
$chunked = isset($_GET['chunked']) ? $_GET['chunked'] : null;

try {
	$response = "Invalid API Call";
	$speech_provider = new Speech_ServiceProvider($config);
	
	list($blank, $version, $operation) = split('[/]', $_SERVER['PATH_INFO']);
	switch ($operation) {
		case "speechToText":
			if (isset($_FILES['speechaudio'])) {
				$postedFile = $_FILES['speechaudio'];
				// Undefined | Multiple Files | $_FILES Corruption Attack
				if (!isset($postedFile['error']) || is_array($postedFile['error'])) {
					throw new RuntimeException('Invalid file received.');
				}

				$response = $speech_provider->speechToTextWithFileType($postedFile['tmp_name'], $postedFile['type'], $context, $xargs, $chunked);
			}
			else {
				$response = $speech_provider->speechToText($filepath, $context, $xargs, $chunked);
			}
			break;
		case "speechToTextCustom":	
			$grammar_file = __DIR__ . '/media/' . $config['defaultGrammarFile']; 
			$dictionary_file = __DIR__ . '/media/' . $config['defaultDictionaryFile']; 
			$response = $speech_provider->speechToTextCustom($filepath, $context, $grammar_file, $dictionary_file, $xargs);
			break;
		case "textToSpeech":
			$response = $speech_provider->textToSpeech('text/plain', $_GET['text'], $xargs);
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
	return_json_error($se->getErrorCode(), $se->getErrorResponse());
}
catch(Exception $e) {
	return_json_error(400, $e->getMessage());
}

?>
