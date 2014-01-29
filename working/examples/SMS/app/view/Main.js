Ext.define("MyApp.view.Main", {
    extend: 'Ext.Container',
    xtype: 'sms-view',

    config: {
        fullscreen: true,
        scrollable: 'vertical',
        layout: 'vbox',

        items: [{
            xtype: 'titlebar',
            title: 'SMS Example',
            docked: 'top'
        }, {
            xtype: 'fieldset',
            defaults: {
                labelAlign: 'top',
                labelWidth: '100%'
            },
            items: [{
                xtype: 'textfield',
                label: 'To',
                name: 'to'
            }, {
                xtype: 'textareafield',
                label: 'Message',
                name: 'message'
            }]
        }, {
            /**
             * send message button
             */
            xtype: 'button',
            action: 'sendsms',
            text: 'Send SMS'
        }, {
            /*
             * get status button
             */
            xtype: 'button',
            action: 'smsstatus',
            text: 'SMS Status'
        }]        
    }    
});
