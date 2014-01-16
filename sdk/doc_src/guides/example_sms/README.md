Simple Example Application: SMS
===

This SMS example is a simple Sencha Touch application that uses the AT&T API Platform SDK for HTML5 to send SMS messages to AT&T mobile numbers.

We **strongly** recommend that if you are unfamiliar with developing Sencha Touch applications, you explore our general introduction on getting started with Sencha Touch -- the [Getting Started with Touch 2](http://docs.sencha.com/touch/2-0/#!/guide/getting_started) tutorial.


Prerequisites
---

This example assumes that you have already 

1. Created an [AT&T Developer Account](http://developer.att.com).
2. Setup an application in your Developer Account and obtained the necessary API credentials for your application.
3. Downloaded and unpacked the SDK in your development environment.
4. Selected a preferred SDK server ([Ruby](/docs/#!/guide/server_ruby), [Java](/docs/#!/guide/server_java) or [PHP](/docs/#!/guide/server_php)) and have configured and started it with your API credentials.

##Launching the App
---
When the above prerequisite steps have been completed, you can run the SMS example app by loading http://**yoursdkhost:yoursdkport**/examples/SMS/index.html in your supported WebKit browser (eg. Chrome, Safari, etc). You should see a screen that looks like this (without the sample data already in the fields):

![overview](resources/images/examples-sms.png)


##Code Organization
---
All of the source for client code for this example is provided in the SDK that you downloaded and can be found in the folder **examples/SMS**. The application has the following layout which follows Sencha Touch 2 conventions.  Each of the client code files and their contents are discussed in the **Complete Walkthrough** section of this guide. 

  <code>

	app.js
	app.json
	index.html
	packager.json
	app/
	  controller/
		Main.js
	  model/
	  profile/
	  store/
	  view/
		Main.js
	attlib/
	sdk/

  </code>


##Complete Walkthrough
---
The remainder of this guide will walk you step-by-step through the SMS example application and explain aspects of the code, such as how all the components interact and are related. This walkthrough will give you a better understanding of the basic concepts used in creating your first AT&T application using this SDK. 

Now, let's walk through each file in the SMS example application, beginning with ....

###index.html
---
The SMS application is launched from **examples/SMS/index.html**. As you can see from the following code, **index.html** loads all of the CSS and JavaScript files needed to run the application. Please note that the include statements for the Sencha Touch CSS library and the Sench Touch framework reference directories in the SDK that are outside of the example application tree. 


	<!DOCTYPE HTML>
	<html manifest="" lang="en-US">
	<head>
    	<meta charset="UTF-8">
   		<title>MyApp</title>

    	<!-- Include the Sencha Touch SDK and CSS files -->

	    <link type="text/css" rel="stylesheet" href="sdk/resources/css/sencha-touch.css">
    	<script type="text/javascript" src="sdk/sencha-touch-all.js"></script>

    	<!-- Include the application source file -->
    
	    <script type="text/javascript" src="app.js"></script>

    	<style type="text/css">
        	/**
         	 * Example of an initial loading indicator.
        	 * It is recommended to keep this as minimal as possible to provide instant feedback
         	 * while other resources are still being loaded for the first time
        	 */
        	html, body {
        	    height: 100%;
            	background-color: #1985D0
        	}

	        #appLoadingIndicator {
    	        position: absolute;
        	    top: 50%;
            	margin-top: -15px;
	            text-align: center;
    	        width: 100%;
        	    height: 30px;
            	-webkit-animation-name: appLoadingIndicator;
 	           -webkit-animation-duration: 0.5s;
    	        -webkit-animation-iteration-count: infinite;
        	    -webkit-animation-direction: linear;
    		}

        	#appLoadingIndicator > * {
            	background-color: #FFFFFF;
            	display: inline-block;
            	height: 30px;
            	-webkit-border-radius: 15px;
            	margin: 0 5px;
            	width: 30px;
            	opacity: 0.8;
        	}

        	@-webkit-keyframes appLoadingIndicator{
            	0% {
            	    opacity: 0.8
            	}
            	50% {
                	opacity: 0
            	}
            	100% {
                	opacity: 0.8
            	}
        	}

	        .x-title > .x-innerhtml {
    	       padding: 0px;
        	}

    	</style>

	</head>
	<body>
    	<div id="appLoadingIndicator">
        	<div></div>
        	<div></div>
        	<div></div>
    	</div>
	</body>
	</html>
		

####Standard Libraries Include Files
---
To build a Sencha Touch Application that can access the AT&T APIs, the standard libraries must be included in **index.html**.

The most important of these are the Sencha Touch libraries (Sencha Touch and its required CSS files). These come included in the SDK and are located in the **sdk** directory. While this application should run with any 2.x version of Sencha Touch, we recommend using the version provided with the SDK to avoid any problems with version conflicts. Should you wish to use a later version of Sencha Touch, you should update the locations of your library in **index.html** accordingly.

The following two files are required for a Sencha Touch application:

Sencha Touch CSS:

	<link type="text/css" rel="stylesheet" href="sdk/resources/css/sencha-touch.css">

The Sencha Touch debug build:

	<script type="text/javascript" src="sdk/sencha-touch-all.js"></script>


####Application Specific Include Files
---
The other file, which must be included, is the core of the application - **app.js**. The contents of this file contains the essential Sencha Touch code which registers your application, loads all dependencies, defines the location of source files for the AT&T Provider library and launches the application.

	<script type="text/javascript" src="app.js"></script>


###app.js
---

This file is the entry point for a Sencha MVC Application. While it can be any name, Sencha Touch convention is to call the core application file **app.js**. The application file is where you define your application namespace, declare the dependencies, models, views and controllers your application will use, and launch your application.

To properly load the AT&T Provider library, the application must be configured with the location of the library files. This can be accomplished by manually including the library files in the **index.html** file or, by utilizing the Ext.Loader to do this automatically. This example application makes use of the loader and shows how to properly configure it to include the AT&T Provider library.

Simply put, the Ext.Loader maps classnames found in your application to disk locations on your application server. Sencha Touch allows you to either manually load a class file (asynchronous loading) or it can automatically attempt to load a source file whenever it encounters a class that is not yet defined (synchronous loading). For more information about the Ext.Loader, please visit the [Ext.Loader documentation](http://docs.sencha.com/touch/2-0/#!/api/Ext.Loader). For more information about how Sencha Touch handles dependencies please review the [Managing Dependencies Guide](http://docs.sencha.com/touch/2-0/#!/guide/mvc_depndencies).

The following example application is a simple one, that contains a single controller and view - both named "Main".

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
 	 * 'AnotherApp.view.Main') will have its source looked for in a directory of the same name as
 	 * the namespace, rather than 'app' (in this case 'AnotherApp/').
 	 *
 	 * The loader allows you to override the default location of class source files for other 
 	 * namespaces. This allows your application to access source code outside its directory tree, 
 	 * without the need to copy it into your application directory. This is very convenient if you
 	 * have utility classes that you wish to use in different applications allowing you to maintain
 	 * only a single copy of the utility class.
 	 *
 	 * The following configuration associates the namespace 'Att' with the directory 'attlib'.
 	 * Later in this application, we will take advantage of this configuration to tell our
 	 * application to include the AT&T provider source code.
 	 *
 	 * NOTE: The specified path must be accessible (relative or absolute) to your client and the 
 	 * access method used (file:// or http://). If not properly specified, the client will be
 	 * unable to load the required source files.
	 */
	
	Ext.Loader.setPath({
		'Att': 'attlib'
	});

	Ext.application({
		/**
		 * Give your application its own namespace. All classes under that namespace will automatically
		 * be searched for under the 'app' directory, unless otherwise directed to do so by the loader
		 * setPath command (see above).
		 *
		 * In this example application, we use the loader triggers 'controllers', 'views' and 'requires'.
		 */
		name: "MyApp",

		requires : [ 'Ext.MessageBox' ],

		/**
		 * Declare the application controllers. The code in your controller listens for application events
		 * (clicks, taps, etc) as well as performing other event based operations. 
		 * 
		 * As 'controllers' is a loader trigger, the loader will first parse the items for this property,
		 * create a list of classnames found in the property, translate those to filenames and attempt to 
		 * load them.
		 *
		 * In this example the loader forms a classname 'MyApp.controller.Main' and then translates 
		 * that into a filename of 'app/controller/Main.js'. It then attempts to load that file.
		 */

		controllers: [ 'Main' ], 	// Load controller source app/controller/Main.js

		/**
		 * Declare the application views. A view is what is presented to the end user and contains layout 
		 * information, content, form fields, buttons, etc. 
		 * 
		 * The 'views' property is also a loader trigger, and as above, the loader will attempt to
		 * form a list of classnames from the values, and load their respective files.
		 */

		views: [ 'Main' ],			// Load view source app/view/Main.js


	    icon: {
    	    '57': 'resources/icons/Icon.png',
        	'72': 'resources/icons/Icon~ipad.png',
       		'114': 'resources/icons/Icon@2x.png',
        	'144': 'resources/icons/Icon~ipad@2x.png'
    	},

    	isIconPrecomposed: true,

    	startupImage: {
        	'320x460': 'resources/startup/320x460.jpg',
        	'640x920': 'resources/startup/640x920.png',
        	'768x1004': 'resources/startup/768x1004.png',
        	'748x1024': 'resources/startup/748x1024.png',
        	'1536x2008': 'resources/startup/1536x2008.png',
        	'1496x2048': 'resources/startup/1496x2048.png'
    	},

		/**
		 * When all code and dependencies are loaded into the client, the launch method is called which
		 * starts your application. In this example, we create an instance of the only view defined in the
		 * application, add that view to the current viewport, which then makes it visible to the user.
		 */
		launch: function() {
			// Destroy the #appLoadingIndicator element
			Ext.fly('appLoadingIndicator').destroy();
				
			// Initialize the main view.
			Ext.Viewport.add(Ext.create('MyApp.view.Main'));
		},

	    onUpdated: function() {
    	    Ext.Msg.confirm(
        	    "Application Update",
            	"This application has just successfully been updated to the latest version. Reload now?",
            	function(buttonId) {
                	if (buttonId === 'yes') {
                    	window.location.reload();
                	}
            	}
        	);
    	}

	});


###app/view/Main.js
---

There is only one view for this simple application. As you can see, the view is fairly basic. Fields have been added to handle input text for a phone number, and a textarea for a message. Two buttons have also been added to perform the send message and retrieve status actions.

	/**
	 * Define the SMS example view with its form fields and buttons. 
	 *
	 * The name of the view, 'MyApp.view.Main', is not chosen at random. If the loader is to be
	 * able to load this source, we have to ensure that there is a relationship between the classname
	 * and the source file name. 
	 *
	 * Simply put, the classname must reflect the name and location of the file on the disk, and 
	 * vice-versa in order for the loader to properly function.
	 *
	 * The loader uses your classname to build a path to the source file. It replaces periods with
	 * slashes (backslashes for Windows) and adds a '.js'. It first, however, replaces  your application
	 * namespace with 'app' so MyApp.view.Main becomes app/view/Main.js. 
	 *
	 * All classnames should (but not necessarily must) be defined under the application namespace
	 * (in this case 'MyApp'). The loader follows a convention of expecting the source for views,
	 * controllers, models, and stores to be collectively found in their own group directories. This 
	 * makes for overall better organization of your application's components.
	 *
	 * This hierarchical approach to application layout allows you to keep the same filename for 
	 * logical groups of components. In this application we use 'Main.js' as the name for both the 
	 * view and controller source file. This helps the developer to easily identify files in the 
	 * directory layout for what they do or contain.
	 */
	Ext.define('MyApp.view.Main', {
		extend : 'Ext.Container',
		xtype  : 'sms-view',
			
		config : {

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


###app/controller/Main.js
---

As with the previous view, the name of the controller follows the same rules for proper loader functionality. The loader will parse this classname to end up with a disk file name of **app/controller/Main.js**.

The following code show how it defines the behavior for the view and performs the calls to the AT&T Provider. 

For more information about controllers and their properties, please view the [Controllers](http://docs.sencha.com/touch/2-0/#!/guide/controllers) documentation.

	/**
	 * Define the controller and create an instance of the AT&T Provider class.
	 *
	 * As with the application view, the name of the controller - 'MyApp.controller.Main', is not
	 * chosen at random. Please review the comments in application source for the view to read an explanation
	 * of naming your classes and how it affects your application's interaction with the loader.
	 */

	Ext.define('MyApp.controller.Main', {
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
			'Att.Provider'  	// Load the AT&T HTML5 Client SDK (attlib/Provider.js)
			'Att.ApiResults'	// Load the AT&T Api Result Actionsheet (attlib/ApiResults.js)
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
			 * Define a property to store the SMS Message Id, so we may reference it to retrieve
			 * the message status.
			 */
			smsId: null,
				
			/**
			 * Create a reference to the sole view in your application. Your controller will be able
			 * to reference the view using a getter method - getView(). 
			 *
			 * As well, create an automatically created instance of the helper ApiResult actionsheet
			 * to display the API response to the user.
			 */	
			refs : {
				view : 'sms-view',

	            responseView: {
    	            xtype: 'apiresults',
        	        selector: 'apiresults',
            	    hidden: true,
                	autoCreate: true
            	}
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
				},
	            'actionsheet button[action=close]': {
    	            'tap': 'onCloseResponseView'
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
			   	success : function(response) {
					//save the message id
				   	view.setSmsId(response.Id);
					view.setMasked(false);
					me.showResponseView(true, response);
				}.
				failure: function(response) {
					view.setMasked(false);
					me.showResponseView(false, response);
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
				smsId = me.getSmsId();
				
			view.setMasked(true);
				
			provider.getSmsStatus({
				smsId   : smsId,
				success : function(response) {
					view.setMasked(false);
					me.showResponseView(true, response);
				},
				failure: function(response) {
					view.setMasked(false);
					me.showResponseView(false, response);
				}
			});
		},

	    /**
	     * Display raw response value received from the AT&T API call to the user.
    	 */
    	showResponseView: function(success, response) {
        	var responseView =  this.getResponseView();
        
        	Ext.Viewport.add(responseView);
        
        	responseView.setData({
            	success: success,
             	results: JSON.stringify(response, null, '\t')
         	});
        
        	responseView.show();    
    	},
    
    	onCloseResponseView: function(){
        	this.getResponseView().hide();
    	}

	});
