Ext.define('KitchenSink.view.testIsolatedonly', {
    extend: 'Ext.Container',
    xtype: 'attTestIsolated',

	requires: [
       'Att.Provider',
	   'KitchenSink.view.config'
    ],
	
    config: {
        provider: undefined,
        title: 'Test Isolated',
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'center'
        },
        items: {
            xtype: 'container',
            width: '80%',
           items:[{
                xtype: 'fieldset',
                defaults: {
                    labelWidth: 120
                },
                items: [

                ]
            }, {
                xtype: 'button',
                text: 'Test Isolated',
                action: 'attTest',
                style: 'margin-bottom: 10px;'
            }]
        },
        control: {
            'button[action=attTest]': {
                tap: 'onPush'
            }
        }
    },
	
	onPush: function() {
        provider = Ext.create('Att.Provider',{
			apiBasePath: '/att'
        });
		var cfg = KitchenSink.view.config;
		Ext.Viewport.hide();
		basicIsolatedTests(cfg);
		//positiveIsolatedTests(cfg);
		//negativeIsolatedTests(cfg);
		
	}
});
