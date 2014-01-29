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

    controllers: ['cms.Basic'],

    views: ['cms.Basic'],

    launch: function(){
        Ext.Viewport.add({
              xtype: 'container', 
              fullscreen: true,
              layout: 'card',
              items:[{
                  xtype: 'toolbar',
                  title: 'Basic Call Management',
                  docked: 'top',
                  ui: 'att'
              },{
                  xtype: 'att-cms-basic'
               }]
        });
    }
});