# AT&T PHP Server Setup

----------

## Introduction

The HTML5 SDK provides an HTML5 framework for calling PHP based back-end web services published by AT&T.

----------

## Setup on your local machine

Please make sure that you have followed the appropriate steps to create you PHP installation as PHP Environment

- Create a virtual directory (Alias) called **att** pointing to the <code>[SDK_ROOT]/sdk/server/php/public_html/att</code> folder with following settings:<br>
<code>Options MultiViews FollowSymLinks</code><br>
<code>AllowOverride all</code><br>
<code>Order Allow,Deny</code><br>
<code>Allow from all</code><br>

- Open <code>[SDK_ROOT]/working/server/php/public_html/config.php</code> file and update the <code>$clientId</code> and <code>$clientSecret</code> fields.

- Create an virtual directory (Alias) called **webcontent** in your PHP installation pointing to the <code>[SDK_ROOT]/working/webcontent</code> folder with following settings:<br>
<code>AllowOverride all</code><br>
<code>Order Allow,Deny</code><br>
<code>Allow from all</code><br>

- Restart your Apache Web Server.

- Open this virtual directory (e.g. localhost:4567/webcontent) in Chrome web browser to run the samples.

- Click on Speech->App1 link and test the application.

----------

## Shared hosting setup

If you cannot setup the virtual directories in the hosted environment, you can copy the folders in your shared hosted environment and fix the client side samples as follows.<br>

- Copy <code>sdk/server/php/public_html</code> folder to your hosted server and rename it to <code>attphp</code>.

- Open [SDK_ROOT]/webcontent/lib/att-api-client.js and point the Sencha client to your PHP Server by changing the following lines:<br>
<code>var _serverPath = "/attphp";</code><br>
<code>var _serverUrl = "/att/speech.php/v3/";</code>

- Copy following files/folders for the Speech standalone sample apps from <code>[SDK_ROOT]/</code> to webcontent folder:<br>
<code>webcontent/index.html</code><br> 
<code>webcontent/lib/*</code> <br>
<code>webcontent/Speech/App1/*</code> (do not copy the docs folder)<br>
<code>webcontent/Speech/App2/*</code> (do not copy the docs folder)<br>
<code>webcontent/Speech/App3/*</code> (do not copy the docs folder)

- You can run the samples in the Chrome browser at http://your.webserver.com/webcontent
