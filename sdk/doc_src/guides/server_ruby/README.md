Ruby Server for the HTML5 SDK
===

This guide provides instructions for creating a web server using Ruby and Sinatra. At the end of this guide you will have created an HTML5 web application that can host the SDK sample applications and connect to the AT&T APIs.

This project consists of the following parts:

 - A Ruby wrapper for the AT&T HTML5 APIs (in server/ruby/lib)
 - A set of endpoints that an HTML5 client can use for proxy calls to the AT&T APIs 
 ([Ruby Server Endpoint Documentation](server/ruby/index.html)).
 - Hosting for the HTML5 SDK sample applications (in the webcontent directory)


Prerequisites
----

Make sure that the following development tools are installed in your environment:

 - Xcode (on OS X)
 - Ruby   See [Ruby Server Environment Setup](#!/guide/server_ruby_env)
   

Server Configuration
---

Open server/ruby/conf/att-api.properties and update the following settings using the App Key and App Secret settings from the application you previously registered on the 
[AT&T Developer Site](http://developer.att.com).

    appKey : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    secretKey : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

To access the SDK samples remotely, not just via localhost, Update the following two lines of the config file with appropriate host name values:

    localServer : http://localhost:4567
    localAuthServer: https://localhost:4568

    
This SDK comes with a default set of self-signed certificates in the 
server/ruby/certs folder. These will work for most of the samples.

NOTE: Since these default certificates are self-signed, you will get a certificate warning the first time you access the SSL server (listener.rb). You can continue, or pay for real server certificates.

A few of the samples demonstrate scenarios that involve incoming notifications from AT&T, which can require certificates with domain names that match the actual name of the server hosting the samples. You can generate or obtain appropriate self-signed certificates or purchase registrar-signed certificates. If you use your own certificate files, place them in the server/ruby/certs directory.

If you do not use the included certificates, edit the following lines in server/ruby/att/listener.rb to refer to your certificates instead of the default set of certificates:

    :cert_chain_file => File.join(File.dirname(__FILE__), '../certs/www.example.com.cert'),
    :private_key_file => File.join(File.dirname(__FILE__), '../certs/www.example.com.key'),
  
Run using the command line
---

To start the Ruby server, type the following commands  at a command prompt
in the sdk/server/ruby/att directory: 

    $ ruby app.rb
    $ ruby listener.rb

The app.rb command processes incoming HTTP traffic, and the listener.rb 
command processes HTTPS traffic.

If you prefer an interactive display, run these commands in two separate shells.

You can also use the 'nohup' command to run the server in the background 
(<http://en.wikipedia.org/wiki/Nohup>):

    $ nohup ruby app.rb &

There is a Windows script (run.cmd) and unix shell script (run.sh) that starts both servers.
    
The application should now be running on http://localhost:4567/ and https://localhost:4568 by default.


Stopping the server
---

If you run the server as an interactive process you must end the process manually using control-c.

If you use the 'nohup' command to run the server in the background, remember to manually end the process when you are done with it.

Cert Bundle
---

The AT&T API servers require secure connections. If you observe SSL errors when your Ruby server attempts to call the AT&T APIs, you can explicitly specify your trusted certificate authority chain by obtaining a cert bundle (a .pem file), uncommenting the following line in your Ruby app.rb file, and updating the .pem file shown to match your cert bundle.

    # If you have a CA certificate uncomment next line and add it in here
    #  @@att.agent.ca_file = 'mycacert.pem'

For testing purposes only, you can also disable SSL verification in the Ruby server by changing the **enableSSLCheck** setting in the **att-api.properties** file, as follows:

    enableSSLCheck : false
