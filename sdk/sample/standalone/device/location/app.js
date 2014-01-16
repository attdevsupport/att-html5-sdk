Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App Device Location Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['device.Location'],

    views: ['device.Location'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Device Location',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-device-tl'
            }]
        });
    }
});