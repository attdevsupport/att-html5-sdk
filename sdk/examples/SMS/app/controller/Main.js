/**
 * Controller that interacts with the Basic SMS application.
 */
Ext.define('MyApp.controller.Main', {
    extend: 'Ext.app.Controller',

    requires: [
       'Att.Provider',          // Load the AT&T HTML Client SDK (attlib/Provider.js)
       'Att.ApiResults'         // Load the AT&T Api Result Actionsheet (attlib/ApiResults.js)
    ],

    /**
     * Configuration for the skeleton app controller. This sets up all the references
     * for the controller as well as define place holder for the AT&T Provider class
     */
    
    config: {
        provider: undefined,        // ATT Provider class holder
        smsId: null,                // Sms ID holder

        refs: {
            view: 'sms-view',

            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'button[action=sendsms]' : {
                'tap': 'onSendSms'
            },
            'button[action=smsstatus]' : {
                'tap': 'onSmsStatus'
            },
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
     * What to do when send sms button is clicked
     */
    onSendSms: function() {
        var me = this,
            provider = me.getProvider(),
            view = me.getView(),
            to = view.down('textfield[name=to]').getValue(),
            message = view.down('textareafield[name=message]').getValue();

        view.setMasked(true);

        provider.sendSms({
            address: to,
            message: message,
            success: function(response) {
                view.setMasked(false);
                me.setSmsId(response.Id);
                me.showResponseView(true, response);
            },
            failure: function(response) {
                view.setMasked(false);
                me.showResponseView(false, response);
            }
        });
    },

    onSmsStatus: function() {
        var me = this,
            provider = me.getProvider(),
            view = me.getView(),
            smsId = me.getSmsId();

        view.setMasked(true);

        provider.getSmsStatus({
            smsId: smsId,
            success: function(response) {
                view.setMasked(false);
                me.showResponseView(true, response);
            },
            failure: function(response) {
                view.setMasked(false);
                me.showResponseView(false, response);
            }
        })
    }, 

    /**
     * Display raw response value received from the AT&T API call to the user.
     */
    showResponseView: function(success, response, url) {
        var responseView =  this.getResponseView();
        
        Ext.Viewport.add(responseView);
        
        responseView.setData({
            success: success,
            results: JSON.stringify(response, null, '\t')
        });
        
        responseView.show();    
    },
    
    closeResponseView: function(){
        this.getResponseView().hide();
    }

});