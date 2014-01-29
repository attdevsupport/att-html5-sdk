Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App MMS Image Gallery application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    models: ['Image'],
    
    stores: ['Images'],
    
    views: ['mms.Gallery'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'MMS Gallery',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-mms-gallery'
            }]
       });
   }
});