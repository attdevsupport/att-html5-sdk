/**
 * List view that displays each of the APIs.
 * When the user taps on an API the view for that API appears
 */
Ext.define('KitchenSink.view.NavigationList', {
    extend: 'Ext.List',
    xtype: 'navigationlist',

    requires: [
        'KitchenSink.view.DeviceInfo',
        'KitchenSink.view.DeviceLocation',
        'KitchenSink.view.SMS',
        'KitchenSink.view.MMS',
        'KitchenSink.view.WAP',
        'KitchenSink.view.Payment',
        'KitchenSink.view.MIM',
        'KitchenSink.view.MOBO',
        'KitchenSink.view.Speech'
    ],

    config: {
        title: 'AT&T APIs',
        data: [
//            {text: 'Device Info',     id: 'deviceinfo'}, BF2.1 doesnt support DC
            {text: 'Device Location', id: 'devicelocation'},
            {text: 'SMS',             id: 'sms'},
            {text: 'MMS',             id: 'mms'},
            {text: 'WAP',             id: 'wap'},
            {text: 'Payment',         id: 'payment'},
            {text: 'MIM',             id: 'mim'},
            {text: 'MOBO',            id: 'mobo'},
            {text: 'Speech To Text',  id: 'speech'}
        ]
    }
});