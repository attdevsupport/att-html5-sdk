/**
 * List view that displays each of the APIs.
 * When the user taps on an API the view for that API appears
 */
Ext.define('KitchenSink.view.Main', {
    extend: 'Ext.navigation.View',

    requires: ['KitchenSink.view.NavigationList'],

    config: {
        fullscreen  : true,
        items: [
            {
                xtype: 'navigationlist',
                title: 'Javascript Testing Framework'
            }
        ]
    }
});