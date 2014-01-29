<?php
require_once("../config.php");

if (isset($_GET['url'])) {
  # Generate the oauth redirect URL depending on the scope requested by the client.
  # The scope is specified as a parameter in the GET request and passed to the provider
  # library to obtain the appropriate OAuth URL
  $url = $provider->oauthUrl($_GET['scope']);
  echo "{\"redirect\": " . json_encode($url) . "}";
}

if (isset($_GET['action']) && $_GET['action'] == "check") {
  # Return a json object with either 'true' or 'false' depending on whether an
  # access_token has been set. This indicates if the user is logged-in.
  $bool = isset($_SESSION['token']) ? true : false;
  echo "{\"authorized\": " . json_encode($bool) . "}";
}

if (isset($_GET['action']) && $_GET['action'] == "refresh") {
  $provider = unserialize($_SESSION['provider']);
  $response = $provider->refreshToken($_SESSION['refresh_token']);
  if ($response->isError()) {
    echo "{\"error\": " . json_encode($response->error()) . "}";
  } else {
    $_SESSION['token'] = $response->data()->access_token;
    $_SESSSION['refresh_token'] = $response->data()->refresh_token;
    echo json_encode($response->data());
  }
}
?>