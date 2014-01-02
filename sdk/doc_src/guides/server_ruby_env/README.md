Installing Ruby and Sinatra
===


Install Ruby and Sinatra (on Windows)
---

The Ruby tools needed for this project can be downloaded from the following locations:

* Ruby (download the latest stable version)
<http://rubyforge.org/projects/rubyinstaller>
* Ruby DevKit (download the latest self extracting archive)
<https://github.com/oneclick/rubyinstaller/downloads>
* Ruby Gems
<http://rubyforge.org/projects/rubygems>

After downloading those files, install them as follows:

1. Run the downloaded Ruby installer.
1. Run the downloaded Ruby DevKit self-extracting archive, and note the folder you extract the DevKit files to.
1. Open a new command window - since Ruby is installed, it is now available.
1. From the Ruby DevKit folder, run the command

        $ ruby dk.rb init

1. From the Ruby DevKit folder, run the command

        $ ruby dk.rb install

1. Move the contents of the downloaded Ruby Gems ZIP file into a folder.
1. From the Ruby Gems folder, run the command

        $ ruby setup.rb

1. Next, install the Ruby libraries on which this SDK depends, by running the following command:

        $ gem install rspec sinatra json mechanize crack mime-types uuid --no-rdoc --no-ri

Install Ruby and Sinatra (on Linux)
---

Install Ruby using the following command:

    $ sudo apt-get install ruby ruby-dev rubygems libxml2-dev libxslt1-dev

Install the required Ruby libraries as follows:

    $ sudo gem install rspec sinatra json mechanize crack mime-types uuid --no-rdoc --no-ri

Install Ruby and Sinatra (on OS X)
---

Ruby comes pre-installed on OS X. Ensure that the XCode developer tools are installed then install the required Ruby libraries as follows:

    $ sudo gem install rspec-expectations rspec sinatra json mechanize crack mime-types uuid --no-rdoc --no-ri


