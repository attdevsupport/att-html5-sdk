<?php

require_once("config.php");

#
# The oAuth Consent Request page hands off to this routine after the user has either entered their credentials or
# has denied the application access to the requested functionality.
#
# If authorized, a request code is passed in the request body.
# If denied, an error is generated and submitted along with an error description.
#

if (isset($_GET['code'])) {

    # Once the user has logged-in with their credentials, they get re-directed to this URL
    # with a 'code' parameter. This is exchanged for an access token which can be used in any
    # future calls to the AT&T APIs

    $code = trim($_GET['code']);
	Debug::init();Debug::write("\nLine:".__LINE__.": File: ".__FILE__.". Code: ".$code);Debug::end();

    # First, make sure to send the correct content-type
    header('Content-Type: text/html');

    if (!$code) {
        echo  REDIRECT_HTML_PRE . '{"success": false,"msg": "No auth code "}'. REDIRECT_HTML_POST;
    } else {
		try {
			$token = $html5_provider->getToken($code);
            # Store the auth token in the session for use in future API calls
            if (isset($_GET['scopes'])) {
                $scopes = explode(",", $_GET['scopes']);
                foreach ($scopes as $key => $value) {
                    $_SESSION['tokens'][$value] = $token->getAccessToken();
					$_SESSION['refresh_tokens'][$value] = $token->getRefreshToken();
                }
            }
            // $_SESSION['refresh_token'] = $token->getRefreshToken();
            echo  REDIRECT_HTML_PRE . '{"success": true,"msg": "Process Callback"}' . REDIRECT_HTML_POST;
		} catch (Exception $e) {
            echo  REDIRECT_HTML_PRE . '{"success": false,"msg": "Could not fetch auth token"}'. REDIRECT_HTML_POST;
		}
    }
}
else {
    $error = $_REQUEST['error'];
    $error_reason = $_REQUEST['error_reason'];
    $error_description = $_REQUEST['error_description'];

    echo REDIRECT_HTML_PRE . '{"success" : false, "msg" : "$error_description"}' . REDIRECT_HTML_POST;
}

?>