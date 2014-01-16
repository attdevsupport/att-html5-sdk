<?php

/**
 *
 * Licensed by AT&T under 'Software Development Kit Tools Agreement.' September 2011
 * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION: http://developer.att.com/sdk_agreement/
 * Copyright 2011 AT&T Intellectual Property. All rights reserved. http://developer.att.com
 * For more information contact developer.support@att.com
 *
 */
date_default_timezone_set('UTC');

error_log("GALLERY LISTENER");

foreach (getallheaders() as $name => $value) {
//  print "$name: $value<br>\n";
  error_log("$name: $value");
}

$path_is 			= __FILE__;
$folder 			= dirname($path_is);

$galleryFolder 		= $folder . "/gallery";
$galleryIndexFile	= "gallery.json";

$mmsHeaders = getallheaders();

$mmsBody    = file_get_contents('php://input');

//$mmsBody = file_get_contents('/tmp/mms.out');

if(!is_dir($galleryFolder)) {
	mkdir($galleryFolder);
}

if (file_exists($galleryIndexFile)) {
	$galleryIndex = file_get_contents($galleryIndexFile);
}
else {
	// empty gallery index - let's start with a clean slate.
	$galleryIndex = '{"success":true, "galleryCount": 0, "galleryImages" : [] }';
}

$galleryObject = json_decode($galleryIndex);

if (! isset($mmsHeaders['Content-Type'])) {
	error_log("Unable to determine content boundary.");
}

//
// grab multipart boundary from content type header
//
preg_match('/boundary="(.*)"$/', $mmsHeaders['Content-Type'], $matches);
$boundary = $matches[1];

//$boundary = "--MIMEBoundary_12177c443d13e69dc3c5b7c591767b194b68124dd35f8a70";
error_log("Boundary is : ($boundary)");

$mmsParts = explode($boundary, $mmsBody);

foreach ($mmsParts as $part => $value) {
	error_log("VALUE: $value");
}

$local_post_body = $mmsBody;
$ini = strpos($local_post_body,"<SenderAddress>tel:+");
if ($ini == 0 ) {
	exit();
}
else{
	preg_match("@<SenderAddress>tel:(.*)</SenderAddress>@i",$local_post_body,$matches);
	$message["address"] = $matches[1];
	preg_match("@<subject>(.*)</subject>@i",$local_post_body,$matches);
	$message["subject"] = $matches[1];
	$message["date"] = date("D M j G:i:s T Y");
 }

$galleryObject->galleryCount++;
$message['id'] = $galleryObject->galleryCount;

foreach ($message as $part => $value) {
	error_log("$part is $value");
}
$mj = json_encode($message);
error_log("Json is [$mj]");

error_log("Attempting to create $galleryFolder/{$message['id']}");

mkdir($galleryFolder.'/'.$message['id']);

$boundaries_parts = explode("--Nokia-mm-messageHandler-BoUnDaRy",$local_post_body);

foreach ( $boundaries_parts as $mime_part ){
	if ( preg_match( "@BASE64@",$mime_part )){
		$mm_part = explode("BASE64", $mime_part );
		$filename = null;
		$content_type =null;
		if ( preg_match("@Filename=([^;^\n]+)@i",$mm_part[0],$matches)){
	  		$filename = trim($matches[1]);
		}
		if ( preg_match("@Content-Type:([^;^\n]+)@i",$mm_part[0],$matches)){
	  		$content_type = trim($matches[1]);
		}
		if ( $content_type != null ) {
			if ( $filename == null ) {
				preg_match("@Content-ID: ([^;^\n]+)@i",$mm_part[0],$matches);
				$filename = trim($matches[1]);    
	  		}
	  		if ( $filename != null ) {
				//Save file 
				$base64_data = base64_decode($mm_part[1]);
				$full_filename = $galleryFolder.'/'.$message['id'].'/'.$filename;
				if (!$file_handle = fopen($full_filename, 'w')) {
	  				error_log("Cannot open file ($full_filename)");
	  				exit;
				}

				fwrite($file_handle, $base64_data);
				fclose($file_handle);
	
				if ( preg_match( "@image@",$content_type ) && ( !isset($message["image"]))){
	  				$message["image"]=$message['id'].'/'.$filename;
				}
				if ( preg_match( "@text@",$content_type ) && ( !isset($message["text"]))){
	  				$message["text"]=$message['id'].'/'.$filename;
	  				$message["textMessage"] = $base64_data;
				}
	  		}
		}
  	}
}


//
// Write gallery information back to gallery index file
//
array_push($galleryObject->galleryImages, $message);
$galleryContents = json_encode($galleryObject);
file_put_contents($galleryIndexFile, $galleryContents, LOCK_EX) || error_log("Could not write back to vote file.");

?>