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

    controllers: ['iam.iamExample'],
    stores: ['Messages'],
	models: ['Message'],
    views: ['iam.iamExample'],

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
                xtype: 'att-iam-iamExample'
            }]
        });
    }
});