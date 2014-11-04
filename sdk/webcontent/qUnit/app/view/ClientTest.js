// This file would be better named testAll.js.
Ext.define('KitchenSink.view.ClientTest', {
    extend: 'Ext.Container',
    xtype: 'attTST',

	requires: [
       'Att.Provider',
	   'KitchenSink.view.config'
    ],
	
    config: {
        provider: undefined,
        title: 'Test All',
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
                text: 'Test All',
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
		basicSMSTests(cfg);
		positiveSMSTests(cfg);
		negativeSMSTests(cfg);
		//pairwiseSMSTests(cfg);
		
		basicMMSTests(cfg);
		positiveMMSTests(cfg);
		negativeMMSTests(cfg);
		//pairwiseMMSTests(cfg);
		
		basicWAPTests(cfg);
		positiveWAPTests(cfg);
		negativeWAPTests(cfg);
		//pairwiseWAPTests(cfg);
		
		basicTLTests(cfg);
		positiveTLTests(cfg);
		negativeTLTests(cfg);
		//pairwiseTLTests(cfg);
		
		//basicDCTests(cfg);
		//positiveDCTests(cfg);
		//negativeDCTests(cfg);
		//pairwiseDCTests(cfg);
		
		basicSpeechTests(cfg);
		//positiveSpeechTests(cfg);
		//negativeSpeechTests(cfg);
		//pairwiseSpeechTests(cfg);
		
		basicMoboTests(cfg);
		positiveMoboTests(cfg);
		negativeMoboTests(cfg);
		//pairwiseMoboTests(cfg);
		
		basicMimTests(cfg);
		positiveMimTests(cfg);
		negativeMimTests(cfg);
		//pairwiseMimTests(cfg);
		
		//mixedTests(cfg);
	}
});
