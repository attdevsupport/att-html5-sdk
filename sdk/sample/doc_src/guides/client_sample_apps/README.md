Sample Applications
===

The AT&T HTML5 SDK includes a variety of Sencha Touch sample applications which utilize all of the available Provider API methods. These samples are based on specifications in the AT&T R2 Sample App Specification document.

Application Install and Setup
---

The sample applications are included in your SDK under the directory 'webcontent'. 

For example, if you have unzipped the samples.zip files into sdk/client/samples, you can point your browser to the url below for the Basic SMS service app. Note that its root folder is /apps/SMS/App1 and that server:port corresponds to which ever SDK server you have installed and configured.

 <http://server:port/samples/apps/SMS/App1/index.html>

 Documentation for each sample app can be found in the docs folder of each application 's root folder.  For example, the documentation for the Basic SMS service app would be found here:

 <http://server:port/samples/apps/SMS/App1/docs/index.html>

 If you wish to view a unified version of all of the sample applications, then you can do so by visiting:

 <http://server:port/samples/docs/index.html>

Advanced Application Install and Setup
----

If you want to install the sample apps in a folder other than the sdk/client folder then you will need to configure the application to point to the SDK server you have implemented in order to make the AT&T API calls.

This is done in each sample application /apps/API/App/app/Config.js file.  Change the apiBasePath to the endpoint you are using to access the SDK server code.

    apiBasePath : '/your/api/base/path',

**Note** The code takes the value you enter and will automatically add /att so do **NOT** add an ending forward slash.  

The <code>Config.js</code> file allows configuration for shortcodes used for the SMS Basic App. You *must* configure the following parameters with the values obtained on AT&T developer portal:

	shortCode: '{your short code here}'

and:
	
	anotherShortCode: '{another short code here}'


Reverse proxy setup (optional)
---

If you found the need to configure a sample application's apiBasePath property it might because you have defined a Reverse Proxy in your environment in prder to run the SDK server on its own port but want your application running from the default port 80.

**Note** If you are running the SDK server on a different TCP port than what is used to access the sample app (or any app using the SDK server) you **MUST** define a Reverse Proxy due to cross domain security issues)

Below are some examples of how you can configure your server to use Reverse Proxies in order to allow your endpoints from the client (browser) to map to different ports on your server and thus avoid these cross domain security issues.

    <VirtualHost *:80>

        DocumentRoot /your/path/to/the/sencha/packaged/samples/
        ServerName yourdomain.com

        # The Ruby server implementation defaults to port 4567
        ProxyPass /rubyapi/ http://localhost:4567/
        ProxyPassReverse /rubyapi/ http://localhost:4567/

        # The Java server implementation defaults to port 8080
        ProxyPass /javaapi/ http://localhost:8080/
        ProxyPassReverse /javaapi/ http://localhost:8080/

        The PHP server implementation defaults to port 8888
        ProxyPass /phpapi/ http://localhost:8888/
        ProxyPassReverse /phpapi/ http://localhost:8888/

    </VirtualHost>


Code Organization
---
All of the client code is located in the samples.zip file.  Once you unzip this file you will find that each sample is packaged into its own API/App folder.

The sample examples included in this release are:

 - (SMS) SMS Sample Apps
   - (App1) SMS App 1 - Basic SMS Service app
   - (App2) SMS App 2 - SMS Voting app
 - (MMS) MMS Sample Apps
   - (App1) MMS App 1 - Basic MMS service app
   - (App2) MMS App 2 - MMS Coupon app
   - (App3) MMS App 3 - MMS Gallery app
 - (WAPPush) WAPPush Sample Apps
   - (App1) WAPPush App 1 - Basic WAP Push Service app
 - (TL) TL Sample Apps
   - (App1) TL App 1 - Map of device location app
 - (Payment) PAYMENTS Sample Apps
   - (App1) Notary - Notary sample app
   - (App2) Single Pay - Single Payment / Transaction sample app
   - (App3) Subscription - Subscription Payment sample app
 - (MOBO) Message on Behalf of sample app
   - (App1) MOBO App 1 - Basic MOBO sample app
 - (MIM) My Messages sample app
   - (App1) MIM App 1 - Basic MIM sample app   
 - (Speech) Speech to text sample app
   - (App1) Speech App 1 - Basic Speech to text sample app 
 
The entry into each application is <code>/apps/{API}/{App}/index.html</code>, which will load all of the CSS and JavaScript needed to run the application. For instance, to run SMS App1 you should point to:

	/apps/SMS/App1/index.html

You can also use the /apps/index.html, /apps/index-att.html and /apps/index-sencha.html which include links to each Sample App provided by AT&T and Sencha.

