Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App Single Pay application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',
    
    controllers: ['payment.SinglePay'],
    
    stores: ['SinglePayTransactions'],
    
    models:['SinglePayTransaction'],

    views: ['payment.SinglePay'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Single Pay App',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-payment-singlepay'
            }]
        });
    }
});