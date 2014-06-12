Installing Ruby and Sinatra
===

Install Ruby and Sinatra (on Windows)
---

The Ruby tools needed for this project can be downloaded from the following 
locations:

* Ruby (the latest 1.9.x version should be used for best compatibility)
* Ruby DevKit (download the self-extracting archive matching your Ruby version)

Both tools are available from 
[the Ruby Installer web site](http://rubyinstaller.org).

After downloading those files, install them as follows:

1. Run the downloaded Ruby installer.
1. Run the downloaded Ruby DevKit self-extracting archive, and note the folder
to which you extract the DevKit files.
1. Open a new command window - since Ruby is installed, it is now available.
1. From the Ruby DevKit folder, run the command

        $ ruby dk.rb init

1. From the Ruby DevKit folder, run the command

        $ ruby dk.rb install

1. Next, install the Ruby libraries for this SDK by running the 
following command:

        $ gem install rspec sinatra json mechanize crack mime-types uuid \
        rest-client immutable_struct thin yard


Install Ruby and Sinatra (on Linux)
---

Different Linux distributions use different package management tools. You must 
use the tools appropriate to your distribution in order to install Ruby. You can find 
example commands below, but please note that the specific commands used will 
vary on different systems.

You may find it useful to use [RVM](http://rvm.io) to install Ruby in a 
distribution independent manner.

First, install Ruby; on some distributions you can use the following command:

    $ apt-get install ruby ruby-dev rubygems libxml2-dev libxslt1-dev

Next, install the required Ruby libraries using the following command:

    $ gem install rspec sinatra json mechanize crack mime-types uuid \
    rest-client immutable_struct thin yard

You may need to use sudo with the installation commands ('sudo apt-get', 
'sudo gem install') if your Ruby installation requires administrator privileges.

    
Install Ruby and Sinatra (on OS X)
---

Ruby comes pre-installed on OS X. Ensure that the Xcode developer tools are 
installed, and then install the required Ruby libraries as follows:

    $ sudo gem install rspec-expectations rspec sinatra json mechanize crack \
    mime-types uuid rest-client immutable_struct thin
