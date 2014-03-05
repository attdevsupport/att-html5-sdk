Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'app/lib'
});

/**
 * 
 */
Ext.application({
    name: 'KitchenSink',

    controllers: ['Main'],
    views: ['Main'],
    profiles: ['Phone']
});

