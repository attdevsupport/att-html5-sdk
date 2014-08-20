/**
 *
 * User Interface for the IAM Message application.
 *
 */

Ext.define('SampleApp.view.iam.iamExample', {
    extend: 'Ext.Container',
    xtype: 'att-iam-iamExample',
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config'
    ],
    config: {
        title: 'In App Messaging Example',
        scrollable: false,
        height: '100%',
        width: '100%',
        defaults: {
            maxWidth: 700,
            margin: '10px %1 0 1%'
        }
    },
    initialize: function () {
        var me = this;
        this.add([
            {
                height: 900,
                xtype: 'formpanel',
                scrollable: 'false',
                id: 'formStart',
                title: "Authorization Options",
                hidden: false,
                width: '100%',
                items: [{
                    xtype: 'container',
                    layout: 'vbox',
                    width: '100%',
                    height: '100%',
                    margin: '10px',
                    defaults: {
                        padding: '0 10px',
                        margin: 0,
                    },
                    items: [{
                        xtype: 'button',
                        id: 'buttonAuthorize',
                        width: '80%',
                        text: 'Start',
                        action: 'startAuthorization',
                    }, {
                        xtype: 'checkboxfield',
                        id: 'checkBypassOnNetworkAuth',
                        label: 'Bypass On-Net Auth',
                        labelWidth: '80%',
                        value: 'bypass_onnetwork_auth',
                        checked: true,
                    }, {
                        xtype: 'checkboxfield',
                        id: 'checkSuppressLandingPage',
                        label: 'Suppress Landing Page',
                        labelWidth: '80%',
                        value: 'suppress_landing_page',
                        checked: false
                    }]
                }]
		    }, {
				id: 'waitMessage',
				xtype: 'loadmask',
				fontSize: '14px',
				message: 'Authorizing',
				hidden: true
            }, {
                xtype: 'formpanel',
                id: 'messageEditor',
                floating: true,
                hidden: true,
                scrollable: false,
                centered: true,
                modal: true,
                width: '90%',
                height: 260,
                padding: 0,
                items: [{
                    xtype: 'toolbar',
                    title: {
                        title: 'Message Editor',
                        left: true
                    },
                    items: [{
                        xtype: 'spacer'
                    }, {
                        text: 'Send',
                        xtype: 'button',
                        id: 'btnSend',
                        action: 'send'
                    }, {
                        text: 'Cancel',
                        xtype: 'button',
                        id: 'btnCancel',
                        action: 'cancel'
                    }]
                }, {
                    xtype: 'textfield',
                    label: 'To',
                    id: 'messageTo',
                    labelWidth: 110,
                    style: 'border-bottom: 1px solid #BBBBCC'
                }, {
                    xtype: 'textfield',
                    label: 'Subject',
                    id: 'messageSubject',
                    labelWidth: 110,
                    style: 'border-bottom: 1px solid #BBBBCC'
                }, {
                    xtype: 'textareafield',
                    label: 'Message',
                    id: 'messageContent',
                    labelWidth: 110,
                    style: 'border-bottom: 1px solid #BBBBCC'
                }]
            }, {
                height: 900,
                xtype: 'formpanel',
                scrollable: 'false',
                id: 'formPanel',
                title: "Messages",
                hidden: true,
                width: '100%',
                items: [{
                    xtype: 'container',
                    layout: 'hbox',
                    width: '100%',
                    margin: '10px',
                    defaults: { 
                        padding: '0 10px',
                        margin: 0,
                    },
                    items: [{
                        xtype: 'button',
                        id: 'btnRefresh',
                        text: 'Refresh',
                        action: 'refresh',
                    }, {
                        xtype: 'button',
                        id: 'btnCompose',
                        text: 'Compose',
                        action: 'onCompose',
                        margin: '0 10px',
                    }, {
                        xtype: 'button',
                        id: 'btnDeleteSelected',
                        text: 'Delete Selected',
                        disabled: true,
                        action: 'deleteMultiple',
                    }]
                }, {
                    xtype: 'container',
                    layout: 'vbox',
                    width: '100%',
                    margin: '10px',
                    padding: '0px',
                    defaults: { 
                        margin: '3px 0 0 0',
                        padding: '0 0 0 0',
                    },
                    items: [{
                        xtype: 'selectfield',
                        label: 'Download Count',
                        name: 'dataCount',
                        value: 20,
                        cls: 'smallerSelect',
                        labelCls: 'smallerLabel',
                        options: [
                            { text: '5', value: 5 },
                            { text: '10', value: 10 },
                            { text: '20', value: 20 },
                            { text: '50', value: 50 },
                            { text: '80', value: 80 },
                            { text: '125', value: 125 },
                            { text: '200', value: 200 },
                        ]
                    }, {
                        xtype: 'container',
                        cls: 'labeledBox',
                        html: '<span class="label">Total Messages</span><span class="box" id="msgCount"></span>'
                    }, {
                        xtype: 'container',
                        cls: 'labeledBox',
                        hidden: true,
                        html: '<span class="label">Index State</span><span class="box" id="indexState"></span>'
                    }]
                }, {
                    xtype: 'dataview',
                    id: 'messagesView',
                    cssCls: 'messageBox',
                    store: 'Messages',
                    scrollable: 'vertical',
                    height: 530,
                    width: '100%',
                    itemTpl: [
                        '<div  id="msg_{messageId}" class="iam_message<tpl if="selected == true"> sel</tpl><tpl if="isUpdated == true"> updated</tpl><tpl if="isIncoming == true"> incoming_message</tpl><tpl if="isIncoming == false"> outgoing_message</tpl>">',
                        '   <div class="iam_head">',
                        '       <div class="iam_buttons">',
                        '           <button id="del_{messageId}" onclick="iamController.buttonClick(this)">Delete</button>',
                        '           <button id="reply_{messageId}" onclick="iamController.buttonClick(this)">Reply</button>',
                        '       </div>',
                        '       <div class="iamState">',
                        '           <span onclick="iamController.onSelect(\'sel_{messageId}\')"><input id="sel_{messageId}" type="checkbox" <tpl if="selected == true">checked</tpl>/><label for="sel_{messageId}">Select</label></span>',
                        '           <span class="iam_unread_state_{isUnread}" onclick="iamController.markMessageRead({isUnread},\'{messageId}\')">',
                        '               <tpl if="isUnread == true">Unread</tpl>',
                        '               <tpl if="isUnread == false" >Read</tpl>',
                        '           </span>',
                        '       </div>',
                        '   </div>',
                        '   <div class="iam_flex">',
                        '       <div class="iam_prop">',
                        '           <span>Sent</span><p>{[iamController.formatDate(values.timeStamp)]}</p>',
                        '       </div>',
                        '        <div class="iam_prop iam_long">',
                        '           <span>From</span><p>',
                        '           <tpl for="from">',
                        '                   <span>{value};</span>',
                        '               </tpl>',
                        '           </p>',
                        '       </div>',
                        '       <div class="iam_prop iam_long">',
                        '           <span>To</span><p>',
                        '               <tpl for="recipients">',
                        '                   <span>{value};</span>',
                        '               </tpl>',
                        '           </p>',
                        '       </div>',
                        '       <tpl if="type != \'TEXT\'>',
                        '           <tpl if="typeMetaData.subject">',
                        '               <div class="iam_prop iam_long">',
                        '                   <span>Subject</span><p>{typeMetaData.subject}</p>',
                        '               </div>',
                        '           </tpl>',
                        '       </tpl>',
                        '   </div>',
                        '   <tpl if="type == \'TEXT\' || type == \'XML\'">',
                        '       <div class="iam_content">{text}</div>',
                        '   <tpl else>',
                        '       <tpl for="mmsContent">',
                        '           <tpl if="hasContent">',
                        '               <tpl if="isTextType">',
                        '                   <div class="iam_content">{content}</div>',
                        '               <tpl else>',
                        '                   <div class="iam_image"><div><img src="{content}" /></div><p>{contentName}</p></div>',
                        '               </tpl>',
                        '           <tpl else>',
                        '               <tpl if="isTextType">',
                        '                   <div class="iam_content loading" onclick="iamController.loadContent(this, \'{parent.messageId}\', \'{partNum}\',\'{contentName}\')">Click to load content ... </div>',
                        '               <tpl else>',
                        '                   <div class="iam_image"><div onclick="iamController.loadContent(this, \'{parent.messageId}\', \'{partNum}\',\'{contentName}\')"><span>Click to load content</span></div><p>{contentName}</p></div>',
                        '               </tpl>',
                        '           </tpl>',
                        '       </tpl>',
                        '   </tpl>',
                        '</div>'
                    ]
                }]
            }, {
                xtype: 'att-footer',
                scrollable: 'vertical',
                height: 150
            }
        ]);
    }
});


