Ext.define('KitchenSink.view.testNegativeonly', {
    extend: 'Ext.Container',
    xtype: 'attTestNegative',

	requires: [
       'Att.Provider',
	   'KitchenSink.view.config'
    ],
	
    config: {
        provider: undefined,
        title: 'Test Negative',
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
                text: 'Test Negative',
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
		oAuth();
		negativeSMSTests(cfg);
		negativeMMSTests(cfg);
		negativeWAPTests(cfg);
		negativeTLTests(cfg);
		negativeDCTests(cfg);
		negativeTransactionsTests(cfg);
		negativeSubscriptionsTests(cfg);
		//negativeMoboTests(cfg);
		negativeMimTests(cfg);
	}
});
