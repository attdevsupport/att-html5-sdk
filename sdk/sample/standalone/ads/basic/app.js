Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App ADS Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['ads.Basic'],

    views: ['ads.Basic'],

    launch: function(){
        Ext.Viewport.add({
              xtype: 'container', 
              fullscreen: true,
              layout: 'card',
              items:[{
                  xtype: 'toolbar',
                  title: 'Basic Ads',
                  docked: 'top',
                  ui: 'att'
              },{
                  xtype: 'att-ads-basic'
               }]
        });
    }
});