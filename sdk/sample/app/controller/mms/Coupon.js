/**
 * Controller that interacts with the Coupon MMS application.
 */
Ext.define('SampleApp.controller.mms.Coupon', {
    extend: 'Ext.app.Controller',
    
    requires:[
        'Att.Provider',     
        'Att.ApiResults',
        'SampleApp.Config',
        'Ext.MessageBox'
    ],
    
    config: {
        provider: undefined,

        refs: {
            view: 'att-mms-coupon',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-mms-coupon': {
                initialize: 'loadData',
            },
            'att-mms-coupon button[action=sendmessage]': {
                tap: 'onSendMms'
            },
            'att-mms-coupon button[action=messagestatus]':{
                tap: 'onMessageStatus'
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
     * Handler for send Mms button. 
     * It will pull the value from address and message inputs to perform a sendMms call.
     */
    onSendMms: function(btn, event, eOpts) {
        var me = this,
            provider = me.getProvider(),
            view = me.getView(),
            cfg = SampleApp.Config,
            form = btn.up('formpanel').getValues(),
            message = form.message,
            i = 0,
            addresses, l;
        
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
        
        provider.sendMms({
            address  : addresses.join(','),
            fileId   : "coupon.jpg",
            message  : message,
            priority : "High",
            success: function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
                //set the message Id value 
                view.down('formpanel textfield[name=mmsId]').setValue(response.Id);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });   
        
    },
    
    /**
     * Handler for get Status button.
     * Once we perform a sendMms call, the mmsId input is populated with the response. 
     * That field is used in this function to retrieve the status of the message.
     */
    onMessageStatus: function(btn, event, eOpts) {
        var me = this,
            provider = me.getProvider(),
            view = me.getView(),
            cfg = SampleApp.Config,
            form = btn.up('formpanel').getValues(),
            mmsId = form.mmsId;
        
        // check message id
        if (!mmsId) {
            Ext.Msg.alert(cfg.alertTitle, 'Please enter a Message Id');
            return;
        }
        
        
        view.setMasked(true);
        
        provider.getMmsStatus({
            mmsId  : mmsId,
            success: function(response){
                var list = view.down('list');
                view.setMasked(false);
                me.showResponseView(true, response);
                if(response.DeliveryInfoList){
                    //add status to list 
                    list.getStore().setData(response.DeliveryInfoList.DeliveryInfo);
                }
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });  
    },
    
    //private
    loadData: function() {
        this.loadPhoneList();
        this.loadSubjectData();
    },

    //private
    loadPhoneList: function() {
        var view = this.getView();
        
        view.setMasked(true);
        
        Ext.Ajax.request({
            url : 'assets/data/phones.txt',
            success : function(response, opts) {
                view.down('textfield[name=address]').setValue(response.responseText);
                view.setMasked(false);
            },
            failure : function(response, opts) {
                Ext.Msg.alert('Error', 'There was an error loading the phone number(s) from the phones.txt file.');
                view.setMasked(false);
            }
        });
    },
    
    //private
    loadSubjectData: function() {
        var view = this.getView();
        
        view.setMasked(true);
        
        Ext.Ajax.request({
            url : 'assets/data/message.txt',
            success : function(response, opts) {
                view.down('textareafield[name=subject]').setValue(response.responseText);
                view.setMasked(false);
            },
            failure : function(response, opts) {
                Ext.Msg.alert('Error', 'There was an error loading the Subject from the message.txt file.');
                view.setMasked(false);
            }
        });
    }
});