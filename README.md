# AT&T HTML5 SDK

----------

## Introduction

The HTML5 SDK provides an HTML5 framework for calling back-end web services published by AT&T.

## SDK Contents

Each release consists of a zip file containing the SDK. Please refer to the [SDK Filename Format](#sdk-filename-format) section below for more details on the filename. Please refer to the [Packaging The SDK](#packaging-the-sdk) section below for instructions describing how you can build the SDK yourself.

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

## Consuming the SDK

If you want to use the SDK, please unpack the associated ZIP file and read the documentation in it. The remainder of the instructions below are intended for AT&T developers and contractors who are modifying and updating the SDK.

## The 'working' Directory Quick-Start

A working deployment of the SDK is checked into the 'working' directory off of the project root. After installing the prerequisite Ruby software described below, you can run the samples app server:

    working\server\ruby\example> ruby app.rb
    
And then you can view the samples by navigating a Chrome browser to:

    http://localhost:4567

You can also alternatively run the Java or PHP server, after setting up their associated prerequisites.
    
## SDK Filename Format
The name convention we are using, as per AT&T request, is the following:

<code>HTML5SDK-R**{sdk.version.major}**.**{sdk.version.minor}**-**{yyyyMMddHHmm}.zip**</code>

Where:
	
- **{sdk.version.major}** is the SDK major version.  
- **{sdk.version.minor}** is the SDK minor version.
- **{yyyyMMddHHmm}** is the formatted date to identify the build.

The sdk.version values are configured in the package.properties file.

## Packaging The SDK

The SDK is produced by executing the following script on sdk folder:

  <code>sdk# ./package.sh</code>

This script will compile and package all server side languages and samples. The generated file will be placed on the root folder of the project. 

Note that the SDK is generated from the 'sdk' directory of the source tree, not the 'working' directory. The 'working' directory is checked in as a development convenience - please ensure changes intended for the official release are copied into the 'sdk' directory. The 'copyBack' script can be used to copy changes from the 'working' directory to the 'sdk' directory.

The packaging process has a number of dependencies you will need to set up in advance, as described below:

##Setting up a VirtualBox Build Environment

The project was originally created by Sencha (ExtJS) and as such is designed to build at the bash command line for Linux.

### Initial Steps

It could be possible to setup a Windows Bash shell and install all of the various open-sourced dependencies, but for Windows users, an Oracle VirtualBox VM is recommended.

1. Download and install VirtualBox [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)

2. Select a Linux Distro. I recommend *avoiding* Debian-based distros such as Ubuntu or Mint, as they are very hostile to Ruby. You can get it to work anyway, but it is painful. I used Fedora, which worked much better, though it seems like there are more issues with it having to compile binaries rather than binaries already built to install directly, since it isn't exactly a hugely popular distro. Any distro that has an .ISO format download will work with Virtual Box.

3. If you use a 64-bit version (which makes sense on any 64-bit machine), make sure that when you create a new virtual machine with VirtualBox that the version is also set to 64 bit or you will get an error.

4. You will need to install the java, including the SDK. Either the Oracle JDK or OpenJDK will work just fine. It's probably easier to use OpenJDK on most distros, as they usually have already installed openJava. 

5. You must have JAVA\_HOME and JAVA\_SDK environment variables pointing to the correct locations for the scripts to work. Type <code>echo $JAVA\_HOME</code> and <code>echo $JAVA\_JDK</code> at the Bash Terminal prompt, and if nothing happens, these variables have not been set. They were not set by default on any of the distros I tried.

6. Install 1.9.3 version of Ruby. Please refer to the documentation packaged with the SDK; it contains detailed instructions for installing the required Ruby components. This documentation is checked in at <code>sdk/doc_src/guides/server_ruby_env/README.md</code>, but the HTML version included in the SDK is more legible.


##Maintaining the Working Folder

The working folder has been added to this project to simplify code modifications. It was originally copied from the <code>webserver</code> and <code>server</code> folder in the build-generated <code>packaged</code> folder but must be maintained separately and very carefully.

This was done to eliminate cumbersome builds from source files every time a small change was needed. You can edit the code as necessary to get it to work. Any code changes to the examples are checked directly into this folder, and are shared with all the developers in the project.
 

###Maintaining the source build files

- **copyback.bat** This Windows/DOS batch file is checked into <code>sdk/copyback</code>, along with several subroutine batch files. It clones the <code>sdk/sample</code> folder into <code>sdk/sampleCopy</code> and then copies all of the source files into the correct places. You can then use a comparison tool, such as Beyond Compare, to compare the two folders before checking in. The <code>sdk/sampleCopy</code> folder is also excluded by .gitignore so it is not checked in.

- **build.xml** There are two of these used by the build process, but the most important one is located at <code>sdk/sample/build</code>.

Any time files are added, deleted, or renamed in examples both of these files must be edited. It is important to remember that the Linux build is case sensitive. There is a lot of convention in how the files and folders are named along with the view and controller naming references in the JavasScript code to get them into the correct places, but the case has to be correct for both the build and Sencha Touch to behave properly. Sometimes it is mixed case and sometimes it is all lowercase.

###Copying files back into the Working folder after a build

So after any build is done the <code>packaged</code> is created. However, this folder is **not** checked into the build since it is excluded in .gitignore.

After doing a build, you should compare the generated <code>packaged/webserver</code> folder with the <code>working/webserver</code> folder. There should not be any differences, except for the two Sencha files in <code>working/webserver/lib</code> folder that will not be provided in the final build. There will be a different time stamp on for the generated help documents, and the documents may be different if you have changed the code comments. 

I haven't been bothering to keep the generated documents up to date in the working folder, but probably near the end of this process we will have to be testing these for completeness.

BTW, I will plug again that Beyond Compare has a Linux version and an extremely affordable combined Windows/Linux license. You can try it out for free for a month in any case.

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
