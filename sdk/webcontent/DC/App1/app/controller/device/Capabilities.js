/**
 * Controller that interacts with the Device Capabilities (DC) application.
 */
Ext.define('SampleApp.controller.device.Capabilities', {
    extend: 'Ext.app.Controller',
    
    requires: [
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
     * Handler for the Show Capabilities button. The view loader already made sure the user
     * is authorized when the page was loaded.
     */
    onShowPhoneCapabilities: function() {
        var me = this,
            view = me.getView();
        
        view.setMasked(true);
        
        AttApiClient.getDeviceInfo(
            function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
            },
            function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        );
    }
});
