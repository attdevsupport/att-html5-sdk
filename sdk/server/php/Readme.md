# AT&T PHP Server Setup

----------

## Introduction

The HTML5 SDK provides an HTML5 framework for calling PHP based back-end web services published by AT&T.

----------

## Setup on your local machine

Please make sure that you have followed the appropriate steps to create you PHP installation as PHP Environment

- Create a virtual directory (Alias) called **att** pointing to the <code>[SDK_ROOT]/server/php/public_html/att</code> folder with following settings:<br>
<code>Options MultiViews FollowSymLinks</code><br>
<code>AllowOverride all</code><br>
<code>Order Allow,Deny</code><br>
<code>Allow from all</code><br>
<code>Require all granted</code><br>

- Open <code>[SDK_ROOT]/server/php/public_html/config.php</code> file and update the <code>$clientId</code> and <code>$clientSecret</code> fields.

- Create an virtual directory (Alias) called **webcontent** in your PHP installation pointing to the <code>[SDK_ROOT]/working/webcontent</code> folder with following settings:<br>
<code>AllowOverride all</code><br>
<code>Order Allow,Deny</code><br>
<code>Allow from all</code><br>
<code>Require all granted</code><br>

- Restart your Apache Web Server.

- Open this virtual directory (e.g. localhost:4567/webcontent) in Chrome web browser to run the samples.

----------

## Shared hosting setup

If you cannot setup the virtual directories in the hosted environment, you can copy the folders in your shared hosted environment and fix the client side samples as follows.<br>

- Copy <code>att</code> folder from <code>server/php/public_html</code> folder to the root of your hosted server.

- Copy <code>webcontent</code> folder to the root of your hosted server.

- You can run the samples in the Chrome browser at http://your.webserver.com/webcontent

- NOTE: If your web server does not support MultiViews then you must edit <code>/lib/att-api-client.js</code> file and point the library directly to the php files by replacing all instances of following values:<br>
<code>/sms/ -> /sms.php/</code>
<code>/speech/ -> /speech.php/</code>
<code>/check/ -> /check.php/</code>
<code>/oauth/ -> /oauth.php/</code>
<code>/myMessages/ -> /myMessages.php/</code>
<code>/rest/ -> /rest.php/</code>
<code>/Security/ -> /Security.php/</code>