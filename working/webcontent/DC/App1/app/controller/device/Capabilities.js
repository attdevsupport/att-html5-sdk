/**
 * Controller that interacts with the Device Capabilities (DC) application.
 */
Ext.define('SampleApp.controller.device.Capabilities', {
    extend: 'Ext.app.Controller',
    
    requires: [
       'Att.Provider',
       'Att.ApiResults',
       'SampleApp.Config',
       'Ext.MessageBox'
    ],
    
    /**
     * @private
     * authScope: the scope name used by provider to get authorization from user. DC: device capabilities
     */
    authScope: 'DC',
    
    config: {
        provider: undefined, 
        
        refs: {
            view: 'att-device-dc',
            form: 'att-device-dc formpanel',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-device-dc button[action=showcapabilities]' : {
                'tap' : 'onShowPhoneCapabilities'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            }
        }
       
    },
   
    /**
     * Gets called internally when provider property is set during config initialization.
     * We'll initialize here our Att.Provider instance to perform the API calls. 
     * @param provider the value we set in config option for this property.
     * @returns
     */
    applyProvider: function(provider) {
        if (!provider) {
            provider = Ext.create('Att.Provider',{
                apiBasePath: SampleApp.Config.apiBasePath
            });
        }

        return provider;
    },
   

    showResponseView: function(success, response){
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
    },   
    
    /**
     * Handler for the Show Capabilities button. Verifies if the user is authorized and executes getPhoneCapabilities method.
     * In case user is not authorized, it will display the authorization screen.
     */
    onShowPhoneCapabilities: function() {
        var me = this,
            view = me.getView(),
            provider = me.getProvider();
        
        view.setMasked(true);
        
        provider.isAuthorized({
            authScope : me.authScope,
            success   : me.getPhoneCapabilities,
            failure   : function(){
                provider.authorizeApp({
                    authScope : me.authScope,
                    success   : me.getPhoneCapabilities,
                    failure   : function(error) {
                        view.setMasked(false);
                        Ext.Msg.alert('Access denied', 'You have to be on AT&T net to get authorized to use DC');
                    },
                    scope: me
                });
            },
            scope: me
        });   
    },
    
    /**
     * When user gets authorized, it will call getDeviceInfo from the Provider API
     */
    getPhoneCapabilities: function() {
        var me = this,
            view = me.getView(),
            provider = me.getProvider();

        
        provider.getDeviceInfo({
            success: function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    }

    
});