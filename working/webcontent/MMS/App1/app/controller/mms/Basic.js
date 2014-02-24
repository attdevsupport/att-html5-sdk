/**
 * Controller that interacts with the Basic MMS application.
 */
Ext.define('SampleApp.controller.mms.Basic', {
    extend: 'Ext.app.Controller',
   
    requires: [
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
            },
            uploadFileType: 'radiofield[id=uploadAttachment]',
            fileUploadSelect: 'fileTypeSelect',
            f1: 'filefield[name=f1]',
            f2:'filefield[name=f3]',
            f3: 'filefield[name=f3]',
            attachmentSelect: 'selectfield[name=attachment]'
        },
        
        control: {
            'button[action=sendmessage]': {
                tap: 'onSendMms'
            },
            'filefield': {
                change: 'onFileSelected'
            },
            'button[action=messagestatus]':{
                tap: 'onMessageStatus'
            },
            'actionsheet button[action=close]': {
                tap: 'onCloseResponseView'
            },
            'radiofield[id=uploadAttachment]': {
            	change: 'enableFileField'
            }
        }
    },
    controls: {},
    launch: function () {

    	this.controls.f1 = this.getF1();
    	this.controls.f2 = this.getF2();
    	this.controls.f3 = this.getF3();
    	this.controls.attachmentSelect = this.getAttachmentSelect();

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
	userUpload: false,
    enableFileField: function() {
    	this.userUpload = this.getUploadFileType()._checked;
    
    	this.controls.f1.setDisabled(!this.userUpload)
    	this.controls.f1.setHidden(!this.userUpload);

    	this.controls.attachmentSelect.setDisabled(this.userUpload);
    	this.controls.attachmentSelect.setHidden(this.userUpload);

		this.controls.f2.setDisabled(this.userUpload);
		this.controls.f3.setDisabled(this.userUpload);
    },
    
    onCloseResponseView: function(){
        this.getResponseView().hide();
    },
   
    /**
     * Handler for send Mms button.
     * This will take the parameters in the send mms form to make a call to sendMms API method.
     * It populates the mmsId field with the MMS Id property obtained in the response.
     */
    onSendMms: function (btn, event, eOpts) {

    	
    	if (this.userUpload) {
    		alert("will post form here");
    	} else {

    		var me = this,
				view = me.getView(),
				cfg = SampleApp.Config,
				form = btn.up('formpanel').getValues(),
				subject = form.subject,
				attachment = form.attachment,
				maxSize = cfg.maxTotalFileSize || 600 * 1024,
				total, addresses, address, l, i = 0;

    		total = me.getTotalFileSize();

    		//check file size
    		if (total > maxSize) {
    			Ext.Msg.alert(cfg.alertTitle, 'The total of all files selected (' + Math.round(total / 1024) + 'K) exceeds the allowed Max Size of 600K.  Please select smaller files and try again.');
    			return;
    		}

    		//check phone numbers
    		if (!form.address) {
    			Ext.Msg.alert(cfg.alertTitle, cfg.invalidPhoneMsg);
    			return;
    		}

    		addresses = form.address.split(',');

    		l = addresses.length;
    		for (; i < l ; i++) {
    			address = addresses[i].trim();
    			if (!AttApiClient.util.isValidPhoneNumber(address)) {
    				Ext.Msg.alert(cfg.alertTitle, cfg.invalidPhoneMsg);
    				return;
    			}
    			addresses[i] = AttApiClient.util.normalizePhoneNumber(address);
    		}

    		// check message (field named 'subject' per spec)
    		if (subject === '') {
    			Ext.Msg.alert(cfg.alertTitle, 'Please enter a message');
    			return;
    		}

    		view.setMasked(true);

    		var data = {
    			addresses: addresses.join(','),
    			fileId: attachment,
    			message: subject
    		};

    		AttApiClient.sendMms(
				data,
				function (response) {
					view.setMasked(false);
					me.showResponseView(true, response);
					//set the message Id value 
					view.down('formpanel textfield[name=mmsId]').setValue(response.outboundMessageResponse.messageId);
				},
				function (response) {
					view.setMasked(false);
					me.showResponseView(false, response);
				}
			);
    	}
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
        
		AttApiClient.mmsStatus (
			{ id: mmsId },
			function (response) {
                view.setMasked(false);
                me.showResponseView(true, response);
			},
			function (response) {
				view.setMasked(false);
				me.showResponseView(false, response);
			}
		)        
      
    },
    
    
    onFileSelected: function () {

        var cfg = SampleApp.Config,
            maxSize = cfg.maxTotalFileSize || 600 * 1024,
            total;
        
        total = this.getTotalFileSize();

        if (total > maxSize) {
            Ext.Msg.alert('Warning', 'The total of all files selected (' +  Math.round(total/1024) + 'K) exceeds the allowed Max Size of 600K.  You will need to select smaller files before you can send this message.');
        }

    },
    
    /**
     * Method that calculates the total file size of all files selected.
     * @return totalSize
     */
    getTotalFileSize: function () {

        var fileInputs = Ext.DomQuery.select('input[type=file]'),
            total = 0,
            files;

        for (var i=0; i<fileInputs.length; i++) {
        	files = fileInputs[i].files;
        	for (var j = 0; j < files.length; j++) {
        		total += files[j].size;
        	}
        }

        return total;
    }
    
});