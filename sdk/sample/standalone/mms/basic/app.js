Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App MMS Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['mms.Basic'],

    views: ['mms.Basic'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Basic MMS',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-mms-basic'
            }]
        });
    }
});