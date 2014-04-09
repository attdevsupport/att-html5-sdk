Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App Speech to text Captured application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['speech.Captured'],
    views: ['speech.Captured'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Captured Speech to Text',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-speech-captured'
            }]
       });
   }
});