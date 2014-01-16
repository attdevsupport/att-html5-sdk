Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App MOBO Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['mobo.Basic'],

    views: ['mobo.Basic'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container',
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Basic IMMN Send Service',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-mobo-basic'
            }]
        });
    }
});