<?php
session_start();

define("DEBUG", "1");
define("DEBUG_LOGGER", "/tmp/att-php.log");

ini_set("memory_limit","12M");

# The root URL starts off the Sencha Touch application. On the desktop, any Webkit browser
# will work, such as Google Chrome or Apple Safari. It's best to use desktop browsers
# when developing and debugging your application, due to the superior developer tools, such
# as the Web Inspector.

# Set up the ATT library with the Client application key and secret. These have been
# given to you when you registered your application on the AT&T Developer site.

$provider = new Sencha_ServiceProvider_Base_Att(array(

	# apiKey and secretKey are from AT&T Dev Connect.
	# localServer is the address of the locally running server.
	#   This is used when a callback URL is required when making a request to the AT&T APIs.
	# apiHost is the main endpoint through which all API requests are made.
	# clientModelScope is the string of api scopes your application wants access to.

	"AppKey"            => "b81ddc785df565b56208abb435d0e4c6",
	"Secret" 	        => "c61389458bcf3bd1",

//  ANAND CMS
//	"AppKey" => "d3f1c7384adcd45548a5874efc124152",
//	"Secret" => "422656d44af76659",


//	"AppKey"            => "b81ddc785df565b56208abb435d0e4c6",
//	"Secret"         => "c61389458bcf3bd1",

	# IMPORTANT !! REMOVE TRAILING SLASHES FROM SERVER NAMES!!!!

//	"AppKey"		=> "d26db32a3d1b6500c0a2d8f9e1a8bf19",
//	"Secret" 		=> "792dcf40d20fa6f7",

//	"AppKey"            => "68ab27497ee50e84daf61e09991497e5",
//    "Secret"            => "2e50ec96ba15e688",

//	"AppKey"            => "XXXXXXXXXXXXXXXXXXXXXXX",
//	"Secret"  		    => "XXXXXXXXXXXXXXXXXXXXXXX",

	"localServer"       => "http://attphp.overhere.com",
	"apiHost"           => "https://api-uat.bf.pacer.sl.attcompute.com",
	"clientModelScope"	=> "CCS"
//	"clientModelScope"	=> "ADS,CCS,WAP,SMS,MMS,PAYMENT,SPEECH"
//	"clientModelScope"  => "ADS,CCS,WAP,SMS,MMS,PAYMENT,SPEECH,MIM"

));

function __autoload($class) {
	require_once("../lib/service_provider/$class.php");
}


#Minimal HTML page to wrap the postMessage to the parent during iframe, redirects in OAuth and Payment.

define("REDIRECT_HTML_PRE", "<!DOCTYPE html><html><head><script>window.parent.postMessage('");

define("REDIRECT_HTML_POST", "', '*');</script></head><body></body></html>");

?>
