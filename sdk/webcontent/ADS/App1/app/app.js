Ext.Loader.setConfig({
    enabled: true
});

/**
 * Sample App Advertisements Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['sample.Advertisements'],

    views: ['sample.Advertisements'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Advertisements',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-sample-ads'
            }]
        });
    },
});