<?php

# Licensed by AT&T under 'Software Development Kit Tools Agreement.' v14, January 2013
# TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION: http://developer.att.com/sdk_agreement/
# Copyright 2013 AT&T Intellectual Property. All rights reserved. http://developer.att.com
# For more information contact developer.support@att.com

//
// Specify the local path and name of the file to store votes. This should be the same file as specified
// in smsvotelistener.php
//
$voteFile 		= $_SERVER['DOCUMENT_ROOT'] . "sample/assets/data/votes.json";

if (file_exists($voteFile)) {
	$voteContents 	= file_get_contents($voteFile);
}
else {
	$voteContents = '{"success":true,"total":0,"data":[{"sport":"Football","votes":0},{"sport":"Baseball","votes":0},{"sport":"Basketball","votes":0}]}';
}
print $voteContents;

?>