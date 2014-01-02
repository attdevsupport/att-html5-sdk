Sencha PHP SDK Server
===

This guide provides instructions for configuring your environment (in this case, the Apache web server) so that the included Sencha SDK may correctly access the PHP server components. This also allows you to access the PHP server routines as a standalone toolkit should you desire to create your own tools for accessing the AT&T APIs.

Assumptions
---
This guide assumes that you have a functioning web server running on your development environment with a cURL enabled PHP module installed. If you do not have access to a running Apache server with PHP that meets these requirements, see our [PHP Server Environment Setup](#!/guide/server_php_env) for guidelines on obtaining and installing these packages.

Required Configurations
----

- Apache
	- The **mod_negotiation** and **mod_alias** modules must be loaded in the Apache HTTP server. These modules are required for both the Alias and Multiviews switches used when configuring your SDK virtual host, an example of which is shown in the Configuring Apache to Access the SDK section below.

- PHP
	- PHP must have cURL support enabled. To test this, create a script that calls `phpinfo()` and point your browser to it to see your current PHP configuration.
	- In your php.ini file, the **short_open_tag** setting should be set to **On**
	- Optionally setting **display_errors = Off** in php.ini will prevent errors from interfering with the app.

- Review the documentation and account setup instructions found on the AT&T Devconnect website.


PHP Server Documentation
---
The SDK download includes PHP documentation in [/server/php/docs/index.html](../server/php/docs/index.html).


Unpacking the SDK
---

Copy the SDK zip file to the directory where you wish the kit to reside. This can be a new directory specifically created for the SDK and any application you wish to create, or this can be an existing directory where other files already exist that you wish to provide access to the SDK. 

Configuring Apache to Access the SDK 
---

To utilize the SDK, it is suggested that you configure your webserver with a virtual host which is has the **DocumentRoot** set to where you unzipped the SDK.

The following example shows a typical virtual host configuration and details the settings required to enable SDK access to your application. Please note that this example shows the minimum requirements needed for proper configuration. Any additional configuration that may be required by your application is beyond the scope of this documentation. 

	NameVirtualHost *:PORT

	<VirtualHost *:PORT>
		ServerName att.dev.local
		DocumentRoot "[docroot]/"

		# Create a convenience alias which points to the SDK PHP server root directory
		# This alias will be used when setting up your application in your ATT developer account

		Alias /att [docroot]/server/php/public_html/att

		<Directory "[docroot]/">
			Options MultiViews
			AllowOverride None
			Order allow,deny
			Allow from all
		</Directory>

	</VirtualHost>

Replacing ___[docroot]___ with the full path of where you unzipped the SDK, the required settings from the above example are:

* **ServerName** - 
The virtual name of your website where your application and SDK will reside. (eg application.mysite.com) This can be either a locally mapped domain name (in your /etc/hosts file) or a name configured in your DNS server.

- **DocumentRoot** - The directory where you unpacked the SDK.

- **Alias** - a shortcut virtual directory for use in your application configuration in your ATT Developer account and by the SDK PHP server itself.

- **Options MultiViews** - Multiviews must be enabled for the SDK directory. Using this switch turns this Apache feature on for the specified directory.

**Note**: If you are using Apache 2.3.11 or higher, the **NameVirtualHost** configuration has been deprecated and no longer needed. The VirtualHost configuration handles ip addresses and ports completely.

Once you have added the above configuration information to the Apache virtual hosts configuration file, you will need to restart your Apache server for the changes to take effect.


SDK PHP Server Configuration
---

Once you have configured your virtual server, you will need to configure the SDK PHP Server with proper authorization creditials to allow it to communicate with the AT&T APIs. To complete this step, you must have first configured an application in your account at [AT&T Devconnect](https://devconnect-api.att.com).

Open ___[docroot]___/server/php/public_html/config.php and update the following settings:

	$provider = new Sencha_ServiceProvider_Base_Att(array(

	  # Client ID and Secret from the AT&T Dev Connect portal.

	  "apiKey" => "XXXXXX",
	  "secretKey" => "XXXXXX",

	  # The address of the locally running server. This is used when a callback URL is
	  # required when making a request to the AT&T APIs.

	  "localServer" => "http://127.0.0.1:8888",

	  # This is the main endpoint through which all API requests are made. 
	  # This value should normally never need to be modified.

	  "apiHost" => "https://api.att.com"
	));

Modify the configuration settings to match the application you created at [AT&T Devconnect](https://devconnect-api.att.com).

Debugging
---

Logging to a dedicated log file can also be configured in the same config.php file

	define("DEBUG", "1");
	define("DEBUG_LOGGER", "/some/writable/absolute/path/att-php.log");


Running the Application
---
Your application should now be configured and ready to use. Open http://[yourhost]:[yourport]/ in a supported browser and start exploring the '/client' directory for examples.