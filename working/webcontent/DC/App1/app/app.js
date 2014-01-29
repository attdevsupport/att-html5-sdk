Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App Device Capabilities Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['device.Capabilities'],

    views: ['device.Capabilities'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Device Capabilities',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-device-dc'
            }]
        });
    }
});