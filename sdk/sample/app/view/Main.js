/**
 * This is the main view for sample Application.
 */
Ext.define('SampleApp.view.Main', {
    extend: 'Ext.navigation.View',

    requires: ['SampleApp.view.NavigationList'],

    config: {
        fullscreen  : true,
        navigationBar: {
            ui: 'att'
        },
        items: [
            {
                xtype: 'navigationlist',
                title: 'AT&T Sample App'
            }
        ]
    }

});