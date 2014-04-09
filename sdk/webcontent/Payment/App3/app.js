Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib',
    'ux' : 'ux'
});

/**
 * Sample App Subscription application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',
    
    models:['SubscriptionTransaction'],
    
    stores: ['SubscriptionTransactions'],
    
    controllers: ['payment.Subscription'],

    views: ['payment.Subscription'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Subscription App',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-payment-subscription'
            }]
        });
    }
});