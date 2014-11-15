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
	if (!file_exists("service_provider/MMS_ServiceProvider.php")) throw new Exception ('service_provider/MMS_ServiceProvider.php does not exist'); 
	else require_once("service_provider/MMS_ServiceProvider.php");

	$response = "Invalid API Call";	
	$operation = 'unknown';
	$registrationId = '';
	$imagefile = '';
	$mms_provider = new MMS_ServiceProvider($config);	
	
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
				$files = array();
				$posted_files_to_delete = array();
				if ($fileId != null) {
					$files = explode(',', $fileId);
					for($i=0;$i<count($files);$i++) {
						$files[$i] = __DIR__ . '/media/' . $files[$i];
					} 
				}
				if (isset($_FILES)) {
					foreach ($_FILES as $postedFile) {
						$ini_val = ini_get('upload_tmp_dir');
						$upload_tmp_dir = $ini_val ? $ini_val : sys_get_temp_dir(); // Get system temp dir if PHP temp dir not set
						$rename_to = $upload_tmp_dir.'/'.$postedFile['name'];
						if (file_exists($rename_to)) unlink($rename_to); // Delete the file, if it already exists
						rename($postedFile['tmp_name'], $rename_to);
						array_push($posted_files_to_delete, $rename_to);
						if (count($files) > 0) {
							array_push($files, $rename_to);
						} else {
							$files = array($rename_to);
						}
					}
				}

				try {
					$response = $mms_provider->sendMms($addresses, $files, $subject, $priority);
				} catch (Exception $e) {
					throw $e;
				} finally {
					// Delete Uploaded files.
					if (isset($posted_files_to_delete) && count($posted_files_to_delete) > 0) {
						foreach ($posted_files_to_delete as $file_to_remove) {
							unlink($file_to_remove);
						}
					}
				}
			} else {
				http_response_code(400); // Set response code to 400 - Bad Request in case of all exceptions
				$response =  "{\"error\": \"addresses and message querystring parameters must be specified\"}";
			}
			break;
		case "mmsStatus":
			$response = $mms_provider->mmsStatus($registrationId);
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
    switch ($se->getErrorCode()) {
    case 400: // invalid_grant. Invalid Refresh token.
    case 401: // UnAuthorized Access. Invalid access token.
        unset($_SESSION['client_token']);
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
        unset($_SESSION['client_token']);        
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
