<?php
if (!file_exists("config.php")) {
	header('X-PHP-Response-Code: 400', true, 400);
	header("Content-Type:application/json");	
	echo "{\"error\":\"config.php does not exist.\"}";
	exit;
} else {
	require_once("config.php");
}

# Example data format (note the namespace)
#<hub:notifications xmlns:hub="http://hub.amdocs.com">
#  <hub:notificationId>a234abcd-92e0-4c1a-9c1f-356b6ddf610b</hub:notificationId>
#  <hub:notificationId>1122222a-92e0-4c1a-9c1f-356b6ddf610b</hub:notificationId>
#</hub:notifications>

# Get the raw data
$data = file_get_contents("php://input");

# Convert this xml to an object
$xml = simplexml_load_string($data);

# Loop through all of the children (in the 'http://hub.amdocs.com' namespace)
foreach($xml->children('http://hub.amdocs.com') as $child) {
//    error_log("notificationId=".$child);
    $token = $provider->getCurrentClientToken();
    $data = array($token, $child);
    $provider->getNotification($data);
    $provider->acknowledgeNotification($data);
}

# Echo the xml back
echo $data;

?>
