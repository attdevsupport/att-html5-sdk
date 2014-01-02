/**
 * @hide BF2.1 doesnt support DC
 * @private
 * The DeviceInfo view exercises the Device Info API.
 * This view allows the user to enter a wireless number for a mobile device associated with their account. 
 * Only devices attached to their account can be entered. Any other number will generate an error.
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
                    label: "Wireless #"
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
        this.fireAction('checkauthorization', [this, "DC"], 'afterAuthorize');
    },
     
    /**
     * @private
     */
    afterAuthorize: function() {
        this.down('container[name=page]').show();
    },

    /**
     * Handler to validate the phone number. When a phone is valid it will enable the action button.
     * @param field
     */
    onFieldChange: function(field) {
        var button = this.down('button[action=getDeviceInfo]');
        if (Att.Provider.isValidPhoneNumber(field.getValue())) {
            button.enable();
        } else {
            button.disable();
        }
    },
 
    /**
     * Validates the phone number. If it is valid, fires an apicall event with the normalized number.
     */
    onDeviceInfoTap: function() {
        var value = this.down('textfield[name=msisdn]').getValue();
        if (Att.Provider.isValidPhoneNumber(value)) {
            this.fireEvent('apicall', this, {
                method: 'getDeviceInfo',
                address: Att.Provider.normalizePhoneNumber(value)
            });
        }
    }
});