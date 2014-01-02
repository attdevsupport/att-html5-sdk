/**
 *
 * User Interface for the MIM Basic application.
 *
 */
Ext.define('SampleApp.view.mim.Basic', {
    extend: 'Ext.Container',
    xtype: 'att-mim-basic',
    
    
    requires: [
       'Ext.form.Panel',
       'Ext.form.FieldSet',
       'SampleApp.view.Footer',
       'SampleApp.Config'
    ],
           
    config: {
        title: 'Basic MIM',
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },

    initialize: function() {
        this.add([
            this.buildForm(),
            this.buildViewMessageForm(),
            this.buildDisplayContent(),
            {xtype: 'att-footer'}
        ]);
    },
    
    /**
     * Builds the form for Feature 1: Send Message
     */
    buildForm: function(){
        var cfg = SampleApp.Config,
            me = this;

        return {
            xtype : 'formpanel',
            items : [
                {
                    xtype : 'fieldset',
                    title : 'Feature 1: Get Message Header',
                    instructions : 'Enter number of messages you wish to retrieve.',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items : [
                        {
                            xtype    : 'textfield',
                            label    : 'Header Count',
                            name     : 'headerCount',
                            value    : cfg.headerCount
                        },
                        {
                            xtype    : 'textfield',
                            label    : 'Index Cursor',
                            readOnly : true,
                            name     : 'indexCursor'
                        }  
                    ]
                }, {
                    xtype        : 'list',
                    singleSelect : true,
                    scrollable  : false,    
                    itemTpl      : me.buildTpl(),
                    store        : 'MessageHeaders'
                },{
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'getmessages',
                    text    : 'Get Message Headers'
                }
            ]
        };
    },

    /**
     * Builds the UI components for Viewing Message Content
     */
    buildViewMessageForm: function() {
        var me = this;

        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 2: Get Message Content',
                    instructions : 'Select a Message to display.',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items : [{
                        xtype: 'textfield',
                        label: 'Message ID',
                        name: 'messageId'
                    }, {
                        xtype: 'textfield',
                        label: 'Part Number',
                        name: 'partNumber'
                    }]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    disabled : true,
                    action  : 'getMessageContent',
                    text    : 'Get Message Content'
                }
            ]
        };
    },

    /**
     * Build the container to display content urls ...
     *
     */
    buildDisplayContent: function() {

        return {
            xtype   : 'container',
            name    : 'contentUrl',
            hidden  : true,
            tpl     : '<tpl if="url"><a target="_new" href="{url}">{name}</a></tpl>'
        };        
    },

    /**
     * Builds the Ext.XTemplate.
     */
    buildTpl: function() {
        return new Ext.XTemplate(
            '<div>MessageId:{MessageId} - PartNumber: {Parts}</div>',
            '</div>From: {From} - To: {To}</div>',
            '<div>Subject: {Subject}</div>'
            
        );
    }
});    