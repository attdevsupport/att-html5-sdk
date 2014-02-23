<?php

# Licensed by AT&T under 'Software Development Kit Tools Agreement.' v14, January 2013
# TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION: http://developer.att.com/sdk_agreement/
# Copyright 2013 AT&T Intellectual Property. All rights reserved. http://developer.att.com
# For more information contact developer.support@att.com

//
// Specify the local path and name of the file to store votes.
//
$voteFile 	= $_SERVER['DOCUMENT_ROOT'] . "/sample/assets/data/votes.json";

//
// Process the SMS package containing vote 
//
$postBody 	= file_get_contents('php://input');

$postObject = json_decode($postBody);
if ($postObject) {
	$postSport	= $postObject->Message;
}
else {
	error_log("Unable to parse vote package.");
	exit;
}

$voteContents = file_get_contents($voteFile);

if (!$voteContents) {
	// Vote file does not exist, let's create an empty voting tally
	$voteContents = '{"success":true,"total":0,"data":[{"sport":"Football","votes":0},{"sport":"Baseball","votes":0},{"sport":"Basketball","votes":0}]}';
}

$voteObject   = json_decode($voteContents);

//
// Look for a matching vote toping (eg Football, Baseball, Basketball) and increment vote count and total votes submitted.
//
foreach ($voteObject->data as $value) {
	if (strcasecmp($value->sport, $postSport) === 0) {
		++$value->votes;
		++$voteObject->total;
	}
}

//
// Write vote information back to vote file
//
$voteContents = json_encode($voteObject);
error_log("Writing back [$voteContents]");

file_put_contents($voteFile, $voteContents, LOCK_EX) || error_log("Could not write back to vote file.");

?>