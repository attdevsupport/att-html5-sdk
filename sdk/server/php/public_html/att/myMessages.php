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
	if (!file_exists("service_provider/IMMN_ServiceProvider.php")) throw new Exception ('service_provider/IMMN_ServiceProvider.php does not exist'); 
	else require_once("service_provider/IMMN_ServiceProvider.php");

	$response = "Invalid API Call";
	$operation = 'unknown';
	$msgId = '';
	$partId = '';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	$request_method = $_SERVER['REQUEST_METHOD'];
	
	$immn_provider = new IMMN_ServiceProvider($config); 
	
	switch(count($params)) {
		case 6:
			$operation = "getMessageContent";
			$msgId = $params[3];
			$partId = $params[5];
			break;
		case 5:
			switch ($params[4]) { // placeholder for future code
				case "info": 
					$operation = 'getMessageIndexInfo';
					break;
			}
			break;
		case 4:
			$operation = $params[3];
			switch ($params[3]) { // placeholder for future code
				case "index": // /myMessages/v2/messages/index
					$operation = 'createMessageIndex';
					break;
				default:
					$msgId = $params[3];
					switch (strtoupper($request_method)) { // placeholder for future code
						case "GET":
							$operation = 'getMessage';
							break;
						case "DELETE":
							$operation = 'deleteMessage';
							break;
						case "PUT":
							$operation = 'updateMessage';
							break;
					}
					break;
			}
			break;
		case 3:
			switch (strtoupper($request_method)) { // placeholder for future code
				case "GET": // /myMessages/v2/messages, [count]
					switch ($params[2]) {
						case "messages":
							$operation = 'getMessageList';
							break;
						case "delta":
							$operation = 'getMessagesDelta';
							break;
						case "notificationConnectionDetails":
							$operation = 'getNotificationConnectionDetails';
							break;
					}
					break;
				case "DELETE":
					$operation = 'deleteMessages';
					break;
				case "PUT":
					$operation = 'updateMessages';
					break;
				case "POST":
					$operation = 'sendImmnMessage';
					break;
			}
			break;
	}
	// echo "Operation=".$operation." id=".$msgId." Method=".$_SERVER['REQUEST_METHOD']." params="; echo var_dump($params); exit;
	switch ($operation) {
		case "createMessageIndex":
			$response = $immn_provider->createMessageIndex();
			break;
		case "getMessageIndexInfo":
			$response = $immn_provider->getMessageIndexInfo();
			break;
		case "getMessageList":
			$headerCount = isset($_GET['count']) ? $_GET['count'] : '1';
			//echo "Operation=".$operation." header=".$headerCount." params=".var_dump($_GET); exit;
			$response = $immn_provider->getMessageList($headerCount, $_GET); // send other optional parameters as they came
			break;
		case "getNotificationConnectionDetails":
			//echo "Operation=".$operation." params=".var_dump($_GET); exit;
			if (isset($_GET['queues'])) {
				$queues = urldecode($_GET['queues']);
				$response = $immn_provider->getNotificationConnectionDetails($queues); // send other optional parameters as they came
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"queues querystring parameters must be specified\"}";
			}
			break;
		case "getMessage":
			$response = $immn_provider->getMessage($msgId);
			break;
		case "getMessageContent":
			$response = $immn_provider->getMessageContent($msgId, $partId);
			break;
		case "sendImmnMessage":
			if (isset($_GET['addresses'])) {
				$address = urldecode($_GET['addresses']);
				$address = str_replace("tel:", "", $address);
				$text = isset($_GET['message']) ? $_GET['message'] : null;
				$subject = isset($_GET['subject']) ? $_GET['subject'] : null;
				$isGroup = isset($_GET['group']) ? $_GET['group'] : null;
				$files = null;
				if (isset($_FILES)) {
					$files = array();
					foreach ($_FILES as $postedFile) {
						$ini_val = ini_get('upload_tmp_dir');
						$upload_tmp_dir = $ini_val ? $ini_val : sys_get_temp_dir(); // Get system temp dir if PHP temp dir not set
						$rename_to = $upload_tmp_dir.DIRECTORY_SEPARATOR.$postedFile['name'];
						if (file_exists($rename_to)) unlink($rename_to); // Delete the file, if it already exists
						rename($postedFile['tmp_name'], $rename_to);
						if (count($files) > 0) {
							array_push($files, $rename_to);
						} else {
							$files = array($rename_to);
						}
					}
				}
				//echo "Operation=".$operation." address=".$address." message=".$text." subject=".$subject ; echo var_dump($files); exit;
				if (($text == null || $text == '') &&  ($files == null || count($files) == 0)) {
					http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
					echo "{\"error\": \"Send Message called without any message text or attachment to send\"}";
					exit;
				}
				try {
					$response = $immn_provider->sendImmnMessage($address, $text, $subject, $files, $isGroup);
				} catch (Exception $e) {
					throw $e;
				} finally {
					// Delete Uploaded files.
					if (isset($files) && count($files) > 0) {
						foreach ($files as $file_to_remove) {
							unlink($file_to_remove);
						}
					}
				}
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Send Message called without any address to send to\"}";
				exit;
			}
			break;
		case "deleteMessage":
			//echo "Operation=".$operation." param=".$msgId; exit;
			$response = $immn_provider->deleteMessage($msgId);
			break;
		case "deleteMessages":
			if (isset($_GET["messageIds"])) {
				// Drop the blanks sent by the client, if any
				$temps = explode(",", urldecode($_GET["messageIds"]));
				$messageIds = array();
				foreach ($temps as $temp) {
					if(!is_null($temp) && trim($temp) != '') {
						array_push($messageIds, trim($temp));
					}
				}
				//echo "Operation=".$operation." param=".var_dump($messageIds); exit;
				$response = $immn_provider->deleteMessages($messageIds);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Delete Messages called without any message Id to delete\"}";
			}
			break;
		case "updateMessage":
			$jsonText = file_get_contents('php://input');
			if ($msgId != '' && $jsonText !== FALSE) {
				$json = json_decode($jsonText);
				$isUnread = isset($json->isUnread) ? $json->isUnread : null;
				$isFavorite = isset($json->isFavorite) ? $json->isFavorite : null;
				//echo "Operation=".$operation." msgId=".$msgId." data=".var_dump($json); exit;
				$response = $immn_provider->updateMessage($msgId, $isUnread, $isFavorite);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Update Message called without any message Id to update\"}";
			}
			break;
		case "updateMessages":
			$jsonText = file_get_contents('php://input');
			if ($jsonText !== FALSE) {
				$json_a = json_decode($jsonText, true); // convert to associative array
				//echo "Operation=".$operation." data=".var_dump($json_a); exit;
				$response = $immn_provider->updateMessages($json_a);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Update Messages called without proper parameters\"}";
			}
			break;
		case "getMessagesDelta":
			if (isset($_GET["state"])) {
				$state = $_GET["state"]; 
				//echo "Operation=".$operation." param=".var_dump($_GET); exit;
				$response = $immn_provider->getMessagesDelta($state);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Get Messages Delta called without state\"}";
			}
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
	if ($operation != "createMessageIndex" && 
		$operation != "deleteMessage" &&
		$operation != "deleteMessages" &&
		$operation != "updateMessage" &&
		$operation != "updateMessages" &&
		$operation != "getMessageContent") {
		header("Content-Type:application/json");
	}
	echo $response;
}
catch(ServiceException $se) {
    switch ($se->getErrorCode()) {
    case 400: // invalid_grant. Invalid Refresh token.
    case 401: // UnAuthorized Access. Invalid access token.
        unset($_SESSION['consent_tokens']['MIM']);        
        unset($_SESSION['consent_tokens']['IMMN']);        
        if (DEBUG) {
                Debug::init();
                Debug::write("Removed cached client token. Errocode=". $se->getErrorCode() ."\n");
                Debug::end();	
        }
        break;		
    }
    return_json_error($se->getErrorCode(), $se->getErrorResponse());
}
catch(Exception $e) {
    $error = $e->getMessage();
    // some operations in the codekit do not throw ServiceException
    if (stripos($error, 'UnAuthorized Request') !== false) {
        unset($_SESSION['consent_tokens']['MIM']);        
        unset($_SESSION['consent_tokens']['IMMN']);        
        if (DEBUG) {
                Debug::init();
                Debug::write("token removed.\n");
                Debug::end();	
        }
        return_json_error(401, "UnAuthorized Request. Try again to obtain a new access token.");
    } else {
        return_json_error(400, $error);
    }
}

?>
