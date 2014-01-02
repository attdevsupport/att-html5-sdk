Ext.define('SmsOnly.controller.Sms', {
    extend : 'Ext.app.Controller',
    
    requires : [
        'Att.Provider'
    ],
    
    config : {
        /**
         * reference to Att.Provider instance
         */
        provider: undefined,
        
        refs : {
            view : 'sms-view'
        },
        
        control : {
            'button[action=sendsms]' : {
                'tap': 'onSendSms'
            },
            'button[action=smsstatus]' : {
                'tap': 'onSmsStatus'
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
     * Handler for sendsms button. It will call Att.Provider.sendSms function with the values entered in the view.
     */
    onSendSms : function() {
        var me = this,
            provider = me.getProvider(),
            view = me.getView(),
            to = view.down('textfield[name=to]').getValue(),
            message = view.down('textareafield[name=message]').getValue();
        
        view.setMasked(true);
        
        provider.sendSms({
           address : to,
           message : message,
           success : function(result) {
               //save the message id
               view.setSmsId(result.Id);
               view.setMasked(false);
               
               Ext.Msg.alert("Message sent!", "Id: " + result.Id);
           }
        });
    },
    
    /**
     * Handler for smsstatus button. Once we have a Sms message successfully sent we have stored its id in the view.
     * This method will use that id to retrieve the status of the sms using Att.Provider.getSmsStatus functionality.
     */
    onSmsStatus: function() {
        var me = this,
            provider = me.getProvider(),
            view = me.getView(),
            smsId = view.getSmsId();
        
        view.setMasked(true);
        
        provider.getSmsStatus({
            smsId   : smsId,
            success : function (result) {
                var info = result.DeliveryInfoList.DeliveryInfo[0];
                view.setMasked(false);
                
                Ext.Msg.alert("Message Status","Status: " + info.DeliveryStatus);
            } 
        });
    }
});