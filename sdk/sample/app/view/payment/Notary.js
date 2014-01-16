/**
 *
 * User Interface for the Notary application.
 *
 */
Ext.define('SampleApp.view.payment.Notary', {
    extend: 'Ext.Container',
    xtype: 'att-payment-notary',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config'
    ],
    
    config: {
        title: 'Notary App',
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },
    
    //override
    initialize: function() {
        this.add([
            {xtype: 'att-header'},
            this.buildSignPayloadForm(),
            {xtype: 'att-footer'}
        ]);
    },
    
    /**
     * Builds the UI components for Feature 1: Sign Payload.
     */
    buildSignPayloadForm: function() {
       return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Sign Payload',
                    defaults : {
                        labelAlign : 'top',
                        labelWidth : '100%'
                    },
                    items : [
                        {
                            xtype    : 'textareafield',
                            label    : 'Request',
                            name     : 'request'
                        },
                        {
                            xtype    : 'textareafield',
                            label    : 'Signed Payload',
                            name     : 'signedPayload',
                            readOnly : true
                        },
                        {
                            xtype    : 'textfield',
                            label    : 'Signature',
                            name     : 'signature',
                            readOnly : true
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'signpayload',
                    text    : 'Sign Payload'
                    
                }
            ]
        };
    }

});