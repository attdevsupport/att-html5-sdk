/**
 * Controller that interacts with the Device locagtion (TL) application.
 */
Ext.define('SampleApp.controller.device.Location', {
    extend: 'Ext.app.Controller',
   
    requires: [
       'Att.Provider',
       'Att.ApiResults',
       'SampleApp.Config',
       'Ext.MessageBox'
    ],
    
    /**
     * @private
     * authScope: the scope name used by provider to get authorization from user. TL: device location
     */
    authScope: 'TL',
    
    config: {
        provider: undefined, 
        
        refs: {
            view      : 'att-device-tl',
            formPanel : 'att-device-tl #locationForm',
            form      : 'att-device-tl #locationForm formpanel',
            map       : 'att-device-tl #mapContainer',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-device-tl button[action=showlocation]' : {
                'tap' : 'onShowPhoneLocation'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            },
            'att-device-tl button[action=showform]' : {
                'tap' : 'onShowForm'
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
     * Handler for the Show Location button. Verifies if the user is authorized and executes getPhoneLocation method.
     * In case user is not authorized, it will display the authorization screen.
     */
    onShowPhoneLocation: function() {
        var me = this,
            view = me.getView(),
            provider = me.getProvider();
        
        view.setMasked(true);
        
        provider.isAuthorized({
            authScope : me.authScope,
            success   : me.getPhoneLocation,
            failure   : function(){
                provider.authorizeApp({
                    authScope : me.authScope,
                    success   : me.getPhoneLocation,
                    failure   : function(error) {
                        view.setMasked(false);
                        Ext.Msg.alert('Access denied', 'User denied authorization');
                    },
                    scope: me
                });
            },
            scope: me
        });   
    },
    
    /**
     * Executes the getDeviceLocation API call once the user gets authorized.
     * 
     */
    getPhoneLocation: function() {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            form = me.getForm().getValues(),
            requestedAccuracy = form.requestedAccuracy,
            acceptableAccuracy = form.acceptableAccuracy,
            delayTolerance = form.delayTolerance;
        
        
        provider.getDeviceLocation({
            requestedAccuracy: requestedAccuracy,
            acceptableAccuracy: acceptableAccuracy,
            tolerance: delayTolerance,
            success: function(response){
                var map = me.getMap();
                view.setMasked(false);
                //show map only if we have information
                if(response.latitude && response.longitude){
                    view.setActiveItem(map);
                    view.setMapLocation(response);
                }
                me.showResponseView(true, response);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },
    
    onShowForm : function() {
        var me = this,
            view = me.getView(),
            form = me.getFormPanel();
        
       view.setActiveItem(form); 
    }
   
});