Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App MIM Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['mim.Basic'],

    views: ['mim.Basic'],

    models: ['MessageHeader'],
    
    stores :['MessageHeaders'],
     
    
    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Basic MIM',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-mim-basic'
            }]
        });
    }
});