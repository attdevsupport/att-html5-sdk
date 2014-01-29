/**
 * Controller that interacts with the Notary application.
 */
Ext.define('SampleApp.controller.payment.Notary', {
    extend: 'Ext.app.Controller',
   
    requires: [
       'Att.Provider',
       'Att.ApiResults',
       'SampleApp.Config',
       'Ext.MessageBox'
    ],

    config: {
        provider: undefined,

        refs: {
            view: 'att-payment-notary',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-payment-notary': {
              'initialize': 'loadData'  
            },
            'att-payment-notary button[action=signpayload]': {
                'tap': 'onSignPayload'
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
     * Called from the 'Sign Payload' button in the sample Notary Payment application.
     * This method calls the Att.Provider.signPayload method, passing the json formatted payload from the
     * textarea field displayed in the UI.  Callback functions for success and failure
     * are defined to handle success and failure responses.
     */
    onSignPayload: function(btn, event, eOpts) {
        var me = this,
            view = me.getView(),
            cfg = SampleApp.Config,
            provider = me.getProvider(),
            form = btn.up('formpanel').getValues(),
            request = form.request,
            payload;
        
        try{
            payload = Ext.decode(request);
        }catch(e){
            Ext.Msg.alert(cfg.alertTitle, 'Request is not a valid JSON format');
            return
        }
        
        
        view.setMasked(true);
        
        provider.signPayload({
            payload: payload,
            success: function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
                
                view.down('textfield[name=signedPayload]').setValue(response.SignedDocument);
                view.down('textfield[name=signature]').setValue(response.Signature);
                
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },
    
    loadData: function(){ 
        var me = this,
            tx = new Date().getTime(),
            request = me.getView().down('textareafield[name=request]');
        
        request.setValue(JSON.stringify({
            "Amount":0.99,
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"Word game 1",
            "MerchantTransactionId":"User" + tx + "Transaction",
            "MerchantProductId":"wordGame1"
        }, null, '\t'));
    }
   
 
    
});