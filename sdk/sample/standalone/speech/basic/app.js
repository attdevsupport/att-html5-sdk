Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'app/lib'
});

/**
 * Sample App Speech to text Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['speech.Basic'],

    views: ['speech.Basic'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'Basic Speech to Text',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-speech-basic'
            }]
       });
   }
});