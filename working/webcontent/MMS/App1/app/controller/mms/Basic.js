/**
 * Controller that interacts with the Basic MMS application.
 */
Ext.define('SampleApp.controller.mms.Basic', {
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
            view: 'att-mms-basic',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-mms-basic button[action=sendmessage]': {
                tap: 'onSendMms'
            },
            'att-mms-basic textfield[type=file]':{
                change: 'onFileSelected'
            },
            'att-mms-basic button[action=messagestatus]':{
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
     * This will take the parameters in the send mms form to make a call to sendMms API method.
     * It populates the mmsId field with the MMS Id property obtained in the response.
     */
    onSendMms: function(btn, event, eOpts) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            cfg = SampleApp.Config,
            form = btn.up('formpanel').getValues(),
            subject = form.subject,
            attachment = form.attachment,
            maxSize = cfg.maxTotalFileSize || 600 * 1024,
            total, addresses, address, l, i = 0;

        total = me.getTotalFileSize();
        
        //check file size
        if (total > maxSize) {
            Ext.Msg.alert(cfg.alertTitle, 'The total of all files selected (' +  Math.round(total/1024) + 'K) exceeds the allowed Max Size of 600K.  Please select smaller files and try again.');
            return;
        }

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

        // check message (field named 'subject' per spec)
        if (subject === '') {
            Ext.Msg.alert(cfg.alertTitle, 'Please enter a message');
            return;
        }
        
        view.setMasked(true);
        
        provider.sendMms({
            address  : addresses.join(','),
            fileId   : attachment,
            message  : subject,
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
     * Handler for Mms Status button.
     * It will get the mmsId field value and perform a getMmsStatus call to Provider API.
     */
    onMessageStatus: function(btn, event, eOpts) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            cfg = SampleApp.Config,
            form = btn.up('formpanel').getValues(),
            mmsId = form.mmsId;
    
        //check message Id
        if (!mmsId) {
            Ext.Msg.alert(cfg.alertTitle, 'Please enter a message id');
            return;
        } 
        
        view.setMasked(true);
        
        provider.getMmsStatus({
            mmsId: mmsId,
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
    
    
    onFileSelected: function() {
        var cfg = SampleApp.Config,
            maxSize = cfg.maxTotalFileSize || 600 * 1024,
            total;
        
        total = me.getTotalFileSize();

        if (total > maxSize) {
            Ext.Msg.alert('Warning', 'The total of all files selected (' +  Math.round(total/1024) + 'K) exceeds the allowed Max Size of 600K.  You will need to select smaller files before you can send this message.');
        }

    },
    
    /**
     * Method that calculates the total file size of all files selected.
     * @return totalSize
     */
    getTotalFileSize: function() {
        var fileInputs = Ext.DomQuery.select('input[type=file]'),
            total = 0,
            files;

        for (var i=0; i<fileInputs.length; i++) {
            files = fileInputs[i].files;
            for (var j=0; j<files.length; j++) {
                total += files[j].size;
            }
        }

        return total;
    }
    
});