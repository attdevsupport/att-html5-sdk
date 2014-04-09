/**
 *
 * User Interface for the SMS Basic application.
 * Registration IDs or short codes need to be configured on SampleApp.Config class.
 * Please refer to <code> shortCode </code> and <code> anotherShortCode </code> configuration parameters in order to be able to receive message.
 *
 */
Ext.define('SampleApp.view.sms.Basic', {
    extend: 'Ext.Container',
    xtype: 'att-sms-basic',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config'
    ],

    config: {
        title: 'Basic SMS',
        scrollable: 'vertical',
        defaults: {
        	scrollable: null
        }
    },

    initialize: function() {
        this.add([
            {xtype: 'att-header'},
			{
				xtype: 'container',
				cls: 'note',
				maxWidth: 510,
				html: '<span>Note</span><span>This application will send SMS messages only to phones on the AT&T Network</span>',
			},
            this.buildSendSms(),
            this.buildSmsStatuts(),
            this.buildGetSms(),
            {xtype: 'att-footer'}
        ]);
    },


    /**
     * Builds the UI components for Feature 1: Send SMS Message.
     */
    buildSendSms: function() {
    	var cfg = SampleApp.Config;
        return {
            xtype   : 'formpanel',
            itemId: 'feature1',
            defaults: {
            	margin: '10px 20px',
            	width: '94%',
            	maxWidth: 500
            },
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 1: Send SMS Message',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items: [
						{
                            xtype    : 'textfield',
                            label    : 'Phone',
                            name     : 'address',
                            value    : cfg.defaultPhoneNbr,
                            required : true
                        },
                        {
                            xtype    : 'textareafield',
                            label    : 'Message',
                            name     : 'message',
                            value    : cfg.defaultMessage,
                            required : true
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'sendmessage',
					id  	: 'btnSendMessage',
                    text    : 'Send Message'
                }
            ]
        };
    },


    /**
     * Builds the UI components for Feature 2: Get Delivery Status.
     */
    buildSmsStatuts: function() {
        return {
            xtype   : 'formpanel',
            itemId: 'feature2',
            defaults: {
            	margin: '10px 20px',
            	width: '94%',
            	maxWidth: 500
            },
            items : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 2: Get Delivery Status',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items : [
                        {
                            xtype    : 'textfield',
                            label    : 'Message ID',
                            name     : 'smsId',
                            itemId   : 'smsId',
                            required : true
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    action  : 'messagestatus',
                    ui      : 'action',
                    itemId  : 'btnForFeature2',
					id		: 'btnGetStatus',
                    text    : 'Get Status'
                }
            ]
        };
    },

    /**
     * Builds the UI components for Feature 3: Get Received Messages.
     */
    buildGetSms: function(btn) {
        var cfg = SampleApp.Config,
            items = [];

        if(cfg.shortCode){
            items.push({
                xtype   : 'button',
                ui      : 'action',
                action  : 'receivemessage',
                itemId  : 'registrationID',
                regId   : cfg.shortCode,
				id		: 'btnGetMessages',
                text    : 'Get Messages for Short Code ' + cfg.shortCode
            });
        }
        
        if(cfg.anotherShortCode){
            items.push({
                xtype   : 'button',
                ui      : 'action',
                action  : 'receivemessage',
                itemId  : 'registrationID2',
                regId   : cfg.anotherShortCode,
				id		: 'btnGetMessages-2',
                text    : 'Get Messages for Short Code ' + cfg.anotherShortCode
            });
        }
        
        if(!cfg.shortCode && !cfg.anotherShortCode){
            items.push({
                xtype: 'container',
                html: 'No Short Code is configured'
            });
        }
        
        return {
            xtype   : 'formpanel',
            itemId: 'feature3',
            defaults: {
            	margin: '10px 20px',
            	width: '94%',
            	maxWidth: 500
            },
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 3: Get Received Messages',
                    padding: '2%',
                    items: items
                }
            ]
        };
    }
    
});