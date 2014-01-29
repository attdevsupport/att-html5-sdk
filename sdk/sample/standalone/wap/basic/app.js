Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App WAP Push Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',
    
    controllers: ['wap.Basic'],

    views: ['wap.Basic'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'WAP Basic',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-wap-basic'
            }]
        });
    }
});