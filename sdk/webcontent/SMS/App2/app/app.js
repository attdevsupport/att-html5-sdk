Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App SMS Voting application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    models: ['Vote'],
    
    stores: ['Votes'],
    
    controllers: ['sms.Voting'],

    views: ['sms.Voting'],

    launch: function(){
        Ext.Viewport.add({
            xtype: 'container', 
            fullscreen: true,
            layout: 'card',
            items:[{
                xtype: 'toolbar',
                title: 'SMS Voting',
                docked: 'top',
                ui: 'att'
            },{
                xtype: 'att-sms-voting'
            }]
        });
   }
});