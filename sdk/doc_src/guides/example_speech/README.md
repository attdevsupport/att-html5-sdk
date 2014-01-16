Simple Example Application: Speech to Text
===

This Speech to Text example is a simple Sencha Touch application that uses the AT&T API Platform SDK for HTML5 to convert an audio file to text.

We **strongly** recommend that if you are unfamiliar with developing Sencha Touch applications, you explore our general introduction on getting started with Sencha Touch -- the [Getting Started with Touch 2](http://docs.sencha.com/touch/2-0/#!/guide/getting_started) tutorial.

Prerequisites
---

This example assumes that you have already 

1. Created an [AT&T Developer Account](http://developer.att.com).
2. Setup an application in your Developer Account and obtained the necessary API credentials for your application.
3. Downloaded and unpacked the SDK in your development environment.
4. Selected a preferred SDK server ([Ruby](/docs/#!/guide/server_ruby), [Java](/docs/#!/guide/server_java) or [PHP](/docs/#!/guide/server_php)) and have configured and started it with your API credentials.

Currently, audio files submitted to the API must be located on the server side (where the application runs) due to the limitations of accessing audio files on mobile device platforms.

If you already have the SDK running, you can run the Speech to Text example app by loading http://**yoursdkhost:yoursdkport**/examples/speech/index.html in your supported WebKit browser. You should see a screen that looks like this:

![overview](resources/images/examples-speech.png)


##Code Organization
---
All of the client code for this example is provided in the SDK that you downloaded and can be found in the folder **client/examples/speech**. The application has the following layout which follows Sencha Touch 2 conventions.  Each of the client code files and their contents are discussed in the **Complete Walkthrough** section of this guide. 

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

Now, let's walk through each file in the Speech example application, beginning with ....

###index.html
---
The Speech to Text application is launched from **client/examples/speech/index.html**. As you can see from the following code, **index.html** loads all of the CSS and JavaScript files needed to run the application. Please note that the include statements for the Sencha Touch CSS library and the Sench Touch framework reference directories in the SDK that are outside of the example application tree. 


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

The following <code>app.js</code> code shows how the Ext.Loader configuration is set to specify the location of the Att library files. For more detailed documentation, please review the SMS example application. The SMS example application contains comprehensive code and logic documentation which is applicable to this example application as well.

    /**
     * set loader configuration enabled
     */
    Ext.Loader.setConfig({
        enabled: true
    });

    /**
     * configure location for the Att library
     */
    Ext.Loader.setPath({
        'Att': 'attlib'
    });

    Ext.application({
        name: "SpeechSample",
         //declare controllers
        controllers: ['Main'],
            
        //declare views
        views: ['Main'],
            
        //launch app
        launch: function() {
             
            var view = Ext.create('SpeechSample.view.Main');
             
            //add main view to viewport
            Ext.Viewport.add(view);
        }
    });


##app/view/Main.js
---

The <code>Main.js</code> file is located in the app/view folder. It will allow the user to choose from a few different audio files to convert to text.

As you can see in the following code sample, the view is fairly simple. A select field has been added containing options for all of the available audio test files and a single button is used to initiate the submission of the file to the API and retrieve the text response.

    /**
     * The Speech view exercises the speechToText API Call.
     */
    Ext.define('SpeechSample.view.Main', {
        extend : 'Ext.Container',
        xtype  : 'speech-view',
    
        requires : [
            'Ext.form.Panel',
            'Ext.Toolbar',
            'Ext.form.FieldSet',
            'Ext.field.Select'
        ],
    
        config : {

            items : [
                /**
                 * Toolbar to display a nice title
                 */     
                {
                    xtype  : 'toolbar',
                    title  : 'Speech Example',
                    docked : 'top'
                },
                /**
                 * The form panel we use to get the user selected file.
                 */
                {
                    xtype  : 'formpanel',
                    scrollable : false,
                    items  : [
                        {
                            xtype : 'fieldset',
                            title: 'Audio File',
                            items : [
                                {
                                    xtype: 'selectfield',
                                    label: 'Choose File',
                                    name : 'file',
                                    options: [
                                        {text: 'Bananas.wav',  value: 'Bananas.wav'},
                                        {text: 'Bananas.amr', value: 'Bananas.amr'},
                                        {text: 'Starbucks.wav',  value: 'Starbucks.wav'},
                                        {text: 'Starbucks.amr', value: 'Starbucks.amr'}
                                    ]
                                } 
                            ] 
                        }
                    ]
                },
                /**
                 * Button to submit the speech to text 
                 */
                {
                    xtype  : 'button',
                    action : 'speechtotext',
                    text   : 'Speech to Text'
                }
            ]
        }
    });


##app/controller/Main.js
---

The controller for the application - <code>Main.js</code> - is located in the app/controller folder. The following code show how it defines the behavior for the Speech view and performs the calls to the Provider.

    Ext.define('SpeechSample.controller.Main', {
        extend : 'Ext.app.Controller',
    
        requires : [
            'Att.Provider',
            'Ext.MessageBox'
        ],
    
        config : {
            /**
             * reference to Att.Provider instance
             */
            provider: undefined,
        
            refs : {
                view : 'speech-view'
            },
        
            control : {
                'button[action=speechtotext]' : {
                    'tap': 'onSpeechToText'
                }
            }
        },
    
        /**
         * Gets called internally when provider property is set during config initialization.
         * We'll initialize here our Att.Provider instance to perform the API calls. 
         * @param provider the value we set in config option for this property.
         * @returns
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
         * 
         */
        onSpeechToText: function() {
            var me = this,
                view = me.getView(),
                provider = me.getProvider(),
                form = view.down('formpanel').getValues();
            
            view.setMasked(true);
        
            provider.speechToText({
                fileName: form.file,
                streamed: true,
                success: function(response){
                    view.setMasked(false);
                    if(response.recognition && response.recognition.status == "OK"){
                        Ext.Msg.alert("Hypothesis Text: " + response.recognition.nbest[0].hypothesis);
                    }
                },
                failure: function(error){
                    view.setMasked(false);
                }
            }); 
        }
    });
