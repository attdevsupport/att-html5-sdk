<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

try {
	if (!file_exists("service_provider/Speech_ServiceProvider.php")) throw new Exception ('service_provider/Speech_ServiceProvider.php does not exist'); 
	else require_once("service_provider/Speech_ServiceProvider.php");
	
	$filepath = isset($_GET['filename']) ? __DIR__ . '/media/' . $_GET['filename'] : null;
	$context = isset($_GET['context']) ? $_GET['context'] : null;
	$subcontext = isset($_GET['subcontext']) ? $_GET['subcontext'] : null;
	$xargs = isset($_GET['xargs']) ? $_GET['xargs'] : null;
	$chunked = isset($_GET['chunked']) ? $_GET['chunked'] : null;
	$type = isset($_GET['type']) ? $_GET['type'] : 'text/plain';
	$language = isset($_GET['language']) ? $_GET['language'] : null; // 'en-US' for example
	$accept = isset($_GET['accept']) ? $_GET['accept'] : null; // 'audio/amr-wb' for example
	
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

				$response = $speech_provider->speechToTextWithFileType($postedFile['tmp_name'], $postedFile['type'], $context, $subcontext, $xargs, $chunked, $language);
			}
			else {
				$response = $speech_provider->speechToText($filepath, $context, $subcontext, $xargs, $chunked, $language);
			}
			break;
		case "speechToTextCustom":	
			$grammar_file = __DIR__ . '/media/' . $config['defaultGrammarFile']; 
			$dictionary_file = __DIR__ . '/media/' . $config['defaultDictionaryFile']; 
			$response = $speech_provider->speechToTextCustom($filepath, $context, $grammar_file, $dictionary_file, $xargs, $language);
			break;
		case "textToSpeech":
			$results = $speech_provider->textToSpeech($type, $_GET['text'], $xargs, $language, $accept);
			$audioDataType = $results[0];
			$response = $results[1];
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
		header("Content-Type:" . $audioDataType);
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
