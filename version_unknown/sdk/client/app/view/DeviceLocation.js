/**
 * The DeviceLocation view exercises the Device Location API.
 * This view allows the user to enter a wireless number associated with their account. Only devices attached to their account 
 * can be entered. Any other number will generate an error.
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
                xtype: 'button',
                action: 'getDeviceLocation',
                text: 'Get Device Location'
            }]
        },
        control: {
            'button[action=getDeviceLocation]': {
                tap: 'onDeviceLocationTap'
            }
        }
    },

    //override
    initialize: function() {
        this.callParent();
        this.fireAction('checkauthorization', [this, null], 'afterAuthorize');
    },
    
    /**
     * @private
     */
    afterAuthorize: function() {
        this.down('container[name=page]').show();
    },


    /**
     * Fires an apicall event.
     */
    onDeviceLocationTap: function() {
        this.fireEvent('apicall', this, {
            method: 'getDeviceLocation'
        });
    }
});