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
    name: 'SpeechSample',
    
    //declare controllers
    controllers: ['Speech'],
    
    //declare views
    views: ['Speech'],
    
    //launch app
    launch: function() {
        
        var view = Ext.create('SpeechSample.view.Speech');
        
        //add speech view to viewport
        Ext.Viewport.add(view);
    }
});