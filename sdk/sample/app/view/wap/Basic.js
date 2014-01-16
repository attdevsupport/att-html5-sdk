/**
 *
 * User Interface for the WAPPush application.
 * This Sample App uses {@link SampleApp.Config Config} values to fullfil wap url and message with default values.
 *
 */
Ext.define('SampleApp.view.wap.Basic', {
    extend: 'Ext.Container',
    xtype: 'att-wap-basic',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config'
    ],
    
    config: {
        title: 'Basic WAP',
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },
    
    //override
    initialize: function() {
        this.add([
             {xtype: 'att-header'},
             this.buildForm(),
             {xtype: 'att-footer'}
        ]);
    },
    
    
    /**
     * Builds the UI components for Feature 1: Send basic WAP message.
     */
    buildForm: function() {
        var cfg = SampleApp.Config;
        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 1: Send basic WAP message',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items : [
                        {
                            xtype    : 'textfield',
                            label    : 'Phone',
                            name     : 'address',
                            value    : cfg.defaultPhoneNbr,
                            required : true
                        },
                        {
                            xtype    : 'textfield',
                            label    : 'URL',
                            name     : 'url',
                            value    : cfg.defaultWapUrl,
                            required : true
                        },
                        {
                            xtype    : 'textareafield',
                            label    : 'Alert Text',
                            name     : 'alerttext',
                            value    : cfg.defaultWapMessage,
                            required : true
                        },
                        {
                            xtype    : 'fieldset',
                            title    : 'Service Type',
                            defaults : {
                                xtype : 'radiofield',
                                labelWidth : '80%',
                            },
                            instructions : 'WARNING: At this time, AT&T only supports Service Type: Service Indication due to security concerns.',
                            items   : [
                                {
                                    name     : 'serviceType',
                                    checked  : true,
                                    label    : 'Service Indication',
                                    readOnly : true, //not working 
                                    listeners: {
                                        check: function(cb) {
                                            // in simulators and actual devices, setting the field to
                                            // disabled and/or readonly still won't work so here, we just
                                            // make sure to always uncheck this field if the check
                                            // event gets fired'
                                            cb.uncheck();
                                        },
                                    
                                        afterrender: function(ele) {
                                            ele.fieldEl.dom.readOnly = true;
                                        }
                                    }
                                        
                                },
                                {
                                    name     : 'serviceTypeLoading',
                                    xtype    : 'checkboxfield',
                                    label    : 'Service Loading',
                                    readOnly : true, //not working 
                                    listeners: {
                                        check: function(cb) {
                                            // in simulators and actual devices, setting the field to
                                            // disabled and/or readonly still won't work so here, we just
                                            // make sure to always uncheck this field if the check
                                            // event gets fired'
                                            cb.uncheck();
                                        },
                                    
                                        afterrender: function(ele) {
                                            ele.fieldEl.dom.readOnly = true;
                                        }
                                    }
                                }
                            ]
                        },
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'sendwapmessage',
                    text    : 'Send WAP Message'
                }
            ]
        };
    }
    
});