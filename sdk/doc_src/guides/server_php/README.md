HTML5 SDK Server (PHP Implementation)
===

This guide provides instructions for configuring an Apache Web server so that the HTML5 SDK may correctly access the PHP server components. If you want to create your own tools to access the AT&T APIs, you can access the PHP server routines as a standalone toolkit.

Assumptions
---
You must have a functioning Apache Web server running in your development environment with a cURL-enabled PHP module installed. If you do not have access to a running Apache server with PHP that meets these requirements, see our [PHP Server Environment Setup](#!/guide/server_php_env) for guidelines on obtaining and installing these packages.

Required Configurations
----

- Apache
	- The **mod_negotiation** and **mod_alias** modules must be loaded in the Apache HTTP server. These modules are required for both the Alias and Multiviews switches used when configuring your SDK virtual host. See the Configuring Apache to Access the SDK section for an example.

- PHP
	- PHP must have cURL support enabled. To test this, create a script that calls `phpinfo()` and view it in a browser to see your current PHP configuration.
	- In your php.ini file, the **short_open_tag** setting should be set to **On**.
	- Optionally setting **display_errors = Off** in php.ini will prevent errors from interfering with the app.

- Review the documentation and account setup instructions on the [AT&T Developer Program](http://developer.att.com/) Web site.


Unpacking the SDK
---

Copy the SDK zip file to a new directory created for the SDK and your apps, or to an existing directory with files for the SDK. 

Configuring Apache to Access the SDK 
---

To use this SDK, configure your Web server with a virtual host that has the **DocumentRoot** set to the path where you unzipped the SDK.

Note: This example shows the minimum requirements needed for proper configuration. Any additional configuration that may be required by your app is beyond the scope of this documentation. 

After installing PHP on your machine and verifying that the Apache Web server is running properly, you can create a virtual directory pointing to the SDK PHP server as follows:

	# Create a convenience alias that points to the SDK PHP server root directory.
	# This alias will be used when setting up your app in your AT&T developer account.

	<Directory "[docroot]/server/php/public_html/att">
		Options MultiViews FollowSymLinks
		AllowOverride None
		Order allow,deny
		Allow from all
		Require all granted
	</Directory>
	Alias /att [docroot]/server/php/public_html/att
	
	<Directory "[docroot]/webcontent">
		Options MultiViews
		AllowOverride all
		Order Allow,Deny
		Allow from all
		Require all granted
	</Directory>
	Alias /webcontent "[docroot]/webcontent"

Replace ___[docroot]___ with the full path of the location where you unzipped the SDK. Required settings for this example are:

* **Server** - 
The virtual name of the Web site where your app and SDK will reside. (for example, application.mysite.com) This can be a locally mapped domain name (in your /etc/hosts file) or a name configured in your DNS server.

- **DocRoot** - The directory where you unpacked the SDK.

- **Alias** - A shortcut virtual directory for use in your app configuration in your AT&T Developer account and by the SDK PHP server.

- **Options MultiViews** - Multiviews must be enabled for the SDK directory to turn on this Apache feature for the specified directory.

- **Options FollowSymLinks** - FollowSymLinks must be enabled for the SDK directory to turn on this Apache feature for the specified directory.


SDK PHP Server Configuration
---

Once you have configured your virtual server, you must configure the SDK PHP Server with proper authorization credentials to allow it to communicate with the AT&T APIs. To complete this step, you must first configure an app in your AT&T Developer Program account.

Open ___[docroot]___/server/php/public_html/att/config.php and update the following settings:

	$config = array(

	  # AppKey and Secret are from the AT&T Developer Program Web site
	  "AppKey" => "XXXXXX",
	  "Secret" => "XXXXXX",

	  # The address of the locally running server. This is used when a callback URL is
	  # required when making a request to the AT&T APIs.
	  # IMPORTANT - REMOVE TRAILING SLASHES FROM SERVER NAMES
	  "localServer" => "http://127.0.0.1:4567",

	  # AT&T API configuration - do not modify these values unless you are an administrator.
	  # apiHost is the main endpoint through which all API requests are made.
	  "apiHost" => "https://api.att.com",
	  
	  # clientModelScope is the string of API scopes your app requires access to.
	  "clientModelScope"  => "SMS,SPEECH,STTC,TTS",
	
	  "defaultGrammarFile" => "grammar.srgs",
	  "defaultDictionaryFile" => "dictionary.pls",
	);

Modify the configuration settings to match the app you created, making sure that the OAuth callback matches your PHP server settings.
 Default is 'http://localhost:4567/att/callback.php'

Debugging
---

Logging to a dedicated log file can also be configured in the same config.php file.

	define("DEBUG", "1");
	define("DEBUG_LOGGER", "/some/writable/absolute/path/att-php.log");

Certificate Bundle
---

The default option for cURL connections in the PHP server is to verify and authenticate the SSL certificates presented by the AT&T API servers. If you wish to provide your server with this level of security, you must ensure that cURL is configured with an up-to-date certificate bundle. Most server environments will not require this step.

If you have problems connecting to the AT&T APIs while this feature is enabled, disabling the SSL checks may correct any connection problems. If it does, the certificate bundle is out of date or missing, and should be updated.

To turn off verification, modify the following line in the **config.php** file of the SDK PHP server:

	define("ENABLE_SSL_CHECK", false);	

For more information about the location of the certificate bundle on your server, and how to update it, please visit the following pages:

	http://curl.haxx.se/docs/sslcerts.html

	http://wiki.cacert.org/FAQ/ImportRootCert


Running the App
---
Your app should now be configured and ready to use. Open http://[yourhost]:[yourport]/ in a supported browser and start exploring the '/webcontent' virtual directory for samples.


