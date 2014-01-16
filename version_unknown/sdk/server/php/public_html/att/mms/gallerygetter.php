<?php

/**
 * Licensed by AT&T under 'Software Development Kit Tools Agreement.' September 2011
 * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION: http://developer.att.com/sdk_agreement/
 * Copyright 2011 AT&T Intellectual Property. All rights reserved. http://developer.att.com
 * For more information contact developer.support@att.com
 *
 */

date_default_timezone_set('UTC');

$path_is 			= __FILE__;
$folder 			= dirname($path_is);

$galleryFolder 		= $folder . "/gallery";
$galleryIndexFile	= "gallery.json";

if (file_exists($galleryIndexFile)) {
	$galleryIndex = file_get_contents($galleryIndexFile);
	print "$galleryIndex";
}
else {
	// empty gallery index - let's start with a clean slate.
	print '{"success":false, "errorMessage": "Photo gallery is empty." }';
}

?>