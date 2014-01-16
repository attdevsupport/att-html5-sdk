Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath({
    'Att': 'attlib',
    'ux' : 'ux' 
});


Ext.application({
    name: 'SampleApp',

    profiles: ['Phone'],

    controllers: [
        'Main', 
        'ads.Basic',
        'cms.Basic',
        'sms.Basic',
        'sms.Voting',
        'device.Location',
        'device.Capabilities',
        'mim.Basic',
        'wap.Basic',
        'mms.Basic',
        'mms.Coupon',
        'payment.SinglePay',
        'payment.Notary',
        'payment.Subscription',
        'mobo.Basic',
        'speech.Basic'
    ],

    views: [
        'Main',
        'ads.Basic',
        'cms.Basic',
        'sms.Basic',
        'sms.Voting',
        'device.Location',
        'device.Capabilities',
        'mim.Basic',
        'wap.Basic',
        'mms.Basic',
        'mms.Coupon',
        'mms.Gallery',
        'payment.SinglePay',
        'payment.Notary',
        'payment.Subscription',
        'mobo.Basic',
        'speech.Basic'
   ],

    models: [
        'App',
        'Vote',
        'DeliveryInfo',
        'Image',
        'MessageHeader',
        'SinglePayTransaction',
        'SubscriptionTransaction',
        'SpeechFile'
    ],
    
    stores: [
         'Apps',
         'Votes',
         'DeliveryInfos',
         'Images',
         'MessageHeaders',
         'SinglePayTransactions',
         'SubscriptionTransactions',
         'SpeechFiles'
     ]
});


