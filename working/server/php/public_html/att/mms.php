<?php
require_once("config.php");

try {
	$response = "Invalid API Call";	
	$operation = 'unknown';
	$registrationId = '';
	$imagefile = '';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	switch(count($params)) {
		case 5:
			if ($params[3] == "outbox") {
				$registrationId = $params[4];
				$operation = 'mmsStatus';
			}
			break;
		case 4:
			switch ($params[3]) {
				case "outbox":
					$operation = 'sendMms';
					break;
			}
			break;
		case 3:
			if ($params[1] == 'gallery') {
				$operation = 'gallery';
				$imagefile = $params[2];
			}
			break;
		case 2:
			if ($params[1] == 'gallerygetter') {
				$operation = 'gallerygetter';
			}
			break;
	}

	switch ($operation) {
		case "sendMms":
			if (isset($_GET['addresses']) && isset($_GET['message'])) {
				$addresses = $_GET['addresses'];
				$subject = $_GET['message'];
				$fileId = isset($_GET['fileId']) ? $_GET['fileId'] : null;
				$priority = isset($_GET['priority']) ? $_GET['priority'] : null;
				$files = explode(',', $fileId);
				for($i=0;$i<count($files);$i++) {
					$files[$i] = __DIR__ . '/media/' . $files[$i];
				} 
				$response = $html5_provider->sendMms($addresses, $files, $subject, $priority);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"addresses and message querystring parameters must be specified\"}";
			}
			break;
		case "mmsStatus":
			$response = $html5_provider->mmsStatus($registrationId);
			break;
		case "gallerygetter":
			date_default_timezone_set('UTC');
			$galleryFolder = __DIR__  . "/media/gallery";
			$galleryIndexFile = __DIR__  . "/media/gallery/gallery.json";
			if (file_exists($galleryIndexFile)) {
				$response = file_get_contents($galleryIndexFile);
			}
			else {
				// empty gallery index - let's start with a clean slate.
				$response = '{"success":false, "errorMessage": "Photo gallery is empty." }';
			}
			break;
		case "gallery":
			$galleryFile = "/att/media/gallery/" . $imagefile;
			header("Location: " . $galleryFile);
			exit;
			break;
		default:
			$response = 'Invalid API Call - operation ' . $operation . ' is not supported. PATH_INFO: ' . var_dump($_SERVER['PATH_INFO']);
	}
	if (DEBUG) {
		Debug::init();
		$objDateTime = new DateTime('NOW');
		$now = $objDateTime->format('c');
		Debug::write("$now : $operation : $response");
		Debug::end();
	}
	header("Content-Type:application/json");
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
