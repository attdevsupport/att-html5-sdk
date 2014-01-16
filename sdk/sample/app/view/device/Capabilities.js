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
        'SampleApp.view.Header',
        'SampleApp.view.Footer'
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
            {xtype: 'att-header'},
            me.buildForm(),
            {xtype: 'att-footer'}
        ]);
            
    },
    
    /**
     * Builds the UI components for Feature 1: Get Device Capabilities.
     */
    buildForm: function() {
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
                             xtype   : 'button',
                             ui      : 'action',
                             action  : 'showcapabilities',
                             text    : 'Get Device Capabilities'
                         }
                    ]
                }
            ]
        };
    }

});