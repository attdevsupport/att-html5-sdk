Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'app/lib'
});


/**
 * Kitchen Sink Application
 * @class KitchenSink
 */
Ext.application({
    name: 'KitchenSink',

    controllers: ['Main'],
    views: ['Main'],
    profiles: ['Phone']
});

