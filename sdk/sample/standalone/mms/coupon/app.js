Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App MMS Coupon application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    models: ['DeliveryInfo'], 

    stores: ['DeliveryInfos'],
    
    controllers: ['mms.Coupon'],

    views: ['mms.Coupon'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'MMS Coupon',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-mms-coupon'
            }]
        });
    }
});