/**
 * The SMS view exercises the SMS API.
 * This view allows the user to enter a wireless number associated with their account. Only devices attached to their account 
 * can be entered. Any other number will generate an error.
 * 
 */
Ext.define('KitchenSink.view.SMS', {
    extend: 'Ext.Container',
    xtype: 'sms',

    config: {
        /**
         * Once we send an sms message we store the ID returned by the API
         * so that we can check its delivery status.
         */
        smsId: null,
        title: 'SMS',
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'center'
        },
        items: {
            xtype: 'container',
            width: '95%',
            items:[{
                xtype: 'fieldset',
                defaults: {
                    labelWidth: 120
                },
                items: [
                    {name: 'smsOne', xtype: 'textfield', label: 'Wireless #(s)'}
                ]
            }, {
                xtype: 'button',
                text: 'Send SMS',
                action: 'sendsms',
                style: 'margin-bottom: 10px;'
            }, {
                xtype: 'button',
                text: 'SMS Status',
                action: 'smsstatus',
                style: 'margin-bottom: 10px;',
                disabled: true
            }, {
                xtype: 'button',
                text: 'Receive SMS',
                action: 'receivesms',
                style: 'margin-bottom: 10px;'
            }]
        },
        control: {
            'button[action=sendsms]': {
                tap: 'onSendSms'
            },
            'button[action=sendmultisms]': {
                tap: 'onSendMultiSms'
            },
            'button[action=smsstatus]': {
                tap: 'onSmsStatus'
            },
            'button[action=receivesms]': {
                tap: 'onReceiveSms'
            }
        }
    },

    /**
     * Pulls the wireless number from the smsOne text field and fires the apicall event.
     */
    onSendSms: function() {
        var smsOne = this.down('textfield[name=smsOne]'),
            statusButton = this.down('button[action=smsstatus]');

        this.fireEvent('apicall', this, {
            method: 'sendSms',
            address: smsOne.getValue(),
            message: 'Sencha Test SMS',
            success: function(data) {
                this.setSmsId(data.Id);
                statusButton.enable();
            },
            failure: function(data) {
                this.setSmsId(null);
                statusButton.disable();
            },
            scope: this
        });
    },


    /**
     * Retrieve the status of the latest sms message we sent using the smsId property.
     */
    onSmsStatus: function() {
        this.fireEvent('apicall', this, {
            method: 'getSmsStatus',
            smsId: this.getSmsId()
        });
    },

    
    /**
     * Checks the application's shortcode message inbox for any message.
     */
    onReceiveSms: function() {
        this.fireEvent('apicall', this, {
            method: 'receiveSms',
            registrationId: 491
        });
    }
});
