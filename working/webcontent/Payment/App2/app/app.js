Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib',
    'ux' : 'ux'
});

/**
 * Sample App Single Pay application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',
    
    models:['SinglePayTransaction'],
    
    stores: ['SinglePayTransactions'],
    
    controllers: ['payment.SinglePay'],

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