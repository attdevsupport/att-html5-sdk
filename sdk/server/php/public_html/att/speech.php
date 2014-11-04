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
    
    $clientSdk = ""; // Remove ClientSdk X-Args sent by the client. Set in RestfulRequest.php.
    if ($xargs != null) {
        $updatedXArgs = array();
        $originalXArgsArray = explode(",", $xargs);
        foreach ($originalXArgsArray as $pair) {
            $pairArray = explode("=", $pair);
            $name = $pairArray[0];
            if (strtolower($name) != strtolower("ClientSdk")) {
                $updatedXArgs[] = $pair;
            }
        }
        $updatedXArgs[] = $clientSdk;
        $xargs = implode(",", $updatedXArgs);
    }

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
    switch ($se->getErrorCode()) {
    case 400: // invalid_grant. Invalid Refresh token.
    case 401: // UnAuthorized Access. Invalid access token.
    case 403: // Forbidden - app-key secret might have been chnaged in between
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
    if (DEBUG) {
            Debug::init();
            Debug::write("Error code: ".$e->getCode()." ErrorMessage: ".$e->getMessage());
            Debug::end();	
    }
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
