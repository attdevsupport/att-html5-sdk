/**
 *
 * User Interface for the MMS Basic sample application.
 *
 * Note: At this time, since iOS does not support file uploads, the file upload fields on the Basic MMS app have been hidden.
 *
 */
Ext.define('SampleApp.view.mms.Basic', {
    extend: 'Ext.Container',
    xtype: 'att-mms-basic',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config'
    ],
    
    config: {
        title: 'Basic MMS',
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },
    
    initialize: function() {
        this.add([
             {xtype: 'att-header'},
             this.buildSendMms(),
             this.buildMmsStatus(),
             {xtype: 'att-footer'}
        ]);
    },
    
    
    /**
     * Builds the UI components for Feature 1: Send MMS Message.
     *
     * Note: At this time, since iOS does not support file uploads, the file upload fields on the Basic MMS app have been hidden.
     *
     */
    buildSendMms: function() {
        var cfg = SampleApp.Config;
        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 1: Send MMS Message',
                    //instructions : 'WARNING: Total size of all attachments cannot exceed 600 KB.',
                    defaults : {
                        labelWidth : '45%'
                    },
                    // Note: the spec says to name all attachments as 'Attachment' in the code
                    // but if you do this using the 'name' property it breaks in ST 1.x due to ST thinking that all fields with the same name are checkboxes or radio boxes
                    // and if you do this using the 'itemId' property it breaks in ST 1.x since it only renders the last field
                    // therefore, this spec requirement was done using a custom property called forAttSpec
                    // and f1, f2, f3 were used for the 'name' property to match the AT&T samples done by Krists Auders
                    items : [
                        {
                            xtype      : 'textfield',
                            label      : 'Phone',
                            name       : 'address',
                            value      : cfg.defaultPhoneNbr,
                            required   : true
                        },
                        {
                            xtype      : 'textareafield',
                            label      : 'Message',
                            name       : 'subject',
                            value      : cfg.defaultMessage,
                            required   : true
                        },
                        {
                            xtype: 'selectfield',
                            label: 'Choose File',
                            name : 'attachment',
                            options: [
                                {text: 'Sencha.jpg',    value: 'sencha.jpg'},
                                {text: 'Hello.jpg',    value: 'hello.jpg'},
                            ]
                        }, 
                        {
                            xtype      : 'textfield',
                            label      : 'Attachment 1',
                            name       : 'f1',
                            forAttSpec : 'attachment',
                            inputType  : 'file',
                            hidden     : true
                        },
                        {
                            xtype      : 'textfield',
                            label      : 'Attachment 2',
                            name       : 'f2',
                            forAttSpec : 'attachment',
                            inputType  : 'file',
                            hidden     : true
                        },
                        {
                            xtype      : 'textfield',
                            label      : 'Attachment 3',
                            name       : 'f3',
                            forAttSpec : 'attachment',
                            hidden     : true
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'sendmessage', 
                    text    : 'Send Message'
                }
            ]
        };
    },


    /**
     * Builds the UI components for Feature 2: Get Delivery Status.
     */
    buildMmsStatus: function() {
        return {
            xtype   : 'formpanel',
            itemId  : 'feature2',
            items : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 2: Get Delivery Status',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items : [
                        {
                            xtype    : 'textfield',
                            label    : 'Message ID',
                            name     : 'mmsId',
                            required : true
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'messagestatus',
                    text    : 'Get Status'
                }
            ]
        };
    }

});