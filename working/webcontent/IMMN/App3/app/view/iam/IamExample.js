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
        title: 'IAM Example',
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
                xtype: 'att-header',
                scrollable: 'vertical',
                height: 60
            }, {
                id: 'waitMessage',
                xtype: 'loadmask',
                fontSize: '14px',
                message: 'Authorizing'
            }, {
                xtype: 'formpanel',
                id: 'messageEditor',
                floating: true,
                hidden: true,
                scrollable: false,
                centered: true,
                modal: true,
                width: '90%',
                height: 270,
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
                maxWidth: 700,
                height: 900,
                xtype: 'formpanel',
                scrollable: 'false',
                id: 'formPanel',
                title: "Messages",
                hidden: true,
                width: '100%',
                items: [{
                    xtype: 'container',
                    layout: 'vbox',
                    pack: 'justify',
                    //height: 20,
                    width: '100%',
                    margin: '10px 0 20px 0',
                    items: [{
                        xtype: 'button',
                        id: 'btnDeleteSelected',
                        margin: '2px 10px 2px 10px',
                        text: 'Delete Selected',
                        disabled: true,
                        height: 20,
                        action: 'deleteMultiple',
                    }, {
                        xtype: 'selectfield',
                        label: 'Download Count',
                        labelWidth: 120,
                        margin: '2px 10px 2px 10px',
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
                        xtype: 'button',
                        height: 20,
                        id: 'btnRefresh',
                        text: 'Refresh',
                        action: 'refresh',
                        margin: '2px 10px 2px 10px',
                        padding: '0 10px',
                    }, {
                        xtype: 'container',
                        cls: 'labeledBox',
                        width: '200px',
                        margin: '2px 10px 2px 10px',
                        height: 32,
                        html: '<span class="label">Total Messages</span><span class="box" id="msgCount"></span>'
                    }, {
                        xtype: 'container',
                        cls: 'labeledBox',
                        width: '200px',
                        margin: '2px 10px 2px 10px',
                        height: 32,
                        html: '<span class="label">Index State</span><span class="box" id="indexState"></span>'
                    }]
                }, {
                    xtype: 'dataview',
                    id:'messagesView',
                    cssCls: 'messageBox',
                    store: 'Messages',
                    scrollable: 'vertical',
                    height: 840,
                    width: '100%',
                    itemTpl: [
                        '<div  id="msg_{messageId}" class="iam_message<tpl if="selected == true"> sel</tpl><tpl if="isUpdated == true"> updated</tpl>">',
                        '   <div class="iam_head">',
                        '       <div class="iam_buttons">',
                        '           <button id="del_{messageId}" onclick="iamController.buttonClick(this)">Delete</button>',
                        '           <button id="reply_{messageId}" onclick="iamController.buttonClick(this)">Reply</button>',
                        '       </div>',
                        '       <div class="iamState">',
                        '           <span onclick="iamController.onSelect(\'sel_{messageId}\')"><input id="sel_{messageId}" type="checkbox" <tpl if="selected == true">checked</tpl>/><label for="sel_{messageId}">Select</label></span>',
                        '           <span class="iam_state_{isUnread}" onclick="iamController.markMessageRead({isUnread},\'{messageId}\')">',
                        '               <tpl if="isUnread == true">Unread</tpl>',
                        '               <tpl if="isUnread == false" >Read</tpl>',
                        '           </span>',
                        '           <span class="iam_state_{isIncoming}">',
                        '               <tpl if="isIncoming == true">Incoming</tpl>',
                        '               <tpl if="isIncoming == false">Outgoing</tpl>',
                        '           </span>',
                        '       </div>',
                        '   </div>',
                        '   <div class="iam_flex">',
                        '       <div class="iam_prop iam_short">',
                        '           <span>Type</span><p>{type}</p>',
                        '       </div>',
                        '       <div class="iam_prop">',
                        '           <span>Sent</span><p>{timeStamp:date("g:i A M d, Y ")}</p>',
                        '       </div>',
                        '       <div class="iam_prop iam_short">',
                        '               <span>Id</span><p>{messageId}</p>',
                        '           </div>',
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


