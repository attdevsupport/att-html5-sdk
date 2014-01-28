# AT&T HTML5 SDK

----------

## Introduction

This project is the implementation of AT&T HTML5 SDK and it is intended to provide an HTML5 environment to access and consume RESTful API published by AT&T.

## Content of Deliverable

The SDK contains the following:

Each release consists of a zip file containing the SDK. Please refer to the [SDK Filename Format](#sdk-filename-format) section below for more details on the filename. Please refer to the [Building The SDK](#building-the-sdk) section below for instructions describing how you can build the SDK yourself.

- **SDK Documentation** Located at <code>doc</code> folder
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

## Building The SDK
The SDK is produced by executing the following script on sdk folder:

 <code>sdk# ./package.sh</code>

This script will compile and package all server side languages and samples. The generated file will be placed on the root folder of the project. 

The packaging process has a number of dependencies you will need to set up in advance, as described below:

##Setting up a VirtualBox Build Environment

The project was originally created by Sencha (ExtJS) and as such is designed to build at the bash command line for Linux.

### Initial Steps

It could be possible to setup a Windows Bash shell and install all of the various open-sourced dependencies, but for Windows users, an Oracle VirtualBox VM is recommended.

1. Download and install VirtualBox [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)
2. Select a Linux Distro. I recommend *avoiding* Debian-based distros such as Ubuntu or Mint, as they are very hostile to Ruby. You can get it to work anyway, but it is painful. I used Fedora, which worked much better, though it seems like there are more issues with it having to compile binaries rather than binaries already built to install directly, since it isn't exactly a hugely popular distro. Any distro that has an .ISO format download will work with Virtual Box.
3. If you use a 64-bit version (which makes sense on any 64-bit machine), make sure that when you create a new virtual machine with VirtualBox that the version is also set to 64 bit or you will get an error.
4. You will need to install the java, including the SDK. Either the Oracle JDK or OpenJDK will work just fine. It's probably easier to use OpenJDK on most distros, as they have already at installed openJava. 
5. You must have JAVA\_HOME and JAVA\_SDK environment variables pointing to the correct locations for the scripts to work. Type <code>echo $JAVA\_HOME</code> and <code>echo $JAVA\_JDK</code> at the Bash Terminal prompt, and if nothing happens, these variables have not been set. They were not set by default on any of the distros I tried.
5. Install 1.9.3 version of Ruby. You may need to install RVM to manage Ruby installations, rather than use the built in installers for your distro. RVM has the ability to specify which version of Ruby you want to use.
6. Ruby has several dependencies on things like GCC and GCC++ and the aforementioned JavaSDK, which RVM may handle properly. I messed up Ubuntu several times trying to get this right.
7. Once ruby is installed, you will need RubyGems as well.

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
3a. Common gems that will be used to run this project are:
	1. jsduck
	2. thin
	3. crack
	4. mechanize
	5. uuid
	6. immutable_struct
	7. rest-client

4.	One thing that helps is that if you get the rubyGem name approximately right, the gem install will often suggest an alternative after a long pause, which usually is correct. 
5.	You may need to install the thin server <code>gem install thin</code> on top of sinatra, which fixes a bug that prevents sinatra from running.

## Creating a new Sample App

In order to create or add a new sample app we need to follow a few steps:

1. Add your code into the sample app. Create your view, controller, model and store. Make the corresponding changes so the new sample can be accessible from the app.js and finally add a new entry onto the file <code>sdk/sample/assets/data/apps.json</code> which contains the list that will be displayed on the NavigationList for the Sample App.

2. Create a new folder into <code>sdk/sample/standalone</code> named with your new feature (i.e sms) and create inside it a new folder per each sample you will create (basic, coupon, gallery, singlepay just to name a few examples). So at the end of this step you should have a folder: 

	<code>sdk/sample/standalone/{feature-name}/{sample-name}</code>

3. Create a new app.js file with the following structure:

	    Ext.Loader.setConfig({
    		enabled: true
      	});
    	
    	Ext.Loader.setPath({
    		'Att': 'app/lib'
    	});
    	
    	/**
    	 * {Sample description here}
    	 * @class SampleApp
    	*/
    	Ext.application({
      	   name: 'SampleApp',
    	
    	   //# 1 add your controllers, views, models and stores here
    	   controllers: [],
    	   views: [],
    	
    	   launch: function(){
    	      Ext.Viewport.add({
	    	      xtype: 'container', 
	    	      fullscreen: true,
	    	      layout: 'card',
	    	      items:[{
	    	         xtype: 'toolbar',
	    	         title: '', // # 2 Complete the name of your sample 
	    	         docked: 'top',
	    	         ui: 'att'
	    	       },{
	    	          xtype: '' // # 3 Reference your main view using an xtype
    	   		  }]
    		   });
    		}
    	});

4. Add your application to the build process. Edit <code>sdk/sample/build/build.xml</code> file and first create a new target as follows:

	<!-- {Sample package description} -->
	<target name="package-{feature-name}-{sample-name}">
		<property name="folder" value="${samples-output}/{feature}/App{sampleNumber}"/>

		<antcall target="add-common-files"></antcall>

		<copy file="${samples-input}/app/controller/sms/Basic.js"	todir="${folder}/app/controller/sms"></copy>
		<copy file="${samples-input}/app/view/sms/Basic.js"			todir="${folder}/app/view/sms"></copy>
		<copy file="${samples-input}/standalone/sms/basic/app.js"	todir="${folder}/app"></copy>
	</target>

## SDK Filename Format
The name convention we are using, as per AT&T request, is the following:

<code>HTML5SDK-R**{sdk.version.major}**.**{sdk.version.minor}**-**{yyyyMMddHHmm}.zip**</code>

Where:
	
- **{sdk.version.major}** is the SDK major version.  
- **{sdk.version.minor}** is the SDK minor version.
- **{yyyyMMddHHmm}** is the formatted date to identify the build.

The sdk.version values are configured in the package.properties file.




