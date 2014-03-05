Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App MIM Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['mim.Basic'],

    views: ['mim.Basic'],

    models: ['MessageHeader'],
    
    stores :['MessageHeaders'],
     
    
    launch: function(){
        AttApiClient.authorizeUser(
            {scope: "MIM,IMMN"},
            function() {
				Ext.Viewport.add({
					xtype: 'container', 
					fullscreen: true,
					layout: 'card',
					items:[{
						xtype: 'toolbar',
						title: 'Basic MIM',
						docked: 'top',
						ui: 'att'
					},{
						xtype: 'att-mim-basic'
					}]
				});
            },
            function(error) {
                if (error == "access_denied") {
                    alert("please run this sample after obtaining consent from the phone where that you want to access the text message on behalf of.");
                }
                else if (typeof error == "string") {
                    alert("authorizeUser error: " + error);
                }
                else {
                    alert("authorizeUser error");
                }
            }
        );
    }
});