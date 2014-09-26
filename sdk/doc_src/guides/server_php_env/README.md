PHP Environment Setup
====

To use the PHP version of the SDK server we strongly recommend using the [Apache HTTP server](http://projects.apache.org/projects/http_server.html) with PHP and cURL modules installed and enabled. 


Required Software
---
The following software is required to launch the SDK and use the examples included in the kit: 

+ Apache HTTP Server ([http://projects.apache.org/projects/http_server.html](http://projects.apache.org/projects/http_server.html))<br/>
+ PHP ([http://www.php.net](http://www.php.net))<br/>
+ cURL ([http:/curl.haxx.se](http://curl.haxx.se))<br/>

Alternatively, you can download and install XAMPP or OS X MAMP, which include all of the above software in one package:

+ XAMPP ([http://sourceforge.net/projects/xampp/files](http://sourceforge.net/projects/xampp/files/))<br/> 
+ MAMP ([http://www.mamp.info/en/index.html](http://www.mamp.info/en/index.html))
+ Current CA Bundle ([http://curl.haxx.se/docs/sslcerts.html](http://curl.haxx.se/docs/sslcerts.html))

Environment Installation
---
The following sections briefly describe how to download and install Apache, PHP and cURL on three popular development environments so that it will meet the minimum requirements of the AT&T SDK. For other operating systems, or for detailed installation instructions, please see the links in the Required Software section of this guide. Once installation has been completed, you can configure your server as outlined in the [PHP Server Guide](#!/guide/server_php).

**Please Note**: This guide does not provide step-by-step instructions for setting up your web server environment. This guide assumes that you or someone at your organization has the experience and skills to install, configure, and maintain server software and modules.

Installing XAMPP on Windows
---

- Download and install XAMPP, which includes the Apache, PHP and cURL software packages.

<http://sourceforge.net/projects/xampp/files/XAMPP%20Windows/>

- Once installed, you must uncomment the following line in xampp/php/php.ini: 

    extension=php_curl.dll

See "Configuring Apache to Access the SDK" in the [PHP Server Guide](#!/guide/server_php) for more information.

Installing Apache, PHP, and cURL on Ubuntu
---

Use this command to install Apache and PHP:

    $ sudo apt-get install apache2 mysql-server php5 libapache2-mod-php5 php5-xsl php5-gd php-pear libapache2-mod-auth-mysql php5-mysql

Use this command to install cURL for PHP:

    $ sudo apt-get install php5-curl

See "Configuring Apache to Access the SDK" in the [PHP Server Guide](#!/guide/server_php) for more information.


Installing MAMP on OS X
---

If Apache and PHP are not already installed, installing MAMP provides both:

<http://www.mamp.info>

cURL is included in OSX

See "Configuring Apache to Access the SDK" in the [PHP Server Guide](#!/guide/server_php) for more information.
