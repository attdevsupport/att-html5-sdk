/**
 * Controller that interacts with the Basic MOBO application.
 */
Ext.define('SampleApp.controller.mobo.Basic', {
    extend: 'Ext.app.Controller',

    requires: [
       'Att.Provider',
       'Att.ApiResults',
       'SampleApp.Config',
       'Ext.MessageBox'
    ],

    /**
     * @private
     * authScope: the scope name used by provider to get authorization from user. MOBO: message on behalf of
     */
    authScope: 'IMMN',
    
    config: {
        provider: undefined,

        refs: {
            view: 'att-mobo-basic',
            form: 'att-mobo-basic formpanel',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-mobo-basic button[action=sendmessage]': {
                tap: 'onSendMessage'
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
     * Handler for send message button on MOBO application.
     * It will pull out the forms fields address, message, subject and group.
     * Right now we have no way to upload a file from the phone so it is emulated
     * by selecting the use attach file checkbox
     */
    onSendMessage: function(){
        var me = this,
            view = me.getView(),
            provider = me.getProvider();
        
        view.setMasked(true);
        
        provider.isAuthorized({
            authScope : me.authScope,
            success   : me.doSendMessage,
            failure   : function(){
                provider.authorizeApp({
                    authScope : me.authScope,
                    success   : me.doSendMessage,
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
    
    doSendMessage: function(){
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            options = me.getForm().getValues(),
            cfg = SampleApp.Config,
            addresses,
            address,
            i=0, l;
        
        if(!options.address){
            view.setMasked(false);
            Ext.Msg.alert(cfg.alertTitle, 'Please enter an Address');
            return;
        }
        
        addresses = options.address.split(",");
        l = addresses.length;
        for(; i < l ; i++){
            address = addresses[i].trim();
            if(!Att.Provider.isValidAddress(address)){
                view.setMasked(false);
                Ext.Msg.alert(cfg.alertTitle, 'Please enter an valid Address: Phone number, email or short code');
                return;
            }
            addresses[i] = Att.Provider.normalizeAddress(address);
        }
        
        if(!options.attachment && !options.message){
            view.setMasked(false);
            Ext.Msg.alert(cfg.alertTitle, 'You should enter a Message or Attachment');
            return;
        }
        
        provider.sendMobo({
            address: addresses.join(","),
            message: options.message,
            subject: options.subject,
            group: !!options.group,
            files: (options.attachment)? [options.attachment] : undefined,
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