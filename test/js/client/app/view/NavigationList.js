/**
 * List view that displays each of the APIs.
 * When the user taps on an API the view for that API appears
 */
Ext.define('KitchenSink.view.NavigationList', {
    extend: 'Ext.List',
    xtype: 'navigationlist',

    requires: [
        'KitchenSink.view.ClientTest',
        'KitchenSink.view.testADSonly',
		'KitchenSink.view.testIsolatedonly',
		'KitchenSink.view.testTropoonly',
        'KitchenSink.view.testSMSonly',
        'KitchenSink.view.testMMSonly',
        'KitchenSink.view.testWAPonly',
        'KitchenSink.view.testTLonly',
        'KitchenSink.view.testDConly',
        'KitchenSink.view.testPaymentonly',
        'KitchenSink.view.testTransactionsonly',
        'KitchenSink.view.testSubscriptionsonly',
        'KitchenSink.view.testSpeechonly',
        'KitchenSink.view.testMoboonly',
        'KitchenSink.view.testMIMonly',
        'KitchenSink.view.testBasiconly',
        'KitchenSink.view.testPositiveonly',
        'KitchenSink.view.testNegativeonly',
        'KitchenSink.view.testMixedonly',
        'KitchenSink.view.testPairwiseonly'
    ],

    config: {
        title: 'AT&T APIs',
        data: [
			{text: 'Test Isolated',           id: 'attTestIsolated'},
            {text: 'Test Ads',                id: 'attTestADS'},
			{text: 'Test Tropo',              id: 'attTestTropo'},
            {text: 'Test SMS',                id: 'attTestSMS'},
            {text: 'Test MMS',                id: 'attTestMMS'},
            {text: 'Test WAP',                id: 'attTestWAP'},
            {text: 'Test TL',                 id: 'attTestTL'},
            {text: 'Test DC',                 id: 'attTestDC'},
            {text: 'Test MIM',                id: 'attTestMIM'},
            {text: 'Test Mobo',               id: 'attTestMobo'},
            {text: 'Test Payment',            id: 'attTestPayment'},
            {text: '    Test Transactions',   id: 'attTestTransactions'},
            {text: '    Test Subscriptions',  id: 'attTestSubscriptions'},
            {text: 'Test Speech',             id: 'attTestSpeech'},
            {text: 'Test Basic',              id: 'attTestBasic'},
         // {text: 'Test Pairwise',           id: 'attTestPairwise'},
            {text: 'Test Positive',           id: 'attTestPositive'},
            {text: 'Test Negative',           id: 'attTestNegative'},
         // {text: 'Test Mixed',              id: 'attTestMixed'},
            {text: 'Test All',                id: 'attTST'},
        ]
    }
});
