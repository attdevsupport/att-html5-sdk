Ext.define('SampleApp.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        views: [
            'Main'
        ]
    },

    isActive: function() {
        return true;
        //return !Ext.os.is('Phone');
    },

    launch: function() {
        Ext.create('SampleApp.view.phone.Main');
    }
});