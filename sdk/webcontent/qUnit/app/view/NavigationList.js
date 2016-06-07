/**
 * List view that displays each of the APIs.
 * When the user taps on an API the view for that API appears
 */
Ext.define('KitchenSink.view.NavigationList', {
    extend: 'Ext.List',
    xtype: 'navigationlist',

    requires: [
        'KitchenSink.view.ClientTest',
        'KitchenSink.view.testSMSonly',
        'KitchenSink.view.testMMSonly',
        'KitchenSink.view.testDConly',
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
            {text: 'Test SMS',                id: 'attTestSMS'},
            {text: 'Test MMS',                id: 'attTestMMS'},
            {text: 'Test DC',                 id: 'attTestDC'},
            {text: 'Test MIM',                id: 'attTestMIM'},
            {text: 'Test Mobo',               id: 'attTestMobo'},
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
