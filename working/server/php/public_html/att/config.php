<?php
require_once __DIR__ . '/service_provider/Debug.php';
require_once __DIR__ . '/service_provider/Request.php';
require_once __DIR__ . '/service_provider/Response.php';
require_once __DIR__ . '/service_provider/Base.php';
require_once __DIR__ . '/service_provider/Html5_ServiceProvider_Base_Att.php';
require_once __DIR__ . '/codekit.lib/Restful/RestfulEnvironment.php';

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
	# localServer is the address of the locally running server.
	# This is used when a callback URL is required when making a request to the AT&T APIs.
	# apiHost is the main endpoint through which all API requests are made.
	# clientModelScope is the string of api scopes your application wants access to.

	"AppKey"            => '50wm5pxsdwyyfx4psfsctm5305k4zhkn',
	"Secret"         	=> 'y5xt7xmyvuyvtx1df4hjkvtgnmevwifq',

	# IMPORTANT !! REMOVE TRAILING SLASHES FROM SERVER NAMES!!!!

	"localServer"       => "http://localhost:4567",

	// ATT API configuration - do not modify these values unless you know what you're doing.

	"apiHost"           => 'https://api.att.com',
	"clientModelScope"  => "SMS,MMS,SPEECH,STTC,TTS,ADS",
	
	"defaultGrammarFile" => "grammar.srgs",
	"defaultDictionaryFile" => "dictionary.pls",

	"ads_udid"			=> "user-123456-transaction-1234567890"
);

ini_set("memory_limit","12M");

# The root URL starts off the HTML5 application. On the desktop, any Webkit browser
# will work, such as Google Chrome or Apple Safari. It's best to use desktop browsers
# when developing and debugging your application, due to the superior developer tools, such
# as the Web Inspector.

# Set up the ATT library with the Client application ID and secret. These have been
# given to you when you registered your application on the AT&T Developer site.

$html5_provider = new Html5_ServiceProvider_Base_Att($config);

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

#Minimal HTML page to wrap the postMessage to the parent during iframe, redirects in OAuth and Payment.

define("REDIRECT_HTML_PRE", "<!DOCTYPE html><html><head><script>window.parent.postMessage('");

define("REDIRECT_HTML_POST", "', '*');</script></head><body></body></html>");

?>