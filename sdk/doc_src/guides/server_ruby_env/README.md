Installing Ruby and Sinatra
===

Install Ruby and Sinatra (on Windows)
---

The Ruby tools needed for this project can be downloaded from the following locations:

* Ruby (the latest 1.9.x version should be used for best compatibility)
* Ruby DevKit (download the self-extracting archive that matches your Ruby version)

Both tools are available from 
[Ruby Installer web site](http://rubyinstaller.org).

Install the downloaded files as follows:

1. Run the Ruby installer.
2. Run the Ruby DevKit self-extracting archive, and note the folder location for the extracted DevKit files.
3. Open a new command window - since Ruby is installed, it is now available.
4. From the Ruby DevKit folder, run the following command:

        $ ruby dk.rb init

5. From the Ruby DevKit folder, run the following command:

        $ ruby dk.rb install

6. Install the Ruby libraries for this SDK by running the following command:

        $ gem install rspec sinatra json mechanize crack mime-types uuid \
        rest-client immutable_struct thin yard


Install Ruby and Sinatra (on Linux)
---

Linux distributions can have different package management tools. You must use the appropriate tools for your distribution in order to install Ruby. 
Example commands are provided in this guide, but the specific commands used will vary on different systems.

You may find it useful to install Ruby in a distribution independent manner by using [RVM](http://rvm.io).

1. Install Ruby with the following command:

    $ apt-get install ruby ruby-dev rubygems libxml2-dev libxslt1-dev

2. Install the required Ruby libraries with the following command:

    $ gem install rspec sinatra json mechanize crack mime-types uuid \
    rest-client immutable_struct thin yard

If your Ruby installation requires administrative rights, you may need to use sudo with the installation commands ('sudo apt-get', 
'sudo gem install').

    
Install Ruby and Sinatra (on OS X)
---

Ruby comes pre-installed on OS X. Ensure that the Xcode developer tools are installed, and then install the required Ruby libraries as follows:

    $ sudo gem install rspec-expectations rspec sinatra json mechanize crack \
    mime-types uuid rest-client immutable_struct thin
