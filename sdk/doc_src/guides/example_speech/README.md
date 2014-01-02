Simple Example Application: Speech to Text
===

This Speech to Text example is a simple Sencha Touch application that uses the AT&T API Platform SDK for HTML5 to convert an audio file to text.

For a general introduction on how to build a Sencha Touch Application, see [Sencha Touch Hello World](http://www.sencha.com/learn/hello-world).


Prerequisites
----

This example assumes that you have already setup the SDK, provisioned an application with AT&T, and have deployed the Kitchen Sink app using one of the SDK setup guides. 

Currently audio files submitted to the API must be located on server side (where the application runs) due to limitations of accessing audio files on mobile device platforms.

If you already have the SDK running, you can run the SMS example app by loading http://**yoursdkhost:yoursdkport**/examples/speech/index.html in your supported WebKit browser. You should see a screen that looks like this:

![overview](resources/images/examples-speech.png)


Code Organization
---
All of the client code for this example is located in the folder **client/examples/speech**.

The entry into the application is **client/examples/speech/index.html**. As you can see from the following code, **index.html** loads all of the CSS and JavaScript files needed to run the application.



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
        


Standard Libraries Include Files
---
To build a Sencha Touch Application that can access the AT&T APIs, the standard libraries (listed below) must be included in **index.html**.

Note that the Speech example app includes the same Sencha Touch libraries as the Kitchen Sink app. Because these JS and CSS files are used by all Sencha Touch applications, you should keep a single copy of these files in a central location when you build your application.

The following three files are required for a Sencha Touch application:


Sencha Touch CSS:

    <link rel="stylesheet" href="../../sdk/resources/css/sencha-touch.css" type="text/css">

The Sencha Touch debug build:

    <script type="text/javascript" src="../../sdk/sencha-touch.js"></script>


Application Specific Include File
---

The remaining file included in **index.html** is the Sencha Touch application itself - app.js - and is specific to the Speech to Text application. This file is used to register the Speech to Text application.

    <script type="text/javascript" src="app/app.js"></script>


The app.js File Explained
---

The <code>app.js</code> file is the entry point for Sencha MVC Application. It must be configured to set the location of the Att library files, and to declare the controllers and views that are used in the application.

The following <code>app.js</code> code shows how the Ext.Loader configuration is set to specify the location of the Att.library files.

It also shows how Ext.application is used to declare the controllers and views that will be used. As you can see in the example, the SMS Only application is configured to have a Speech controller and a Speech view.

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
        'Att': '../../app/lib'
    });

    Ext.application({
        name: "SpeechSample",
         //declare controllers
        controllers: ['Speech'],
            
        //declare views
        views: ['Speech'],
            
        //launch app
        launch: function() {
             
            var view = Ext.create('SpeechSample.view.Sms');
             
            //add Speech view to viewport
            Ext.Viewport.add(view);
        }
    });


The Speech view
---

The <code>Speech.js</code> file is located in the app/view folder. It will allow the user to choose from a few different audio files to convert to text.

As you can see in the following code sample, the view is fairly simple. A select field has been added with all available audio files to test and a single button to initiate the the submission of the file to the API and retrieve the text response.

    /**
     * The Speech view exercises the speechToText API Call.
     */
    Ext.define('SpeechSample.view.Speech', {
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


The Speech Controller
---

The controller for the application - <code>Speech.js</code> - is located in the app/controllers folder. The following code show how it defines the behavior for the Speech view and performs the calls to the Provider.

    Ext.define('SpeechSample.controller.Speech', {
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
                        Ext.Msg.alert("Hipothesis Text: " + response.recognition.nbest[0].hypothesis);
                    }
                },
                failure: function(error){
                    view.setMasked(false);
                }
            }); 
        }
    });
