/**
 * The Sms view exercises the sendSms and getSmsStatus API Calls.
 */
Ext.define('SmsOnly.view.Sms', {
    extend : 'Ext.Container',
    xtype  : 'sms-view',
    
    requires : ['Ext.form.FieldSet'],
    
    config : {
        /**
         * Once we send the sms, we store the id to retrieve its status 
         */
        smsId: null,
        
        fullscreen : true,
        scrollable : 'vertical',
        layout     : 'vbox',
        items      : [
            {
                xtype  : 'toolbar',
                title  : 'SMS Example',
                docked : 'top'
            },
            {
                xtype   : 'fieldset',
                defaults: {
                    labelAlign : 'top',
                    labelWidth : '100%'
                },
                items: [
                    {
                        xtype : 'textfield',
                        label : 'To',
                        name  : 'to'
                    },
                    {
                        xtype : 'textareafield',
                        label : 'Message',
                        name  : 'message'
                    }
                ]
            },
            /**
             * send message button
             */
            {
                xtype  : 'button',
                action : 'sendsms',
                text   : 'Send SMS'
            },
            /**
             * get status button
             */
            {
                xtype  : 'button',
                action : 'smsstatus',
                text   : 'SMS Status'
            }
        ]
        
    }
        
});