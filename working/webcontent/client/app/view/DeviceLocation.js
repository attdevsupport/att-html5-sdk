/**
 * The DeviceLocation view exercises the Device Location API.
 * This view allows the user to enter a MSISDN for a mobile device associated with their account. Only devices attached to their account can be entered. Any other number will generate an error.
 *
 */
Ext.define('KitchenSink.view.DeviceLocation', {
    extend: 'Ext.Container',
    xtype: 'devicelocation',

    config: {
        title: 'Device Location',
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
                action: 'getDeviceLocation',
                disabled: true,
                text: 'Get Device Location'
            }]
        },
        control: {
            'textfield[name=msisdn]': {
                keyup: 'onFieldChange',
                action: 'onDeviceLocationTap',
                buffer: 200
            },
            'button[action=getDeviceLocation]': {
                tap: 'onDeviceLocationTap'
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
        var button = this.down('button[action=getDeviceLocation]');
        if (Att.Provider.util.isValidPhoneNumber(field.getValue())) {
            button.enable();
        } else {
            button.disable();
        }
    },

    /**
     * Validates the phone number (MSISDN). If it is valid, fires an apicall event with the normalized MSISDN.
     */
    onDeviceLocationTap: function() {
        var value = this.down('textfield[name=msisdn]').getValue();
        if (Att.Provider.util.isValidPhoneNumber(value)) {
            this.fireEvent('apicall', this, {
                method: 'getDeviceLocation',
                address: Att.Provider.util.normalizePhoneNumber(value)
            });
        }
    }
});