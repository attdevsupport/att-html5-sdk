Sencha Ruby SDK
===

This guide provides instructions for creating a web application using Ruby and Sinatra. At the end of this guide you will have a Sencha Touch web application that can connect to the AT&T APIs

This project consists of 2 parts:

 - A Ruby wrapper for AT&T's HTML5 APIs (in ./lib)
 - An example server side application providing endpoints required for using the AT&T APIs (in ./example)

Prerequisites
----

Make sure that the following prerequisites are installed (minimum version in parenthesis)

 - On OS X, the XCode development tools must be installed
 - Ruby (1.8.7)
 - Ruby DevKit (1.8.7) (Windows only)
 - Ruby Gems (1.8.12)
   - rspec (2.6.0)
   - sinatra (1.2.6)
   - json (1.5.2)
   - mechanize (1.0.0)
   - crack (0.1.8)
   - mime-types (1.18)

If you don't meet the prerequisites, see our [Ruby Server Environment Setup](#!/guide/server_ruby_env) for instructions on how to install Ruby for Macintosh, Windows or Linux.

Ruby Server Documentation
---
The SDK download includes rdoc formatted documentation in [sdk/server/ruby/docs/index.html](../server/ruby/docs/index.html).


Server Configuration
---

Open conf/att-api.properites and find the following settings:

    # Replace these values with apiKey, secretKey and short code
    # For your application in devconnect.
    apiKey    : XXXXXX
    secretKey : XXXXXX

    # This is the main endpoint through which all API requests are made
    apiHost : https://api.att.com

    # The address of the locally running server. This is used when a callback URL is
    # required, when making a request to the AT&T APIs.
    localServer : http://127.0.0.1:4567


Run using the command line
---


To run the application you can use the included shell script. Just type the following at a command prompt (in the sdk/server/ruby directory):

    $ sh run.sh

Or, if your OS does not support the shell script, you can run the command directly by typing the following at a command prompt (in the sdk/server/ruby/example directory):

    $ ruby app.rb

You can also use the 'nohup' command to run the server in the background (<http://en.wikipedia.org/wiki/Nohup>)

    $ nohup sh run.sh &

And similarly, you can do the same without the shell script by typing the following at a command prompt (in the sdk/server/ruby/example directory):

    $ nohup ruby app.rb &

The application should now be running on http://yourhost:4567/

To change the port number pass a different port as the first argument:

    $ sh run.sh 4568

Or, without the shell script (in the sdk/server/ruby/example directory):

    $ ruby app.rb 4568


Stopping the server
---

If you run the server as an interactive process you will need to end the process manually using control-c.
If you use the 'nohup' command to run the server in the background just remember to manually end the process when you are done with it.

Possible Issues
---

If the Ruby SDK server fails to start due to "Invalid gemspec" errors, you can try and upgrade to the latest RubyGems by running the following command:

    $ gem update --system

If that doesn't fix the issue, then more possible fixes can be found here:

<http://stackoverflow.com/questions/7290575/invalid-date-format-specification-in-gemspec>