Developer (SDK Consumer) Setup

Prerequisite: Please make sure that you have followed the appropriate steps to create you PHP installation as mentioned in the PHP docs at: docs/index.html#!/guide/server_php

1. Create a virtual directory called att pointing to the [SDK_ROOT]/working/server/php/public_html/att folder as follows:
<Directory "[Doc_Root]/working/server/php/public_html/att">
    Options MultiViews FollowSymLinks
    AllowOverride all
    Order Allow,Deny
    Allow from all
</Directory>
Alias /att "[Doc_Root]/working/server/php/public_html/att"

2. Open [SDK_ROOT]/working/server/php/public_html/att/speech.php file and update the $clientId and $clientSecret fields.
3. Create an virtual directory called client in your PHP installation pointing to the [SDK_ROOT]/working/webcontent folder. Restart your Apache Web Server.
4. Open [SDK_ROOT]/working/webcontent/lib/att-api-client.js and point the Sencha client to your PHP Server by changing the following line (port number will correspond to the att virtual directory set in Step 1):
	var _serverPath = "http://localhost:8081/att";
6. Now open this client virtual directory (e.g. localhost:8081/client) in Chrome web browser and you can test the examples.
7. Click on Speech->App1 link and test the application.

 

How SDK is being modified? (for internal use only)
1. Clone the PHP codekit into a directory on computer from https://github.com/attdevsupport/codekit-php
2. Copy lib folder from the codekit downloaded above to  server/php folder in the att-html5-sdk project.
3. Rename this copied folder to codekit.lib
4. Now move codekit.lib to the public_html (i.e. server/php/public_html/att) folder.
5. Further changes were made to the codekit files since then.
