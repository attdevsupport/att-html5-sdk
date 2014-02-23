Ruby Server for the HTML5 SDK
===

This guide provides instructions for creating a web server using Ruby and Sinatra. At the end of this guide you will have an HTML5 web application that hosts the SDK sample applications and can connect to the AT&T back-end APIs.

This project consists of the following parts:

 - A Ruby wrapper for AT&T's HTML5 APIs (in server/ruby/lib)
 - A set of endpoints that an HTML5 client can use to proxy calls through to the back-end AT&T APIs.
 - Hosting for the HTML5 SDK sample applications (in the 'webcontent' directory)

 
Prerequisites
----

Make sure that the following prerequisites are installed (minimum version in parenthesis)

 - On OS X, the XCode development tools must be installed
 - Ruby, installed as described in the [Ruby Server Environment Setup](#!/guide/server_ruby_env)
   

Server Configuration
---

Open server/ruby/conf/att-api.properties and update the following settings with the matching settings from the application you have registered on the [AT&T Developer Site](http://developer.att.com).

    apiKey : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    secretKey : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


Run using the command line
---

To run the application you can use the included shell script. Just type the following at a command prompt (in the sdk/server/ruby directory):

    $ sh run.sh

Or, if your OS does not support the shell script, you can run the command directly by typing the following at a command prompt (in the sdk/server/ruby/example directory):

    $ ruby app.rb

You can also use the 'nohup' command to run the server in the background (<http://en.wikipedia.org/wiki/Nohup>)

    $ nohup sh run.sh &

The application is now running on http://localhost:4567/

To change the port number pass a different port as the first argument:

    $ sh run.sh 4568

Or, without the shell script (in the sdk/server/ruby/example directory):

    $ ruby app.rb 4568


Stopping the server
---

If you run the server as an interactive process you will need to end the process manually using control-c.
If you use the 'nohup' command to run the server in the background just remember to manually end the process when you are done with it.

CERT Bundle
---

The AT&T API servers require secure connections. If you observe SSL errors when your Ruby server attempts to call those AT&T APIs, you can explicitly specify your trusted roots by obtaining a CERT bundle (a .pem file), uncommenting the following lines in your Ruby app.rb file, and updating the .pem file shown to match your CERT bundle.

	# If you have a CA certificate uncomment next line and add it in here
	#  @@att.agent.ca_file = 'mycacert.pem'

For testing purposes only, you can also disable SSL verification in the Ruby server by changing the **enableSSLCheck** setting in the **att-api.properties** file, as follows:

	enableSSLCheck : false
