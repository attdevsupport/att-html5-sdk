<?php
require_once("config.php");

$filepath = isset($_GET['filename']) ? __DIR__ . '/media/' . $_GET['filename'] : null;
$context = isset($_GET['context']) ? $_GET['context'] : null;
$xargs = isset($_GET['xargs']) ? $_GET['xargs'] : null;
$chunked = isset($_GET['chunked']) ? $_GET['chunked'] : null;

try {
	$response = "Invalid API Call";
	
	list($blank, $version, $operation) = split('[/]', $_SERVER['PATH_INFO']);
	switch ($operation) {
		case "speechToText":			
			if (isset($_FILES['speechaudio'])) {
				$postedFile = $_FILES['speechaudio'];
				// Undefined | Multiple Files | $_FILES Corruption Attack
				if (!isset($postedFile['error']) || is_array($postedFile['error'])) {
					throw new RuntimeException('Invalid file received.');
				}

				$response = $html5_provider->speechToTextWithFileType($postedFile['tmp_name'], $postedFile['type'], $context, $xargs, $chunked);
			}
			else {
				$response = $html5_provider->speechToText($filepath, $context, $xargs, $chunked);
			}
			break;
		case "speechToTextCustom":	
			$grammar_file = __DIR__ . '/media/' . $config['defaultGrammarFile']; 
			$dictionary_file = __DIR__ . '/media/' . $config['defaultDictionaryFile']; 
			$response = $html5_provider->speechToTextCustom($filepath, $context, $grammar_file, $dictionary_file, $xargs);
			break;
		case "textToSpeech":
			$response = $html5_provider->textToSpeech('text/plain', $_GET['text'], $xargs);
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
	if ($operation != "textToSpeech") {
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
