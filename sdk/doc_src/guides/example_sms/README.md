Simple Example Application: SMS
===

This SMS example is a simple Sencha Touch application that uses the AT&T API Platform SDK for HTML5 to send SMS messages to AT&T mobile numbers.

We **strongly** recommend, if you are unfamiliar with developing Sencha Touch applications, you explore our general introduction on getting started with Sencha Touch -- the [Sencha Touch Hello World](http://www.sencha.com/learn/hello-world) tutorial.


Prerequisites
---

This example assumes that you have already 

1. Created an [AT&T Developer Account](http://developer.att.com) for yourself.
2. Setup an application in your Developer Account and obtained the necessary API credentials for your application.
3. Downloaded and unpacked the SDK on your development environment.
4. Selected a preferred SDK server ([Ruby](/docs/#!/guide/server_ruby), [Java](/docs/#!/guide/server_java) or [PHP](/docs/#!/guide/server_php)) and have it configured with your API credentials and started.

##Launching the App
---
When the above steps have been completed, you can run the SMS example app by loading http://**yoursdkhost:yoursdkport**/examples/sms/index.html in your supported WebKit browser (eg. Chrome, Safari, etc). You should see a screen that looks like this (without the sample data already in the fields):

![overview](resources/images/examples-sms.png)


##Code Organization
---
All of the client code for this example is provided in the SDK you downloaded and can be found in the folder **client/examples/sms**. The application has the following layout which follows Sencha Touch 2 conventions.  We will explore each file and its contents throughout the remainder of this guide.

  <code>

	index.html
	app/
	  app.js
	  controller/
		Sms.js
	  view/
		Sms.js

  </code>


##Complete Walkthrough
---
The remainder of this guide will walk you step-by-step through this example application and attempt to explain every aspect of the code, how all components interact and are related, and hopefully give you a better understanding of the basic concepts in creating your first AT&T application using this SDK. We will walk you through each individual file, one by one beginning with ....

###index.html
---
The SMS application is launched from **client/examples/sms/index.html**. As you can see from the following code, **index.html** loads all of the CSS and JavaScript files needed to run the application. Please note that the include statements for the Sencha Touch CSS library and the Sench Touch framework reference directories outside the example application tree, elsewhere in the SDK. 


	<!DOCTYPE html>
	<html>
	  <head>
		<meta charset="utf-8">
		<title>Sencha AT&amp;T Test</title>
		<link rel="stylesheet" href="../../sdk/resources/css/sencha-touch.css" type="text/css">
		<script type="text/javascript" src="../../sdk/sencha-touch.js"></script>
		<script type="text/javascript" src="app/app.js"></script>
	  </head>
	  <body>
	  </body>
	</html>
		

####Standard Libraries Included
---
To build a Sencha Touch Application that can access the AT&T APIs, the standard libraries (listed below) must be included in **index.html**.

The most important of these are the Sencha Touch libraries (Sencha Touch and its required CSS files). These come included with your SDK and are located in the **client/sdk** directory of the SDK. While this application should run with any 2.x version of Sencha Touch, we recommend using the version provided with the SDK to avoid any problems with version conflicts. Should you wish to use a later version of Sencha Touch, you should update the locations of your library in **index.html** accordingly.

The following two files are required for a Sencha Touch application:

Sencha Touch CSS:

	<link type="text/css" rel="stylesheet" href="../../sdk/resources/css/sencha-touch.css">

The Sencha Touch debug build:

	<script type="text/javascript" src="../../sdk/sencha-touch.js"></script>


####Application Specific Include Files
---
The only other remaining file included is the core of the application - **app.js**. The contents of this file contains the essential Sencha Touch code which registers your application, loads all dependencies, defines location of source files for the AT&T Provider library and launches the application.

	<script type="text/javascript" src="app/app.js"></script>


###app/app.js
---

This file is the entry point for Sencha MVC Application. While it can be any name, Sencha Touch convention is to call the core application file **app.js**. The application file is where you define your application namespace, declare application dependencies, models, views and controllers it will use, and launch your application.

To properly load the AT&T Provider library, the application must be configured with the location of the library files. This can be accomplished by manually including the library files in the **index.html** file or, we can utilize the Ext.Loader to do this automatically. This example application makes use of the loader and details how to properly configure it to include the AT&T Provider library.

Simply put, the loader maps classnames found in your application to disk locations on your application server. Sencha Touch allows you to either manually load a class file (asynchronous loading) or it can automatically attempt to load source whenever it encounters a class which is not yet defined (synchronous loading). For more information about the Ext.Loader, please visit the [Ext.Loader documentation](http://docs.sencha.com/touch/2-0/#!/api/Ext.Loader). For more information about how Sencha Touch handles dependencies please review the [Managing Dependencies Guide](http://docs.sencha.com/touch/2-0/#!/guide/mvc_depndencies).

Our example application is a simple one, containing only a single controller and view - both named 'Sms'.

	/**
 	 * Enable the Sencha Touch loader.
 	 *
 	 * When the loader is enabled, Sencha Touch will attempt to load source files when it
 	 * encounters loader-specific properties within your code, or when it parses classnames
 	 * which are referenced, but not yet defined.
 	 */

	Ext.Loader.setConfig({
		enabled: true
	});

	/**
 	 * Configure the Sencha Touch loader with the location of the AT&T provider class source.
 	 *
 	 * Unless otherwise specified, the loader will look for the source files for all classnames
 	 * defined in your application's namespace in the directory 'app', under the directory containing
 	 * the file which is initially loaded by your client - in this case - index.html. 
 	 *
 	 * Any classname that is encounter which is not defined in your application's namespace (eg. 
 	 * 'AnotherApp.view.Sms') will have its source looked for in a directory of the same name as
 	 * the namespace, rather than 'app' (in this case 'AnotherApp/').
 	 *
 	 * The loader allows you to override the default location of class source files for other 
 	 * namespaces. This allows your application to access source code outside its directory tree, 
 	 * without the need to copy it into your application directory. This is very convenient if you
 	 * have utility classes that you wish to use in different applications allowing you to maintain
 	 * only a single copy of the utility class.
 	 *
 	 * The following configuration associates the namespace 'Att' with the directory '../../app/lib'.
 	 * Later in this application, we will take advantage of this configuration to tell our
 	 * application to include the AT&T provider source code.
 	 *
 	 * NOTE: The specified path must be accessible (relative or absolute) to your client and the 
 	 * access method used (file:// or http://). If not properly specified, the client will be
 	 * unable to load the required source files.
	 */
	
	Ext.Loader.setPath({
		'Att': '../../app/lib'
	});

	Ext.application({
		/**
		 * Give your application its own namespace. All classes under that namespace will automatically
		 * be searched for under the 'app' directory, unless otherwise directed to do so by the loader
		 * setPath command (see above).
		 *
		 * In this example application, we use the loader triggers 'controllers', 'views' and 'requires'.
		 */
		name: "SmsOnly",

		/**
		 * Declare the application controllers. The code in your controller listens for application events
		 * (clicks, taps, etc) as well as performing other event based operations. 
		 * 
		 * As 'controllers' is a loader trigger, the loader will first parse the items for this property,
		 * create a list of classnames found in the property, translate those to filenames and attempt to 
		 * load them.
		 *
		 * In this example the loader forms a classname 'SmsOnly.controller.Sms' and then translates 
		 * that into a filename of 'app/controller/Sms.js'. It then attempts to load that file.
		 */

		controllers: ['Sms'], 	// Load controller source app/controller/Sms.js

		/**
		 * Declare the application views. A view is what is presented to the end user and contains layout 
		 * information, content, form fields, buttons, etc. 
		 * 
		 * The 'views' property is also a loader trigger, and as above, the loader will attempt to
		 * form a list of classnames from the values, and load their respective files.
		 */

		views: ['Sms'],			// Load view source app/view/Sms.js

		/**
		 * When all code and dependencies are loaded into the client, the launch method is called which
		 * starts your application. In this example, we create an instance of the only view defined in the
		 * application, add that view to the current viewport, which then makes it visible to the user.
		 */
		launch: function() {
			// Create the main application view.
			var view = Ext.create('SmsOnly.view.Sms');
				
			// Add the view to the viewport (thereby displaying it to the user).
			Ext.Viewport.add(view);
		}
	});


###app/view/Sms.js
---

There is only one view for this simple application. As you can see, the view is fairly simple. Fields have been added to handle input text for a phone number, and a textarea for a message. Two buttons have also been added to perform the send message and retrieve status actions.

	/**
	 * Define the SMS view with its form fields and buttons. 
	 *
	 * The name of the view, 'SmsOnly.view.Sms', is not chosen at random. If the loader is to be
	 * able to load this source, we have to ensure that there is a relationship between the classname
	 * and the source file name. 
	 *
	 * Simply put, the classname must reflect the name and location of the file on the disk, and 
	 * vice-versa in order for the loader to properly function.
	 *
	 * The loader uses your classname to build a path to the source file. It replaces periods with
	 * slashes (backslashes for Windows) and adds a '.js'. It first, however, replaces  your application
	 * namespace with 'app' so SmsOnly.view.Sms becomes app/view/Sms.js. 
	 *
	 * All classnames should (but not necessarily must) be defined under the application namespace
	 * (in this case 'SmsOnly'). The loader follows a convention of expecting the source for views,
	 * controllers, models, and stores to be collectively found in their own group directories. This 
	 * makes for overall better organization of your application's components.
	 *
	 * This hierarchical approach to application layout allows you to keep the same filename for 
	 * logical groups of components. In this application we use 'Sms.js' as the name for both the 
	 * view and controller source file. This helps the developer to easily identify files in the 
	 * directory layout for what they do or contain.
	 */
	Ext.define('SmsOnly.view.Sms', {
		extend : 'Ext.Container',
		xtype  : 'sms-view',
			
		config : {
			/**
			 * Define a property to store the SMS Message Id, so we may reference it to retrieve
			 * the message status.
			 */
			smsId: null,
				
			fullscreen : true,			// Tell the app we want to take up the entire screen
			scrollable : 'vertical',	// The app is scrollable with vertical scrolling only
			layout     : 'vbox',		// The app will 'stack' elements vertically
			items : [{
				xtype  : 'toolbar',
				title  : 'SMS Example',
				docked : 'top'
			},	{
				xtype   : 'fieldset',
				defaults: {
					labelAlign : 'top',
					labelWidth : '100%'
				},
				items: [{
					xtype : 'textfield',
					label : 'To',
					name  : 'to'
				},	{
					xtype : 'textareafield',
					label : 'Message',
					name  : 'message'
				}]
			},	{
				/**
				 * send message button
				 */
				xtype  : 'button',
				action : 'sendsms',
				text   : 'Send SMS'
			}, {
				/**
				 * get status button
				 */
				xtype  : 'button',
				action : 'smsstatus',
				text   : 'SMS Status'
			}]
		}
	});


###app/controller/Sms.js
---

As with the above view, the name of the controller follows the same rules for proper loader functionality. The loader will parse this classname to end up with a disk file name of **app/controller/Sms.js**.

The following code show how it defines the behavior for the Sms view and performs the calls to the AT&T Provider. 

For more information about controllers and their properties, please view the [Controllers](http://docs.sencha.com/touch/2-0/#!/guide/controllers) documentation.

	/**
	 * Define the SMS controller and create an instance of the AT&T Provider class.
	 *
	 * As with the application view, the name of the controller - 'SmsOnly.controller.Sms', is not
	 * chosen at random. Please review the comments in the SMS view source to read an explanation
	 * of naming your classes and how it affects your application's interaction with the loader.
	 */

	Ext.define('SmsOnly.controller.Sms', {
		extend : 'Ext.app.Controller',
			
		/**
		 * Load the AT&T Provider source
		 *
		 * The 'requires' loader trigger manually tells the loader that we are going to be using the 
		 * Att.Provider class in this controller and that the source should be loaded. As the location 
		 * of the Att namespace source files has already been given with the Ext.Loader.setPath command
		 * in the app.js file, the loader uses that value to formulate the location of the source.
		 */
		requires : [
			'Att.Provider'  // Load the file ../../app/lib/Provider.js
		],
			
		/**
		 * Configure properties for your controller.
		 *
		 * Sencha Touch automatically generates 'getter', 'setter', 'updater' and 'applier' methods
		 * for all the properties listed in the config object. These methods allow your controller to
		 * easily 'get', 'set', 'update' and 'apply' (initialize) values for these properties. 
		 *
		 * These automatically generated methods may be overridden by simply defining your own method
		 * with the same name. In this example, we define an applyProvider method to initialize the
		 * provider config properties with an instance of the AT&T Provider class object.
		 */
		config : {
			/**
			 * Define a property to hold a reference to Att.Provider instance. 
			 */
			provider: undefined,

			/**
			 * Create a reference to the sole view in your application. Your controller will be able
			 * to reference the view using a getter method - getView(). 
			 */	
			refs : {
				view : 'sms-view'
			},
				
			/*
			 * Define the events that your controller will listen for and subsequently trigger
			 * methods to execute when that event happens.
			 */
			control : {
				'button[action=sendsms]' : {
					'tap': 'onSendSms'
				},
				'button[action=smsstatus]' : {
					'tap': 'onSmsStatus'
				}
			}
		},
			
		/**
		 * Initilize the controller's AT&T provider class object.
		 *
		 * Here we provide an initialization method for the provider property above. This method
		 * is called when the controller is instantiated.
		 * 
		 * This initializer is simple in that it checks to see if 'provider' has a value, and if
		 * it does not it creates an instance of the Att.Provider class and assigns that to the
		 * property for use throughout the application. Once initialized, your application will
		 * have access to all of the AT&T Provider methods for communicating with the AT&T APIs.
		 */
		applyProvider : function(provider) {
			if (!provider) {
				provider = Ext.create('Att.Provider',{
					apiBasePath: '/att' 
				});
			}
			return provider;
		},
			
		/**
		 * Define an event handler for the Sendsms button when it is clicked. It will call the 
		 * Att.Provider.sendSms method with the values entered in the view.
		 */
		onSendSms : function() {
			var me = this,
				provider = me.getProvider(),
				view = me.getView(),
				to = view.down('textfield[name=to]').getValue(),
				message = view.down('textareafield[name=message]').getValue();
			
			view.setMasked(true);
				
			provider.sendSms({
				address : to,
			  	message : message,
			   	success : function(result) {
					//save the message id
				   	view.setSmsId(result.Id);
					view.setMasked(false);
					   
					Ext.Msg.alert("Message sent!", "Id: " + result.Id);
				}
			});
		},
			
		/**
		 * Define an event handler for the Smsstatus button. Once we have a Sms message successfully
		 * sent we store the message's ID in a view property - SmsId. This method retrieves that Id 
		 * value and uses it as a parameter to the Att.Provider.getSmsStatus method.
		 */
		onSmsStatus: function() {
			var me = this,
				provider = me.getProvider(),
				view = me.getView(),
				smsId = view.getSmsId();
				
			view.setMasked(true);
				
			provider.getSmsStatus({
				smsId   : smsId,
				success : function (result) {
					var info = result.DeliveryInfoLust.DeliveryInfo[0];
					view.setMasked(false);
						
					Ext.Msg.alert("Message Status","Status: " + info.DeliveryStatus);
				} 
			});
		}
	});
