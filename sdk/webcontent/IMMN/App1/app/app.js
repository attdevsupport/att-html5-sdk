Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample In App Messaging Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',
    controllers: ['iam.iamExample'],
    stores: ['Messages'],
	models: ['Message', 'MessageContent'],
    views: ['iam.iamExample'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'In App Messaging Application',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-iam-iamExample'
            }]
        });
    }
});