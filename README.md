# AT&T HTML5 SDK

----------

## Introduction

The HTML5 SDK provides an HTML5 framework for calling back-end web services published by AT&T.

## SDK Contents

Each release consists of two ZIP files: one containing the SDK source code, and the other with the SDK documentation. Please refer to the [SDK Filename Format](#sdk-filename-format) section below for more details on the ZIP filenames. Please refer to the [Building The SDK](#building-the-sdk) section below for instructions describing how you can build the SDK yourself.

- **SDK Documentation** Located at <code>doc</code> folder
- **Client side JavaScript library <code>att-api-client.js</code> 
- **Java Server Code** Java server side including:
    - Source code: <code>server/java/src</code>
    - Distributable war and jar files: <code>server/java/dist</code>
    - Documentation: <code>server/java/docs</code>  
- **PHP Server code** 
    - Source: <code>server/php/public_html</code>
    - Documentation: <code>server/php/docs</code>
- **Ruby Server code** 
    - Source: <code>server/ruby</code>
    - Documentation: <code>server/ruby/docs</code>
- **Standalone Sample Apps** Located at <code>webcontent</code>
- **License**

## Consuming the SDK

If you want to use the SDK, please unpack the associated ZIP files and read the documentation in the doc ZIP. The remainder of the instructions below are intended for AT&T developers and contractors who are modifying and updating the SDK.

## The SDK Developer's Quick-Start

The checked-in source tree represents a working deployment of the SDK. After installing the prerequisite Ruby software described below, you can run the samples app server:

    sdk/server/ruby/att> ruby app.rb

and

    sdk/server/ruby/att> ruby listener.rb
    
And then you can view the samples by navigating a Chrome browser to:

    http://localhost:4567

You can also alternatively run the Java or PHP server, after setting up their associated prerequisites.
    
## Installing Ruby 1.9.3 on Mac OSX

1. It is wise to install rvm first. Start by opening up terminal and running this command 'curl -L https://get.rvm.io | bash -s stable' 

2. After the installation of rvm run the following command: 'rvm install ruby-1.9.3-p484'

3. Make Ruby 1.9.3 default by running 'rvm --default ruby-1.9.3


## Installing the Sinatra Web Server

The following instructions apply to both the Virtual Box Environment and any Windows environment you are using to test the SDK code.

1. You will need the 1.9.3 version of Ruby (or perhaps any later one, though the 2.x branch was considered unstable at the time of writing this document).

2. To install any rubyGem, the syntax is:

    <code>gem install gemNameHere</code>

3. So installing sinatra is almost as simple as:

    <code>gem install sinatra</code>
    
    except that you may need to look at any error messages to install missing components or dependent gems. The messages are not exactly friendly. 
    
    Common gems that will be used to run this project are:

    - jsduck version 3.11.2
    - thin
    - crack
    - mechanize
    - uuid
    - immutable_struct
    - rest-client

    One thing that helps is that if you get the rubyGem name approximately right, the gem install will often suggest an alternative after a long pause, which usually is correct. 

4.  You may need to install the thin server <code>gem install thin</code> on top of sinatra, which fixes a bug that prevents sinatra from running.

## SDK Filename Format
The name convention we are using, as per AT&T request, is the following:

SDK source code: <code>HTML5SDK-R**{sdk.version.major}**.**{sdk.version.minor}**-**{yyyyMMddHHmm}.zip**</code>
SDK documentation: <code>HTML5SDK-R**{sdk.version.major}**.**{sdk.version.minor}**.doc-**{yyyyMMddHHmm}.zip**</code>

Where:
    
- **{sdk.version.major}** is the SDK major version.  
- **{sdk.version.minor}** is the SDK minor version.
- **{yyyyMMddHHmm}** is the formatted date to identify the build.

The sdk.version values are configured in the package.properties file.

## Packaging The SDK

The SDK is produced by executing the following script on sdk folder:

  <code>sdk# ./package.sh</code>

Although the packaging process should not place any unnecessary generated files in the release ZIP files, you may find it useful to run <code>git clean -fdx</code> before packaging, just to be sure.  

This script will compile and package all server side languages and samples. The generated files will be placed on the root folder of the project. One ZIP file will be created for the SDK development material, and a second ZIP file will be created for the SDK documentation.

Troubleshooting tip: If the package.sh script doesn't run, check the file's execution settings; you can enable the execute bit with:

    chmod +x package.sh

The packaging process has a number of dependencies you will need to set up in advance, as described below:

## Setting up a Build Environment

Note that the build process for this project was originally set up to run in a Linux environment; for best results we recommend doing the same. The free product [VirtualBox](https://www.virtualbox.org/wiki/Downloads) can be used to set up a Linux virtual machine.

1. Install the java, including the JDK. Either the Oracle JDK or OpenJDK will work just fine. 

2. You must have the JAVA\_HOME environment variable pointing to the correct location for the scripts to work. Type <code>echo $JAVA\_HOME</code> at the Bash Terminal prompt, and if nothing happens, the variable has not been set. It should be set to the root of your Java installation, and <code>$JAVA\_HOME/bin</code> should be in your <code>$PATH</code>.

3. Install Ruby; the latest version in the 1.9.x series currently is the most likely not to cause problems. (The dependent Ruby libraries are all present and reliable for 1.9.3.) Please refer to the documentation packaged with the SDK; it contains detailed instructions for installing the required Ruby components. This documentation is checked in at <code>sdk/doc_src/guides/server_ruby_env/README.md</code>, but the HTML version included in the SDK is more legible.

4. Install the Ant build tool, [as described on the Apache Ant web site](https://ant.apache.org/manual/install.html).

5. Install the JSDuck documentation tool. This is a Ruby gem that can be installed using the command below. If Ruby is installed as admin, you may need to prefix that command with 'sudo'. *NOTE* You _must_ install the older version of JSDuck listed below - the tool removed support for documenting non-JavaScript source code in more recent versions.

  * <code>gem install --version 3.11.2 jsduck</code>
