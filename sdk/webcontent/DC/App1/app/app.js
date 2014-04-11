Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib'
});

/**
 * Sample App Device Capabilities Basic application
 * @class SampleApp
 */
Ext.application({
    name: 'SampleApp',

    controllers: ['device.Capabilities'],

    views: ['device.Capabilities'],

    launch: function(){
        AttApiClient.OAuth.authorizeUser(
            {scope: "DC"},
            function() {
                Ext.Viewport.add({
                    xtype: 'container', 
                    fullscreen: true,
                    layout: 'card',
                    items:[{
                        xtype: 'toolbar',
                        title: 'Device Capabilities',
                        docked: 'top',
                        ui: 'att'
                    },{
                        xtype: 'att-device-dc'
                    }]
                });
            },
            function(error) {
                if (error == "access_denied") {
                    alert("please run this sample on a device that connects to the internet through the AT&T cellular network, or through a wifi hotspot hosted on such a device.");
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