Ruby Server for the HTML5 SDK
===

This guide provides instructions for creating a web server using Ruby and 
Sinatra. At the end of this guide you will have an HTML5 web application that 
hosts the SDK sample applications and can connect to the AT&T back-end APIs.

This project consists of the following parts:

 - A Ruby wrapper for AT&T's HTML5 APIs (in server/ruby/lib)
 - A set of endpoints that an HTML5 client can use to proxy calls through to the 
 back-end AT&T APIs 
 ([Ruby Server Endpoint Documentation](server/ruby/index.html)).
 - Hosting for the HTML5 SDK sample applications (in the 'webcontent' directory)


Prerequisites
----

Make sure that the following prerequisites are installed:

 - On OS X, the XCode development tools must be installed
 - Ruby, installed as described in the 
 [Ruby Server Environment Setup](#!/guide/server_ruby_env)
   

Server Configuration
---

Open server/ruby/conf/att-api.properties and update the following settings with 
the matching settings from the application you have registered on the 
[AT&T Developer Site](http://developer.att.com).

    apiKey : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    secretKey : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

If you wish to access the SDK samples remotely, not just via localhost, you 
should also update the following two lines of the config file with appropriate 
host name values:

    localServer : http://localhost:4567
    localAuthServer: https://localhost:4568

    
The SDK comes with a default set of self-signed certificates in the 
server/ruby/certs folder. These will work for most of the samples.

NOTE: Since these default certificates are self-signed, you will get a 
certificate warning the first time you access the SSL server (listener.rb). You 
can either continue on through the warning, or pay for real server certificates.

A few of the samples demonstrate scenarios involving incoming notifications from 
AT&T, which can require certificates whose domain name matches the actual name 
of the server hosting the samples. Appropriate self-signed certificates can be 
easily generated or obtained from the internet. Registrar-signed certificates 
could alternatively be purchased.

If you choose not to use the included certificates, please edit the following 
lines in server/ruby/att/listener.rb so that they refer to your certificates 
instead of the default set:
<code>
    :cert_chain_file => File.join(File.dirname(__FILE__), '../certs/www.example.com.cert'),
    :private_key_file => File.join(File.dirname(__FILE__), '../certs/www.example.com.key'),
</code>
  
Run using the command line
---

Start the Ruby server by running the following two commands, in the 
sdk/server/ruby/att directory. You can do this in two seperate shells if you 
prefer an interactive display, or you can run the servers in the background as 
described below. (app.rb processes incoming HTTP traffic, and listener.rb 
processes HTTPS.)

    $ ruby app.rb
    $ ruby listener.rb

You can also use the 'nohup' command to run the server in the background 
(<http://en.wikipedia.org/wiki/Nohup>)

    $ nohup ruby app.rb &

There is a Windows script (run.cmd) and unix shell script (run.sh) that will 
start both servers.
    
The application will run on http://localhost:4567/ and https://localhost:4568 by 
default.


Stopping the server
---

If you run the server as an interactive process you will need to end the process 
manually using control-c.

If you use the 'nohup' command to run the server in the background just remember 
to manually end the process when you are done with it.

CERT Bundle
---

The AT&T API servers require secure connections. If you observe SSL errors when 
your Ruby server attempts to call those AT&T APIs, you can explicitly specify 
your trusted roots by obtaining a CERT bundle (a .pem file), uncommenting the 
following lines in your Ruby app.rb file, and updating the .pem file shown to 
match your CERT bundle.

    # If you have a CA certificate uncomment next line and add it in here
    #  @@att.agent.ca_file = 'mycacert.pem'

For testing purposes only, you can also disable SSL verification in the Ruby 
server by changing the **enableSSLCheck** setting in the **att-api.properties** 
file, as follows:

    enableSSLCheck : false
