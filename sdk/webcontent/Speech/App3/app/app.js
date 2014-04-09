Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App Text to Speech Example application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',
    controllers: ['speech.FromText'],
    views: ['speech.FromText'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Text to Speech Example',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-speech-fromtext'
            }]
       });
   }
});