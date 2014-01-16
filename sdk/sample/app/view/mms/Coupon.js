/**
 *
 * User Interface for the MMS Coupon application.
 *
 */
 Ext.define('SampleApp.view.mms.Coupon', {
    extend: 'Ext.Container',
    xtype: 'att-mms-coupon',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.dataview.List',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config'
    ],
    
    config: {
        title: 'MMS Coupon',
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },
    
    //override
    initialize: function() {
        var me = this;
        this.add([
             {xtype: 'att-header'},
             me.buildSubscribersForm(),
             me.buildDeliveryStatusForm(),
             me.buildDeliveryStatusList(),
             {xtype: 'att-footer'}
        ]);
    },
    
    /**
     * Builds the UI components for Feature 1: Send coupon image to list of subscribers.
     */
    buildSubscribersForm: function() {
        var cfg = SampleApp.Config;

        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Send coupon image to subscribers',
                    instructions : "separate multiple phone #'s with a comma",
                    defaults : {
                        labelAlign : 'top',
                        labelWidth : '100%'
                    },
                    items : [
                        {
                            xtype    : 'textfield',
                            label    : 'Phone',
                            name     : 'address',
                            required : true
                        },
                        {
                            xtype    : 'textareafield',
                            label    : 'Subject',
                            name     : 'subject',
                            value    : '',
                            readOnly : true
                        }
                    ]
                },
                {
                    xtype : 'fieldset',
                    title : 'Attachment',
                    items : [
                        {
                            xtype   : 'container',
                            itemId  : 'attachment',
                            style   : {
                                height              : '140px',
                                backgroundColor     : '#fc9',
                                backgroundRepeat    : 'no-repeat',
                                backgroundPosition  : 'center center',
                                backgroundImage     : 'url(' +  cfg.couponImagesBaseUri + 'coupon.jpg' + ')'
                            }
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'sendmessage',
                    text    : 'Send Coupon'
                }
            ]
        };
    },    

    /**
     * Builds the UI components for Feature 2: Check Delivery Status for each Recipient.
     */
    buildDeliveryStatusForm: function() {
        return {
            xtype   : 'formpanel',
            items : [
                {
                    xtype    : 'fieldset',
                    title    : 'Check Delivery Status for each Recipient',
                    defaults : {
                        labelAlign : 'top',
                        labelWidth : '100%'
                    },
                    items : [
                        {
                            xtype    : 'textfield',
                            label    : 'Message ID',
                            name     : 'mmsId',
                            itemId   : 'mmsId',
                            required : true,
                            readOnly : true 
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'messagestatus',
                    text    : 'Check Status',
                    
                }
            ]
        };
    },


    /**
     * Builds the UI components for Feature 2: Check Delivery Status for each Recipient.
     */
    buildDeliveryStatusList: function() {
        return {
            xtype   : 'formpanel',
            items : [
                {
                    xtype : 'fieldset',
                    title : 'Delivery Status',
                    items : [
                        {
                            xtype   : 'list',
                            scrollable: false,
                            itemTpl :  '<div style="float: left">{Address}</div><div style="float: right">{DeliveryStatus}</div>',
                            store   : 'DeliveryInfos'
                        }
                    ]
                }
            ]
        };
    }

});