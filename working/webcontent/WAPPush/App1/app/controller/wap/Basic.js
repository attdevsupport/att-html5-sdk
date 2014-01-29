/**
 * Controller that interacts with the Basic WAP application.
 */
Ext.define('SampleApp.controller.wap.Basic', {
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
            view: 'att-wap-basic',
            form: 'att-wap-basic formpanel',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-wap-basic button[action=sendwapmessage]' : {
                'tap' : 'onSendWapMessage'
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
     * Gets the address and alerttext input values and creates a WAP message to be sent using wapPush call.
     */
    onSendWapMessage: function(btn, event, eOpts) {
        var me = this,
            cfg = SampleApp.Config,
            view = me.getView(),
            provider = me.getProvider(),
            form = btn.up('formpanel').getValues(),
            address = form.address,
            alerttext =  form.alerttext,
            url = form.url,
            message;

        //check valid phone number
        if (!Att.Provider.isValidPhoneNumber(address)) {
            Ext.Msg.alert(cfg.alertTitle, cfg.invalidPhoneMsg);
            return;
        }        

        // check url
        if (url === '') {
            Ext.Msg.alert(cfg.alertTitle,'Please enter URL');
            return;
        }
        
        // check message
        if (alerttext === '') {
            Ext.Msg.alert(cfg.alertTitle,'Please enter Alert Text');
            return;
        }
        
        message = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="' + url + '" si-id="1">' + alerttext + '</indication>\n</si>';
        
        view.setMasked(true);
    
        provider.wapPush({
            address  : Att.Provider.normalizePhoneNumber(address),
            message  : message,
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