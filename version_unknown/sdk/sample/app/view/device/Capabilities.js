/**
 *
 * User Interface for the Device Capabilities (DC) application.
 *
 */
Ext.define('SampleApp.view.device.Capabilities', {
    extend: 'Ext.Container',
    xtype: 'att-device-dc',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet', 
        'SampleApp.view.Footer',
        'SampleApp.Config'
    ],
    
    config: {
        title: 'Device Capabilities',
        scrollable: 'vertical',
        defaults: {
            scrollable: false
        }
    },
    
    //override
    initialize: function() {
        var me = this;
        
        me.add([
            me.buildForm(),
            {xtype: 'att-footer'}
        ]);
            
    },
    
    /**
     * Builds the UI components for Feature 1: Get Device Capabilities.
     */
    buildForm: function() {
        var cfg = SampleApp.Config;
        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 1: Get Device Capabilities',
                    defaults : {
                        labelWidth : '35%'
                    },
                    items : [
                        {
                            xtype    : 'textfield',
                            label    : 'Phone',
                            name     : 'address',
                            value    : cfg.defaultPhoneNbr,
                            required : true
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'showcapabilities',
                    text    : 'Get Device Capabilities'
                }
            ]
        };
    }

});