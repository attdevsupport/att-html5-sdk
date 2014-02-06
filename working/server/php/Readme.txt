Developer (SDK Consumer) Setup

Prerequisite: Please make sure that you have followed the appropriate steps to create you PHP installation as mentioned in the PHP docs at: docs/index.html#!/guide/server_php

1. Go to [SDK_ROOT]/working/server/php folder and copy the .htaccess files to the root folder of your PHP (e.g. C:\xampp\htdocs) installation. NOTE: If .htaccess file already exists, then copy the appropriate lines to the .htaccess file. 
2. Go to [SDK_ROOT]/working/server/php/public_html folder
3. Copy config.php (file) to the root of the Apache server running PHP. Then copy codekit.lib, att and lib folders to the root of Apache web server. (This will be simplified later)
4. Create an virtual directory called client in your PHP installation pointing to the [SDK_ROOT]/working/webcontent folder. Restart your Apache Web Server.
5. Now open this client virtual directory (e.g. localhost:8081/client) in web browser and you can test the examples.
6. Click on Speech->App1 link and test the application.

 

How SDK is being modified? (for internal use only)
1. Clone the PHP codekit into a directory on computer from https://github.com/attdevsupport/codekit-php
2. Copy lib folder from the codekit downloaded above to  server/php folder in the att-html5-sdk project.
3. Rename this copied folder to codekit.lib
4. Now move codekit.lib to the public_html (i.e. server/php/public_html) folder.
