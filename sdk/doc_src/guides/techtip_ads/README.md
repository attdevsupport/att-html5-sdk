ADS Cookbook
===

Overview
---
This guide explains the usage of the Att.Provider to obtain the Ad content using the AT&T HTML5 SDK Platform.

What do I need to start?
---

1. Include Att.Provider as a dependency by declaring it in the "requires" section of your class definition  

        Ext.define('MyApp.MyController', {
            extend  : 'Ext.Controller',
            requires: [
                'Att.Provider'
                //more dependencies here ... 
            ],

           //...
        });

2. Create an instance of Att.Provider

        var provider = Ext.create('Att.Provider');


###Tip! Device Capabilities Authorization only works when you are on AT&T Network

The required consent for Device Capabilities can only be obtained on AT&T Network. Make sure you prompt the user to be using his/her AT&T Network and not Wi-Fi connection. Otherwise the consent will be automatically rejected.

###Tip! Check if the application is already authorized  

If you don't want the user to authorize the application on every single call, use the Att.Provider.isAuthorized method to check if the application is already authorized for the given scope.  

        provider.isAuthorized({
            authScope : 'DC',
            success   : onIsAuthorized,
            failure   : onIsNotAuthorized
        });

        function onIsAuthorized() {
            /* call to device capabilities goes here */
        } 

        function onIsNotAuthorized(){
            /* You can call here to provider.authorizeApp */
        } 


How do I get an Ad ?
---

Getting an ad to display within your application is quite simple. Review the available parameters found in the documentation for this API at the AT&T website. Decide the values (if any) you wish for the parameters and then make a request for an ad by calling the SDK **getAds** method.

        provider.getAds({
            parameters: {
                category: 'Autos',
                country: 'US'
            },
            success: getAdSucceeded,
            failure: getAdFailed
        });

        function getAdSucceeded(response) {

        }

        function getAdFailed(response) {

        }


How do I display an Ad ?
---

Once you have received a successful response, displaying the ad in your application is quite simply a matter of applying the information in the response to a Sencha Touch template that resides on the page in which you wish to display the ad:


Create a simple view which docks a container for ad placement at the bottom of the display:

        Ext.define('SampleApp.view.MyPage', {
            extend: 'Ext.Container',
            xtype: 'mypage',

            config: {

                items: [{
                    html    : 'App Content here....'
                }, {
                    docked  : 'bottom',
                    xtype   : 'container',
                    name    : 'adUrl',
                    tpl     : '<tpl if="content">{content}</tpl>'
                }]

            }
        });

In your application's controller, fetch an ad once the application is launched:

        Ext.define('SampleApp.controller.MyPage', {
            extend: 'Ext.app.Controller', 

            config: {
                provider: undefined,

                refs: {
                    view: 'mypage'
                }
            },                    

            applyProvider: function() {
                if (!provider) {
                    provider = Ext.create('Att.Provider',{
                        apiBasePath: SampleApp.Config.apiBasePath
                    });
                }

                return provider;                
            },

            launch: function() {
                var me = this,
                    view = me.getView(),
                    adUrl = view.down('container[name=adUrl]');

                provider.getAd({
                    udid: '30 character long UDId',
                    parameters: {
                        // ad parameters here
                    },
                    success: function(response){
                        adUrl.setData({
                            content: response.AdsResponse.Ads.Content
                        });
                    },
                    failure: function(error){
                        // no ad retrieved ....
                    }
                });
            }

        });

