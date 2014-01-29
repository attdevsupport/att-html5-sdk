/**
 * Controller that interacts with the Basic SMS application.
 */
Ext.define('SampleApp.controller.sms.Basic', {
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
            view: 'att-sms-basic',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-sms-basic button[action=sendmessage]': {
                tap: 'onSendSms'
            },
            'att-sms-basic button[action=messagestatus]':{
                tap: 'onMessageStatus'
            },
            'att-sms-basic button[action=receivemessage]': {
                tap: 'onReceiveSms'
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
     * Handler for send Sms button.
     * This will take the parameters in the send sms form to make a call to sendSms API method.
     * It populates the smsId field with the SMS Id property obtained in the response.
     */
    onSendSms: function(btn, event, eOpts){
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            cfg = SampleApp.Config,
            form = btn.up('formpanel').getValues(),
            message = form.message,
            address, addresses, l, i = 0;

        //check phone numbers
        if(!form.address){
            Ext.Msg.alert(cfg.alertTitle, cfg.invalidPhoneMsg);
            return;
        }
        
        addresses = form.address.split(',');
        
        l = addresses.length;
        for(; i < l ; i++){
            address = addresses[i].trim();
            if(!Att.Provider.isValidPhoneNumber(address)){
                Ext.Msg.alert(cfg.alertTitle, cfg.invalidPhoneMsg);
                return;
            }
            addresses[i] = Att.Provider.normalizePhoneNumber(address);
        }
        // check message 
        if (message === '') {
            Ext.Msg.alert(cfg.alertTitle, 'Please enter a message');
            return;
        } 
        
        view.setMasked(true);
        
        provider.sendSms({
            address: addresses.join(','),
            message: message,
            success: function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
                //set the message Id value 
                view.down('formpanel textfield[name=smsId]').setValue(response.Id);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },
    
    /**
     * Handler for Sms Status button.
     * It will get the smsId field value and perform a getSmsStatus call to Provider API.
     */
    onMessageStatus: function(btn, event, eOpts){
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            cfg = SampleApp.Config,
            form = btn.up('formpanel').getValues(),
            smsId = form.smsId;
    
        // check message 
        if (!smsId) {
            Ext.Msg.alert(cfg.alertTitle, 'Please enter a Message Id');
            return;
        } 
        
        
        view.setMasked(true);
        
        provider.getSmsStatus({
            smsId: smsId,
            success: function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },
    
    /**
     * Handler for receive sms button.
     * Performs a receiveSms call to retrieve messages in the shortcode inbox.
     */
    onReceiveSms: function(btn, event, eOpts){
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            registrationId = btn.config.regId;
        
        view.setMasked(true);
        
        provider.receiveSms({
            registrationId: registrationId,
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