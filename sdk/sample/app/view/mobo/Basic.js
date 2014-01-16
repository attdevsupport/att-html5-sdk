/**
 *
 * User Interface for the MOBO Basic application.
 *
 */
Ext.define('SampleApp.view.mobo.Basic', {
    extend: 'Ext.Container',
    xtype: 'att-mobo-basic',
    
    
    requires: [
       'Ext.form.Panel',
       'Ext.form.FieldSet',
       'SampleApp.view.Header',
       'SampleApp.view.Footer',
       'SampleApp.Config'
    ],
           
    config: {
        title: 'Basic MOBO',
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },

    initialize: function() {
        this.add([
            {xtype: 'att-header'},
            this.buildForm(),
            {xtype: 'att-footer'}
        ]);
    },
    
    /**
     * Builds the form for Feature 1: Send Message
     */
    buildForm: function(){
        var cfg = SampleApp.Config;
        return {
            xtype : 'formpanel',
            items : [
                {
                    xtype : 'fieldset',
                    title : 'Feature 1: Send Message',
                    instructions : 'Use "attach file" to emulate attachment since you cannot upload a file on phone browsers.',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items : [
                        {
                            xtype    : 'textfield',
                            label    : 'Address',
                            name     : 'address',
                            value    : cfg.defaultPhoneNbr
                        },
                        {
                            xtype    : 'textareafield',
                            label    : 'Message',
                            name     : 'message'
                        },
                        {
                            xtype    : 'textareafield',
                            label    : 'Subject',
                            name     : 'subject'
                        },{
                            xtype    : 'checkboxfield',
                            label    : 'Group',
                            name     : 'group'   
                        },{
                            xtype: 'selectfield',
                            label: 'Choose File',
                            name : 'attachment',
                            options: [
                                {text: 'No Attachment', value: undefined},
                                {text: 'sencha.jpg',    value: 'sencha.jpg'},
                                {text: 'hello.jpg',     value: 'hello.jpg'}
                            ]
                        }   
                    ]
                },{
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'sendmessage',
                    text    : 'Send Message'
                }      
            ]
        };
    }
});    