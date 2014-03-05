/**
 * set loader configuration enabled
 */
Ext.Loader.setConfig({
    enabled: true
});

/**
 * configure location for the Att library
 */
Ext.Loader.setPath({
    'Att': '../../app/lib'
});

/**
 * creates the application for SMS example
 */
Ext.application({
    name: 'SmsOnly',
    
    //declare controllers
    controllers: ['Sms'],
    
    //declare views
    views: ['Sms'],
    
    //launch app
    launch: function() {
        
        var view = Ext.create('SmsOnly.view.Sms');
        
        //add sms view to viewport
        Ext.Viewport.add(view);
    }
});