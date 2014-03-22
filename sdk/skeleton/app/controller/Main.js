/**
 * Controller that interacts with the Skeleton application.
 */
Ext.define('MyApp.controller.Main', {
    extend: 'Ext.app.Controller',

    requires: [
       'Att.Provider',      // Load the AT&T HTML5 Client SDK (attlib/Provider.js)
       'Att.ApiResults'     // Load the AT&T API Result Actionsheet (attlib/ApiResults.js)
    ],

    /**
     * Configuration for the skeleton app controller. This sets up all the references
     * for the controller as well as define place holder for the AT&T Provider class
     */
    
    config: {
        provider: undefined,        // ATT Provider class holder

        refs: {
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'actionsheet button[action=close]': {
                'tap': 'closeResponseView'
            }
        }
    },
    
    /**
     * This method is called internally when provider property is set during config initialization.
     * We'll initialize here our Att.Provider instance to perform the API calls. 
     * @param provider the value we set in config option for this property.
     * @returns
     */
    applyProvider: function(provider) {
        if (!provider) {
            provider = Ext.create('Att.Provider',{
                apiBasePath: '/att'
            });
        }

        return provider;
    },
    
    /**
     * Display raw response value received from the AT&T getMessageHeader API call to the user.
     */
    showResponseView: function(success, response, url) {
        var responseView =  this.getResponseView();
        
        Ext.Viewport.add(responseView);
        
        responseView.setData({
             success: success,
             results: JSON.stringify(response, null, '\t'),
             content: response,
             url: url
         });
        
        responseView.show();    
    },
    
    closeResponseView: function(){
        this.getResponseView().hide();
    }

});