/**
 * Controller that interacts with the IAM Message application.
 */
Ext.define('SampleApp.controller.iam.iamExample', {
    extend: 'Ext.app.Controller',

    requires: [
       'Att.ApiResults',
       'SampleApp.Config',
       'Ext.MessageBox'
    ],

    config: {
        provider: undefined,
        models: ['Message', 'MessageContent'],
        stores: ['Messages'],
        refs: {
            formDataCount: 'selectfield[name=dataCount]',
            btnRefresh: 'att-iam-iamExample #btnDeleteSelected',
            btnDeleteSelected: 'att-iam-iamExample #btnDeleteSelected',
            messagesView: 'att-iam-iamExample #messagesView',
            formPanel: 'att-iam-iamExample #formPanel',
            waitMessage: 'att-iam-iamExample #waitMessage',
            attachmentsView: 'att-iam-iamExample #attachmentsView',
            messageStore: 'SampleApp.model.Messages',
            messageEditor: 'att-iam-iamExample #messageEditor',
            btnAttach: 'att-iam-iamExample #btnAttach',
            btnSend: 'att-iam-iamExample #btnSend',
            btnCancel: 'att-iam-iamExample #btnCancel',
            messageTo:'att-iam-iamExample #messageTo',
            messageSubject:'att-iam-iamExample #messageSubject',
            messageContent: 'att-iam-iamExample #messageContent'
        },

        control: {
            'att-iam-iamExample button[action=refresh]': {
                tap: 'refreshMail'
            },
            'att-iam-iamExample button[action=deleteMultiple]': {
                tap: 'deleteMultiple'
            },
            'selectfield[name=dataCount]': {
                change: 'setDataCount'
            },
            'att-iam-iamExample button[action=attach]': {
                tap: 'attach'
            },
            'att-iam-iamExample button[action=send]': {
                tap: 'send'
            },
            'att-iam-iamExample button[action=cancel]': {
                tap: 'cancel'
            },
            'att-iam-iamExample button[action=onCompose]': {
                tap: 'onCompose'
            }
        },
    },
    attach: function() {
        alert("attach handler");
    },
    send: function () {
        this.setWaitMessage("Sending", false);
        this.messageEditor.hide();
        AttApiClient.sendMessage(
            {
                addresses: this.messageTo.getValue().split(";"),
                message: this.messageContent.getValue(),
            },
            function () { onComplete(true) },
            function () { onComplete(false) }
        );
        function onComplete(success) {
            iamController.setWaitMessage(success ? "Success" : "Failed", true);
            if(success){
                iamController.refreshMail();
            }
        }
    },
    cancel: function () {
        this.messageEditor.hide();
    },
    dataCount: 20,
    setDataCount: function() {
        this.dataCount = this.getFormDataCount().getValue();
        this.getMessages();
    },
    setWaitMessage: function (msg, hideAfterDisplay) {
        this.waitMessage.setMessage(msg);
        this.waitMessage.show();

        if (hideAfterDisplay) {
            setTimeout(function () { iamController.hideWaitMessage(); }, 1200);
        }
    },
    hideWaitMessage: function () {
        this.waitMessage.hide();
        iamController.countSelectedMessages();
    },
    getContextFromEl: function (el) {

        var context = {
            messageId: el.id.split("_").slice(1).join("_"),
        };
        context.record = this.store.findRecord("messageId",context.messageId);
        context.messageId = context.record.get("messageId");
        return context;
    },
    onSelect: function (id) {
        var el = document.getElementById(id);
        var context = this.getContextFromEl(el);
        

        //timeout so event propagates to get correct checked value;
        setTimeout(function () {
            var selected = el.checked;
            context.record.set('selected', selected);
            iamController.countSelectedMessages();
        }, 30);
    },
    refreshMail: function () {
        
        iamController.setWaitMessage("Refreshing Email");
        AttApiClient.getMessageDelta(iamController.messageIndexInfo.state, success, fail);
        
        function success (r) {
            if (iamController.messageIndexInfo.state != r.deltaResponse.state) {
                var delta = r.deltaResponse.delta;

                var actions = {
                    deletes: [],
                    newData: [],
                }
                var adds = 0; updates = 0;
                
                delta.forEach(function (deltaInfo) {
                    deltaInfo.adds.forEach(
                        function (add) {
                            adds++;
                            actions.newData.push(add.messageId);
                        }
                    );
                    deltaInfo.updates.forEach(
                        function(update) {
                            updates++;
                            actions.newData.push(update.messageId);
                        }   
                    );
                    deltaInfo.deletes.forEach(
                        function (del) {
                            var record = iamController.store.findRecord("messageId", del.messageId);
                            if (record != null) actions.deletes.push(record);
                        }
                    );
                });


                if (actions.newData.length > 0) {
                    
                    AttApiClient.getMessageList(
                        {
                            messageIds: actions.newData.join(","),
                            count: actions.newData.length
                        },
                        function (result) {
                            result.messageList.messages.forEach(function (record) {
                                record.isUpdated = true;
                            });
                            iamController.store.add(result.messageList.messages);
                            iamController.store.sort("timeStamp", 'DESC');
                            doDelete();
                        },
                        function (result) {
                            iamController.setWaitMessage("Error retrieving records " + actions.newData.join(", "));
                            doUpdate();
                        }
                    );
                } else { doDelete(); }

                function doDelete() {
                    if (actions.deletes.length > 0) {
                        iamController.store.remove(actions.deletes)
                    };
                    done();
                }

                function done () {

                    var msg = "";
                    if (updates > 0) {
                        msg += "<p>Updated " + updates + " message" + (updates > 0 ? 's' : '') + "</p>";
                    }
                    if (adds > 0) {
                        msg += "<p>Added " + adds + " new message" + (adds > 0 ? 's' : '') + "</p>";
                    }
                    if (actions.deletes.length > 0) {
                        msg += "<p>Deleted " + actions.deletes.length + " message" + (actions.deletes.length > 1 ? 's' : '') + "</p>";
                    }
                    iamController.setWaitMessage(msg, true);
                    iamController.getIndexInfo();
                }
                return;
            }
            iamController.setWaitMessage("No changes", true);
        }

        function fail(e) {
            iamController.hideWaitMessage();
            Ext.Msg.alert("Error", "Unexpected failure refreshing mail");
        }
    },
    buttonClick: function (el) {

        var context = this.getContextFromEl(el);
        switch (el.innerHTML) {
            case "Delete":
                iamController.setWaitMessage("Deleting Message");
                AttApiClient.deleteMessage(context.messageId,
                    function () {
                        iamController.store.remove(context.record);
                        iamController.getIndexInfo();
                        iamController.hideWaitMessage();
                    },
                    function (r) {
                        iamController.setWaitMessage("Failed to delete message", true);
                    }
                );
                break;
            case "Reply":
                this.messageEditorHandler(context);
                break;
        }
    },
    messageEditorHandler: function (context) {
        if(context!=null){
            this.messageTo.setValue(context.record.get("from").value);
            this.messageSubject.setValue(AttApiClient.util.padIfNotNullOrEmpty("RE:", context.record.get("subject")));
            this.messageContent.setValue("");
        }
        this.messageEditor.show();
    },
    currentScroll: null,
    objectUrls: [],
    loadContent: function (el, messageId, partNum, name) {
        
        el.innerHTML = '<span>Loading Content ...</span> <img src="../../images/ajax-loader.gif" />';

        
        var record = this.store.findRecord("messageId", messageId);
        var messageId = record.get("messageId");

        AttApiClient.getMessageContent(
            { 
                messageId: messageId, 
                partNum : partNum 
            },
            function (r) {
                var mmsContent = record.get("mmsContent");
                var part = mmsContent[partNum];
                if (part.isTextType) {
                    AttApiClient.util.blobToText(r, success)
                } else {
                    iamController.objectUrls.push(r);
                    success(URL.createObjectURL(r));
                }
                
                function success(result) {
                    part.content = result;
                    part.hasContent = true;
                    mmsContent[partNum] = part;
                    iamController.currentScroll = iamController.messagesView.getScrollable().getScroller().position.y
                    record.set("mmsContent", mmsContent);
                }
            },
            function (r) {
                Ext.Msg.alert("Error", "Could not retrieve contents");
            }
        );
    },
    countSelectedMessages: function () {

        var selectedIds = [];
        this.store.each(function (record, messageId) {
            if (record.get('selected')) {
                selectedIds.push(record.get("messageId"))
            };
        });

        this.selectedIds = selectedIds;
        this.btnDeleteSelected.setDisabled(this.selectedIds.length == 0);
    },
    deleteMultiple: function () {
        this.deleteMessages(this.selectedIds);
    },
    deleteMessages: function (ids) {
        
        this.setWaitMessage("Deleting Messages");
        AttApiClient.deleteMessages(ids,
            function () {
                var records = [];
                ids.forEach(function (messageId) {
                    records.push(iamController.store.findRecord("messageId", messageId))
                });
                iamController.store.remove(records);
                iamController.hideWaitMessage();
                iamController.getIndexInfo();
            },
            function (r) {
                Ext.Msg.alert("Error", "Failed to delete messages");
            }
        );
    },
    markMessageRead: function (isUnread, messageId) {
        
        AttApiClient.updateMessage(
            {
                isUnread: !isUnread,
                id: messageId
            },
            function () {
                var record = iamController.store.findRecord("messageId", messageId);
                record.set("isUnread", !isUnread);
            },
            function (e) {
                Ext.Msg.alert("Error", "Unexpected Error: " + e);
            }
        );
    },
    getMessages: function () {
        
        
        iamController.objectUrls.forEach(URL.revokeObjectURL);
        iamController.objectUrls = [];
        
        iamController.setWaitMessage("Downloading Messages");
        AttApiClient.getMessageList({ count: iamController.dataCount }, function (result) {

            iamController.hideWaitMessage();
            iamController.store.setData(result.messageList.messages);
            iamController.formPanel.show();

        }, function (result) {
            Ext.Msg.alert("Error", JSON.parse(result.responseJSON.error).RequestError.PolicyException.Text);
        });
        
    },
    launch: function () {

        AttApiClient.authorizeUser({ scope: "MIM,IMMN" }, launchExec, function errorHandler() {
            Ext.Msg.alert("Error", "Was not able to authorize user");
            return;
        });

        //define global variable for controller
        iamController = this;

        function launchExec() {

            iamController.waitMessage = iamController.getWaitMessage();
            iamController.messagesView = iamController.getMessagesView();
            iamController.messagesView.addListener(
                'refresh',
                function () {
                    if (iamController.currentScroll != null) {
                        try {
                            iamController.messagesView.getScrollable().getScroller().setOffset({ x: 0, y: iamController.currentScroll });
                        } catch (e) { }
                        iamController.currentScroll = null;
                    }
                }
            );

            iamController.store = iamController.messagesView.getStore();
            iamController.waitMessageText = document.getElementById("waitMessageText");
            iamController.btnDeleteSelected = iamController.getBtnDeleteSelected();
            iamController.formPanel = iamController.getFormPanel();

            iamController.getMessages();
            iamController.getIndexInfo();

            iamController.messageTo = iamController.getMessageTo();
            iamController.messageSubject = iamController.getMessageSubject();
            iamController.messageContent = iamController.getMessageContent();
            iamController.messageEditor = iamController.getMessageEditor();
            
        }
    },
    getIndexInfo: function () {
        
        iamController.countSelectedMessages();

        AttApiClient.getMessageIndexInfo(
            function (r) {
                iamController.messageIndexInfo = r.messageIndexInfo;
                var msgCount = document.getElementById("msgCount");
                if (msgCount) {
                    msgCount.innerText = r.messageIndexInfo.messageCount;
                }
                var indexState = document.getElementById("indexState");
                if (indexState) {
                    indexState.innerText = r.messageIndexInfo.state;
                }
            },
            function (e) {
                Ext.Msg.alert("Error", "Could not create message index");
            }
        );
    },
    onCompose: function () {
        this.messageEditorHandler(null);
    }

});
