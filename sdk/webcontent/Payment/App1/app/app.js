Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App Payments Notary application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',
    
    controllers: ['payment.Notary'],

    views: ['payment.Notary'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Notary App',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-payment-notary'
            }]
        });
    }
});