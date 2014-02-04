Ext.define('KitchenSink.view.testPaymentonly', {
    extend: 'Ext.Container',
    xtype: 'attTestPayment',

	requires: [
       'Att.Provider',
	   'KitchenSink.view.config'
    ],
	
    config: {
        provider: undefined,
        title: 'Test Payment',
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
                text: 'Test Payment',
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
		//basicPaymentTransTests(cfg);
		//basicPaymentSubsTests(cfg);
		negativeTransactionsTests(cfg);
		negativeSubscriptionsTests(cfg);
		//positivePaymentTests(cfg);
		//positiveSubscriptionsTests(cfg);
		// pairwisePaymentTests(cfg);
	}
});
