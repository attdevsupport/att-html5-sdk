/**
 * The DeviceInfo view exercises the Device Info API.
 * This view allows the user to enter a MSISDN for a mobile device associated with their account. Only devices attached to their account can be entered. Any other number will generate an error.
 *
 */
Ext.define('KitchenSink.view.DeviceInfo', {
    extend: 'Ext.Container',
    xtype: 'deviceinfo',

    config: {
        title: 'Device Info',
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'center'
        },
        items: {
            xtype: 'container',
            name: 'page',
            hidden: true,
            width: '80%',
            items: [{
                xtype: 'fieldset',
                items: [{
                    xtype: 'textfield',
                    name: 'msisdn',
                    label: "MSISDN"
                }]
            }, {
                xtype: 'button',
                action: 'getDeviceInfo',
                disabled: true,
                text: 'Get Device Info'
            }]
        },
        control: {
            'textfield[name=msisdn]': {
                keyup: 'onFieldChange',
                action: 'onDeviceInfoTap',
                buffer: 200
            },
            'button[action=getDeviceInfo]': {
                tap: 'onDeviceInfoTap'
            }
        }
    },

    //override
    initialize: function() {
        this.callParent();
        this.fireAction('checkauthorization', [this], 'afterAuthorize');
    },
     
    /**
     * @private
     */
    afterAuthorize: function() {
        this.down('container[name=page]').show();
    },

    /**
     * Handler to validate the phone number (MSISDN). When a phone is valid it will enable the action button.
     * @param field
     */
    onFieldChange: function(field) {
        var button = this.down('button[action=getDeviceInfo]');
        if (Att.Provider.util.isValidPhoneNumber(field.getValue())) {
            button.enable();
        } else {
            button.disable();
        }
    },
 
    /**
     * Validates the phone number (MSISDN). If it is valid, fires an apicall event with the normalized MSISDN.
     */
    onDeviceInfoTap: function() {
        var value = this.down('textfield[name=msisdn]').getValue();
        if (Att.Provider.util.isValidPhoneNumber(value)) {
            this.fireEvent('apicall', this, {
                method: 'getDeviceInfo',
                address: Att.Provider.util.normalizePhoneNumber(value)
            });
        }
    }
});