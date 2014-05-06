Installing Ruby and Sinatra
===

Install Ruby and Sinatra (on Windows)
---

The Ruby tools needed for this project can be downloaded from the following 
locations:

* Ruby (the latest 1.9.x version should be used for best compatibility)
* Ruby DevKit (download the self extracting archive matching your Ruby version)

These can both be installed from 
[the RubyInstaller web site](http://rubyinstaller.org).

After downloading those files, install them as follows:

1. Run the downloaded Ruby installer.
1. Run the downloaded Ruby DevKit self-extracting archive, and note the folder 
you extract the DevKit files to.
1. Open a new command window - since Ruby is installed, it is now available.
1. From the Ruby DevKit folder, run the command

        $ ruby dk.rb init

1. From the Ruby DevKit folder, run the command

        $ ruby dk.rb install

1. Next, install the Ruby libraries on which this SDK depends, by running the 
following command:

        $ gem install rspec sinatra json mechanize crack mime-types uuid \
        rest-client immutable_struct thin


Install Ruby and Sinatra (on Linux)
---

Different Linux distros use different package management tools. You will have to 
use the tools appropriate to your distro in order to install Ruby. We give 
example commands below, but please note that the specific commands used will 
vary on different systems.

You may find it useful to use [RVM](http://rvm.io) to install Ruby in a 
distro-independent manner.

First, install Ruby; on some distros you can use the following command:

    $ apt-get install ruby ruby-dev rubygems libxml2-dev libxslt1-dev

Next, install the required Ruby libraries as follows:

    $ gem install rspec sinatra json mechanize crack mime-types uuid \
    rest-client immutable_struct thin

You may need to sudo the installation commands ('sudo apt-get', 
'sudo gem install') if your Ruby installation requires administrator privileges.

    
Install Ruby and Sinatra (on OS X)
---

Ruby comes pre-installed on OS X. Ensure that the XCode developer tools are 
installed then install the required Ruby libraries as follows:

    $ sudo gem install rspec-expectations rspec sinatra json mechanize crack \
    mime-types uuid rest-client immutable_struct thin
