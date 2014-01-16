# ProviderAPI
===

## Introduction

This project is the implementation of AT&T HTML5 SDK - aka BlackFlag - and it is intended to provide an HTML5 environment to access and consume RESTful API published by AT&T.

## Project Organization

The project is divided into 2 major components: server and sample. Each of them has its own build process in order to package the deliverables for AT&T. The package generated will contain as well the documentation that is generated using JSDuck.

### Package Deliverables

As of today, for each release we produce a zip file that will be uploaded to AT&T Readmine portal. That file is produced by executing the following script on sdk folder:

<code>sdk# ./package.sh</code>

This script will compile and package all server side languages and samples. The generated file will be placed on the root folder of the project. The name convention we are using, as per AT&T request, is the following:

**HTML5SDK-R{sdk.version.major}.{sdk.version.minor}-{yyyyMMddHHmm}.zip**

Where:  
- sdk.version.mayor: It is the Blackflag major version.  
- sdk.version.minor: It is the Blackflag minor version.
- yyyyMMddHHmm: Date format to indentify the build.

The sdk.version values are configured in th package.properties file.

## Content of Deliverable

### HTML5SDK-R{sdk.version.major}.{sdk.version.minor}-{yyyyMMddHHmm}.zip

This file contains the following:

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

This file is generated with the content of the packaged folder located at the project root folder. The packaged folder is created by the package.sh script.


## Creating a new Sample App

In order to create or add a new sample app we need to follow a few steps:

1 - Add your code into the sample app. Create your view, controller, model and store. Make the corresponding changes so the new sample can be accessible from the app.js and finally add a new entry onto the file <code>sdk/sample/assets/data/apps.json</code> which contains the list that will be displayed on the NavigationList for the Sample App.

2 - Create a new folder into <code>sdk/sample/standalone</code> named with your new feature (i.e sms) and create inside it a new folder per each sample you will create (basic, coupon, gallery, singlepay just to name a few examples). So at the end of this step you should have a folder: 

	sdk/sample/standalone/{feature-name}/{sample-name}

3 - Create a new app.js file with the following structure:

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


4 - Add your application to the build process. Edit <code>sdk/sample/build/build.xml</code> file and first create a new target as follows:

	
	<!-- {Sample package description} -->
	<target name="package-{feature-name}-{sample-name}">
		<property name="folder" value="${samples-output}/{feature}/App{sampleNumber}"/>

		<antcall target="add-common-files"></antcall>

		<copy file="${samples-input}/app/controller/sms/Basic.js"	todir="${folder}/app/controller/sms"></copy>
		<copy file="${samples-input}/app/view/sms/Basic.js"			todir="${folder}/app/view/sms"></copy>
		<copy file="${samples-input}/standalone/sms/basic/app.js"	todir="${folder}/app"></copy>
	</target>




-- TODO: Finish this
