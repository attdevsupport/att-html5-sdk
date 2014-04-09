/**
 * The MMS view exercises the MMS API.
 * This view allows the user to enter a MSISDN for a mobile device associated with their account. Only devices attached to their account can be entered. Any other number will generate an error.
 * 
 */
Ext.define('KitchenSink.view.MMS', {
    extend: 'Ext.Container',
    xtype: 'mms',

    config: {
        mmsId: null,
        title: 'MMS',
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'center'
        },
        items: {
            xtype: 'container',
            width: '80%',
            items:[{
                xtype: 'fieldset',
                defaults: {
                    labelWidth: 120
                },
                items: [
                    {name: 'mmsOne', xtype: 'textfield', label: 'MSISDN One'},
                    {name: 'mmsTwo', xtype: 'textfield', label: 'MSISDN Two'}
                ]
            }, {
                xtype: 'button',
                text: 'Send MMS',
                action: 'sendmms',
                style: 'margin-bottom: 10px;'
            }, {
                xtype: 'button',
                text: 'Send Multi MMS',
                action: 'sendmultimms',
                style: 'margin-bottom: 10px;'
            }, {
                xtype: 'button',
                text: 'MMS Status',
                action: 'mmsstatus',
                style: 'margin-bottom: 10px;',
                disabled: true
            }]
        },
        control: {
            'button[action=sendmms]': {
                tap: 'onSendMms'
            },
            'button[action=sendmultimms]': {
                tap: 'onSendMultiMms'
            },
            'button[action=mmsstatus]': {
                tap: 'onMmsStatus'
            }
        }
    },

    /**
     * It will fire the apicall event with the address parameter.
     *
     * NOTE: Most mobile web applications do not currently support accessing and posting media files from mobile devices.
     * Since MMS is designed to send pictures and video, the sendMms method has a fileId config property which can be used
     * to reference a file stored on the server file system.  Depending on your application requirements, you may need to
     * modify the server code, in order to use this fileId reference to find and include data that is sent via MMS.
     *
     * Please see the language specific server guide for instructions on how to customize this code.
     * @param address {String} The phone number the user has entered.
     */
    doSendMms: function(address) {
        var statusButton = this.down('button[action=mmsstatus]');

        this.fireEvent('apicall', this, {
            method: 'sendMms',
            address: address,
            message: 'Hello From Sencha',
            priority: 'High',
            fileId: 'sencha.jpg',
            success: function(data) {
                this.setMmsId(data.Id);
                statusButton.enable();
            },
            failure: function(data) {
                this.setMmsId(null);
                statusButton.disable();
            },
            scope: this
        });
    },

    /**
     * Handler for sendMms button. Pulls the MSISDN from the mmsOne text field and calls the doSendMms function.
     */
    onSendMms: function() {
        var mmsOne = this.down('textfield[name=mmsOne]');
        this.doSendMms(mmsOne.getValue());
    },

    /**
     * Pulls the MSISDN from the mmsOne and mmsTwo text fields and calls
     * doSendMms function with both numbers joined with a comma.
     *       
     */
    onSendMultiMms: function() {
        var mmsOne = this.down('textfield[name=mmsOne]'),
            mmsTwo = this.down('textfield[name=mmsTwo]');
        this.doSendMms(mmsOne.getValue() + ',' + mmsTwo.getValue());
    },

    /**
     * After sending a Mms message using doSendMms, an mmsId is returned by the api and it is stored on mmsId property.
     * This method uses mmsId to retrieve the status of the mms message.
     */
    onMmsStatus: function() {
        this.fireEvent('apicall', this, {
            method: 'getMmsStatus',
            mmsId: this.getMmsId()
        });
    }
});
