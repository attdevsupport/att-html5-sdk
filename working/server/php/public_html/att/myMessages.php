<?php
require_once("config.php");
require_once("service_provider/IMMN_ServiceProvider.php");

try {
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
						$rename_to = $upload_tmp_dir.'/'.$postedFile['name'];
						if (file_exists($rename_to)) unlink($rename_to); // Delete the file, if it already exists
						rename($postedFile['tmp_name'], $rename_to);
						if (count($files) > 0) {
							array_push($files, $rename_to);
						} else {
							$files = array($rename_to);
						}
					}
				}
				//echo "Operation=".$operation." address=".$address." message=".$text." subject=".$subject ; exit;
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
			if ($msgId != '') {
				$json = json_decode(file_get_contents('php://input'));
				$isUnread = isset($json->isUnread) ? $json->isUnread : null;
				$isFavorite = isset($json->isFavorite) ? $json->isFavorite : null;
				//echo "Operation=".$operation." msgId=".$msgId." data=".var_dump($json); exit;
				// TODO: needs to be verified.
				$response = $immn_provider->updateMessage($msgId, $isUnread, $isFavorite);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Update Message called without any message Id to update\"}";
			}
			break;
		case "updateMessages":
			if (isset($_GET["messageIds"])) {
				// TODO: this array will be complex for updateMessages
				$messageIds = explode(",", urldecode($_GET["messageIds"])); 
				//echo "Operation=".$operation." param=".print_r($messageIds); exit;
				$response = $immn_provider->updateMessages($messageIds);
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				echo "{\"error\": \"Update Messages called without proper paramters\"}";
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
