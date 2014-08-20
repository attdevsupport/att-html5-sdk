<?php
require_once __DIR__ . '/codekit.lib/Restful/RestfulEnvironment.php'; // To initialize Restful environment to accept certs
require_once __DIR__ . '/service_provider/Debug.php'; // To enable debugging from other files

#
# Note: This SDK disables SSL Certificate verification by default for ease if development.
#
# If your application requires high level of security, you may enable this feature by reading 
# the related notes for your PHP installation.
#
define("ENABLE_SSL_CHECK", false);
use Att\Api\Restful\RestfulEnvironment;
RestfulEnvironment::setAcceptAllCerts(true);

session_start();

#
# Turn on/off debugging and define the location of the PHP debug file.
#
define("DEBUG", "0");
define("DEBUG_LOGGER", __DIR__ . "/att-php.txt");

$config = array(
	# AppKey and Secret are from AT&T Dev Connect.
	"AppKey"            => 'gxb9himyfoycbkeyrvucczetnlqqmpxk',
	"Secret"         	=> 'k5ugamjhzgqwkptmsc7xsuvybokkqb94',
	
	# The address of the locally running server. This is used when a callback URL is
	# is required when making a request to the AT&T APIs.
	# IMPORTANT !! REMOVE TRAILING SLASHES FROM SERVER NAMES!!!!
	"localServer"       => "http://localhost:4567",
	
	# ATT API configuration - do not modify these values unless you know what you're doing.
	# apiHost is the main endpoint through which all API requests are made.
	"apiHost"           => 'https://api-uat.mars.bf.sl.attcompute.com',
	
	# clientModelScope is the string of api scopes your application wants access to.
	"clientModelScope"  => "SMS,MMS,SPEECH,STTC,TTS,ADS",
	
	"defaultGrammarFile" => "grammar.srgs",
	"defaultDictionaryFile" => "dictionary.pls",
);

ini_set("memory_limit","12M");

// For 4.3.0 <= PHP <= 5.4.0
if (!function_exists('http_response_code'))
{
    function http_response_code($newcode = NULL)
    {
        static $code = 200;
        if($newcode !== NULL)
        {
            header('X-PHP-Response-Code: '.$newcode, true, $newcode);
            if(!headers_sent())
                $code = $newcode;
        }       
        return $code;
    }
}

function return_json_error($response_code, $error_message)
{
	http_response_code($response_code);
	header("Content-Type:application/json");	
	// Note: remove error code, if the error_message has ' :400' in it. Work around codekit issue
	if (($len = strlen($error_message)) > 6) {
		$startOfErrorCode = strrpos($error_message, " :");
		if ($startOfErrorCode > 0) {
			$error_message = substr($error_message, 0, $startOfErrorCode+1); //add 1 to make it like Ruby
		}
	}
	echo "{\"error\":".json_encode($error_message)."}";
}


#Minimal HTML page to wrap the postMessage to the parent during iframe, redirects in OAuth and Payment.

define("REDIRECT_HTML_PRE", "<!DOCTYPE html><html><head><script>window.parent.postMessage('");

define("REDIRECT_HTML_POST", "', '*');</script></head><body></body></html>");

?>
