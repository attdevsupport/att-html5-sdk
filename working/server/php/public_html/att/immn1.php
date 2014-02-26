<?php
// make sure this index.php file is in the same directory as the 'lib' folder.
require_once __DIR__ . '/codekit.lib/OAuth/OAuthTokenService.php';
require_once __DIR__ . '/codekit.lib/OAuth/OAuthCode.php';
require_once __DIR__ . '/codekit.lib/IMMN/IMMNService.php';
require_once __DIR__ . './codekit.lib/Restful/RestfulEnvironment.php';

use Att\Api\OAuth\OAuthTokenService;
use Att\Api\OAuth\OAuthCode;
use Att\Api\IMMN\IMMNService;
use Att\Api\Restful\RestfulEnvironment;
RestfulEnvironment::setAcceptAllCerts(true);
define("ENABLE_SSL_CHECK", false);

// Use the app settings from developer.att.com for the following values.
// Make sure IMMN is enabled the app key/secret.

// Enter the value from 'App Key' field
$clientId = '50wm5pxsdwyyfx4psfsctm5305k4zhkn';

// Enter the value from 'Secret' field
$clientSecret = 'y5xt7xmyvuyvtx1df4hjkvtgnmevwifq';

// Get the OAuth code by opening a browser to the following URL:
// https://api.att.com/oauth/authorize?client_id=CLIENT_ID&scope=SCOPE&redirect_uri=REDIRECT_URI
// replacing CLIENT_ID, SCOPE, and REDIRECT_URI with the values configured at 
// developer.att.com. After authenticating, copy the oauth code from the
// browser URL.
// https://api.att.com/oauth/authorize?client_id=50wm5pxsdwyyfx4psfsctm5305k4zhkn&scope=IMMN,MIM&redirect_uri=https://localhost/att/callback_debug.php
$oauthCode = "pTZHePl6sKFVglnqIR7s";

// Enter address to send message to
$addr = array('tel:4252337793');

// Enter message text
$txt = 'Hello';

// Enter message subject
$subject = 'Subject';

// Create service for requesting an OAuth token
$osrvc = new OAuthTokenService('https://api.att.com', $clientId, $clientSecret);

// Get OAuth token using the oauth code
$token = $osrvc->getTokenUsingCode(new OAuthCode($oauthCode));

// Create service for interacting with the IMMN api
$immnSrvc = new IMMNService('https://api.att.com', $token);

// Send a request for sending a message
$response = $immnSrvc->sendMessage($addr, $txt, $subject);

?>
<!DOCTYPE html>
<html>
  <head>
    <title>AT&amp;T IMMN Example</title>
  </head>
  <body>
    <?php var_dump($response); ?>
  </body>
</html>
