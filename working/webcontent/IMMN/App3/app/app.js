Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App IAM Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['iam.Basic'],
    stores: ['Messages'],
    views: ['iam.Basic'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'IAM Example',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-iam-basic'
            }]
        });
    }
});