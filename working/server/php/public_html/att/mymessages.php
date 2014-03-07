<?php
require_once("config.php");

try {
	$response = "Invalid API Call";
	$operation = 'unknown';
	$msgId = '';
	$partId = '';
	
	$params = split('[/]', $_SERVER['PATH_INFO']);
	$request_method = $_SERVER['REQUEST_METHOD'];
	
	switch(count($params)) {
		case 6:
			$operation = "getMessageContent";
			$msgId = $params[3];
			$partId = $params[5];
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
					$operation = 'getMessageList';
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
	// echo "Operation=".$operation." id=".$msgId." Method=".$_SERVER['REQUEST_METHOD']." params=";
	// echo var_dump($params);
	// exit;
	switch ($operation) {
		case "createMessageIndex":
			$response = $html5_provider->createMessageIndex();
			break;
		case "getMessageList":
			$headerCount = isset($_GET['count']) ? $_GET['count'] : '1';
			$indexCursor = isset($_GET['index']) ? $_GET['index'] : '';
			echo "Operation=".$operation." header=".$headerCount." Index=".$indexCursor; exit;
			$response = $html5_provider->getMessageList($headerCount, $indexCursor);
			break;
		case "getMessage":
			$response = $html5_provider->getMessage($msgId);
			break;
		case "getMessageContent":
			$response = $html5_provider->getMessageContent($msgId, $partId);
			break;
		case "sendImmnMessage":
			if (isset($_GET['addresses'])) {
				$address = urldecode($_GET['addresses']);
				$address = str_replace("tel:", "", $address);
				$text = isset($_GET['message']) ? $_GET['message'] : '';
				$subject = isset($_GET['subject']) ? $_GET['subject'] : '';
				$isGroup = isset($_GET['group']) ? $_GET['group'] : null;
				$files = null;
				if (isset($_FILES)) {
					$files = array();
					foreach ($_FILES as $postedFile) {
						$ini_val = ini_get('upload_tmp_dir');
						$upload_tmp_dir = $ini_val ? $ini_val : sys_get_temp_dir(); // Get system temp dir if PHP temp dir not set
						$rename_to = $upload_tmp_dir.'/'.$postedFile['name'];
						unlink($rename_to); // Delete the file, if it already exists
						rename($postedFile['tmp_name'], $rename_to);
						if (count($files) > 0) {
							array_push($files, $rename_to);
						} else {
							$files = array($rename_to);
						}
					}
				}
				//echo "Operation=".$operation." address=".$address." message=".$text." subject=".$subject ; exit;
				$response = $html5_provider->sendImmnMessage($address, $text, $subject, $files, $isGroup);
				// Delete Uploaded files.
				if (isset($files) && count($files) > 0) {
					foreach ($files as $file_to_remove) {
						unlink($file_to_remove);
					}
				}
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Send Message called without any address to send to\"}";
			}
			break;
		case "deleteMessage":
			//echo "Operation=".$operation." param=".$msgId; exit;
			$response = $html5_provider->deleteMessage($msgId);
			break;
		case "deleteMessages":
			if (isset($_GET["messageIds"])) {
				$messageIds = explode(",", urldecode($_GET["messageIds"]));
				echo "Operation=".$operation." param=".print_r($messageIds); exit;
				$response = $html5_provider->deleteMessages($messageIds);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Delete Messages called without any message Id to delete\"}";
			}
			break;
		case "updateMessage":
			//echo "Operation=".$operation." param=".$msgId; exit;
			$response = $html5_provider->updateMessage($msgId, $isUnread, $isFavorite);
			break;
		case "updateMessages":
			if (isset($_GET["messageIds"])) {
				// TODO: this array will be complex for updateMessages
				$messageIds = explode(",", urldecode($_GET["messageIds"])); 
				echo "Operation=".$operation." param=".print_r($messageIds); exit;
				$response = $html5_provider->updateMessages($messageIds);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Delete Messages called without any message Id to delete\"}";
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
	if ($operation != "getMessageContent") {
		header("Content-Type:application/json");
	}
	echo $response;
}
catch(ServiceException $se) {
	//http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	header('X-PHP-Response-Code: 400'); // Set response code to 400 - Bad Request in case of all exceptions
	echo('ServiceException: ErrorCode: '.$se->getErrorCode().'. Response: ' . $se->_errorResponse());
}
catch(Exception $e) {
	//http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
	header('X-PHP-Response-Code: 400'); // Set response code to 400 - Bad Request in case of all exceptions
	echo('Exception: '.$e->getMessage());
}

?>
