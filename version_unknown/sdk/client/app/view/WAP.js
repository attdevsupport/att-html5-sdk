/**
 * The WAP push view exercises the WAP Push API.
 * This view allows the user to enter a wireless number for a mobile device associated with their account. 
 * Only devices attached to their account can be entered. Any other number will generate an error.
 * 
 */
Ext.define('KitchenSink.view.WAP', {
    extend: 'Ext.Container',
    xtype: 'wap',

    config: {
        mmsId: null,
        title: 'WAP',
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
                    {name: 'wapOne', xtype: 'textfield', label: 'Wireless #1'},
                    {name: 'wapTwo', xtype: 'textfield', label: 'Wireless #2'}
                ]
            }, {
                xtype: 'button',
                text: 'New WAP Push',
                action: 'wappush',
                style: 'margin-bottom: 10px;'
            }, {
                xtype: 'button',
                text: 'Multi WAP Push',
                action: 'multiwappush',
                style: 'margin-bottom: 10px;'
            }]
        },
        control: {
            'button[action=wappush]': {
                tap: 'onWapPush'
            },
            'button[action=multiwappush]': {
                tap: 'onMultiWapPush'
            }
        }
    },

    /**
     * Fires the apicall event with the address as parameter to cal wapPush api method.
     * For simplicity this method has a hardcoded XML string for the Send message;
     * @param address {String} phone number
     */
    doWapPush: function(address) {
        var message = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';

        this.fireEvent('apicall', this, {
            method   : 'wapPush',
            address  : address,
            message  : message
        });
    },

    
    /**
     * Pulls the wireless number from the wapOne text field and calls doWapPush function
     */
    onWapPush: function() {
        var wapOne = this.down('textfield[name=wapOne]');
        this.doWapPush(wapOne.getValue());
    },
    
    /**
     * Pulls the wireless number from the wapOne and wapTwo text fields and calls doWapPush function with both numbers joined with a comma.
     */
    onMultiWapPush: function() {
        var wapOne = this.down('textfield[name=wapOne]'),
            wapTwo = this.down('textfield[name=wapTwo]');
        this.doWapPush(wapOne.getValue() + ',' + wapTwo.getValue());
    }
});
