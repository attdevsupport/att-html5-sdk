Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App SMS Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['sms.Basic'],

    views: ['sms.Basic'],

    launch: function(){
        Ext.Viewport.add({
              xtype: 'container', 
              fullscreen: true,
              layout: 'card',
              items:[{
                  xtype: 'toolbar',
                  title: 'Basic SMS',
                  docked: 'top',
                  ui: 'att'
              },{
                  xtype: 'att-sms-basic'
               }]
        });
    }
});