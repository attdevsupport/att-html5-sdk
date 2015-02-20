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
            btnRefresh: 'att-iam-iamExample #btnRefresh',
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
            btnLogout: '#btnLogout',
            messageTo:'att-iam-iamExample #messageTo',
            messageSubject:'att-iam-iamExample #messageSubject',
            messageContent: 'att-iam-iamExample #messageContent',
            buttonAuthorize: 'att-iam-iamExample #buttonAuthorize'
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
            'button[action=logout]': {
                tap: 'logout'
            },
            'att-iam-iamExample button[action=onCompose]': {
                tap: 'onCompose'
            },
            'att-iam-iamExample button[action=startAuthorization]': {
                tap: 'startAuthorization'
            }
        }
    },
    attach: function() {
        alert("attach handler");
    },
    send: function () {
        this.setWaitMessage("Sending", false);
        this.messageEditor.hide();
        AttApiClient.InAppMessaging.sendMessage(
            {
                addresses: this.messageTo.getValue().split(";"),
                message: this.messageContent.getValue(),
                subject: this.messageSubject.getValue(),
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
    logout: function () {
        iamController.deleteSubscription();
    	AttApiClient.InAppMessaging.logout(
            function(response, opts)
            {
                try {
                    iamController.store.removeAll();
                    Ext.getCmp('formPanel').hide();
                    Ext.getCmp('formStart').show();
                }
                finally { alert("logout successful"); }
            },
            function(response, opts) { alert("logout failed"); }
        );
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
            messageId: el.id.split("_").slice(1).join("_")
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
    startNotifications: function () {
        iamController.setWaitMessage("Subscribing to Notifications");
        AttApiClient.Notification.createNotificationSubscription(
            {'subscription': { 'events': ["MMS", "TEXT"], 'expiresIn': 0}},
            function (response) { // success
                iamController.subscriptionId = response.subscription.subscriptionId;

                iamController.hideWaitMessage();
                Ext.Msg.alert("Info", "Notification subscription created.");
                // Set interval task to getNotifications
                setInterval(iamController.getNotifications, 60000); // Every min

                // Set repeat task to getMessageIndexInfo
                setInterval(iamController.getIndexInfo, 82800000); // Every 23 hours
            },
            function (err) { // fail
                iamController.hideWaitMessage();
                Ext.Msg.alert("Error", "Notification subscription failed. " +
                    JSON.stringify(err, 0, 3));
            }
        );
    },
    refreshMail: function () {

        iamController.setWaitMessage("Refreshing Messages");

        AttApiClient.InAppMessaging.getMessageDelta(iamController.messageIndexInfo.state, success, fail);

        function success (r) {
            Ext.getCmp('btnRefresh').setBadgeText('');
            AttApiClient.Notification.deleteNotifications({'subscriptionId': iamController.subscriptionId});

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

                    AttApiClient.InAppMessaging.getMessageList(
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
    getNotifications: function () {
    	// TODO: After debugging remove the next line and only report failures
        iamController.setWaitMessage("Check Notifications");
        
        AttApiClient.Notification.getNotifications({'subscriptionId': iamController.subscriptionId},
            success, fail);

        function success (r) {
            iamController.hideWaitMessage();
            if( r.notification != undefined &&
                r.notification.notificationEvents != undefined &&
                r.notification.notificationEvents.length > 0) {
                Ext.getCmp('btnRefresh').setBadgeText(r.notification.notificationEvents.length);
            }
        }

        function fail(e) {
            iamController.hideWaitMessage();
            Ext.Msg.alert("Error", "Unable to retrieve notifications");
        }
    },
    buttonClick: function (el) {

        var context = this.getContextFromEl(el);
        switch (el.innerHTML) {
            case "Delete":
                iamController.setWaitMessage("Deleting Message");
                AttApiClient.InAppMessaging.deleteMessage(context.messageId,
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

        AttApiClient.InAppMessaging.getMessageContent(
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
                    var url = "/images/class-m.png";
                    if (window.URL) {
                        url = URL.createObjectURL(r);
                        iamController.objectUrls.push(url);
                    }
                    success(url);
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
        AttApiClient.InAppMessaging.deleteMessages(ids,
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

        AttApiClient.InAppMessaging.updateMessage(
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

        if (window.URL) {
            iamController.objectUrls.forEach(URL.revokeObjectURL);
        }
        iamController.objectUrls = [];

        iamController.setWaitMessage("Downloading Messages");
        AttApiClient.InAppMessaging.getMessageList({ count: iamController.dataCount }, 

           function success(result) {
            iamController.hideWaitMessage();
            iamController.store.setData(result.messageList.messages);
            iamController.formPanel.show();
            if(iamController.subscriptionId === undefined) {
                iamController.startNotifications();
            }

        }, function failure(result) {
            iamController.hideWaitMessage();
            iamController.formPanel.show();

            //AttApiClient.InAppMessaging.createMessageIndex(function(){alert("success")}, function(){alert("fail")});
            
            var errorObj = JSON.parse(result.responseJSON.error);
            var ex = errorObj.RequestError.PolicyException;
            if (!ex) {
                ex = errorObj.RequestError.ServiceException;
            }
            var errorMessage = result.responseJSON.error; 
            if (ex) {
                errorMessage = ex.Text;
            }
            Ext.Msg.alert("Error", errorMessage);
        });

    },
    launchExec : function() {
        Ext.getCmp('formStart').hide();
        Ext.getCmp('formPanel').show();
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

    },
    launch: function() {
        //define global variable for controller
        iamController = this;
        iamController.subscriptionId = undefined;

        AttApiClient.OAuth.isUserAuthorized(
            "MIM,IMMN",
            function(isAuthorized) {
                if (isAuthorized) {
                    iamController.launchExec();
                } else {
                    // Don't do anything, just wait for the user to tap start
                }
            }
        );
    },
    startAuthorization: function ()
    {
        AttApiClient.OAuth.authorizeUser(
            {
               scope: "MIM,IMMN",
               bypass_onnetwork_auth: Ext.getCmp('checkBypassOnNetworkAuth').getChecked(),
               suppress_landing_page: Ext.getCmp('checkSuppressLandingPage').getChecked()
            },
            iamController.launchExec,
            function errorHandler() {
                Ext.Msg.alert("Error", "Was not able to authorize user");
                return;
            }
        );

    },
    getIndexInfo: function () {

        iamController.countSelectedMessages();

        AttApiClient.InAppMessaging.getMessageIndexInfo(
            function (r) {
                iamController.messageIndexInfo = r.messageIndexInfo;
                var msgCount = document.getElementById("msgCount");
                if (msgCount) {
                    msgCount.innerHTML = r.messageIndexInfo.messageCount;
                }
                var indexState = document.getElementById("indexState");
                if (indexState) {
                    indexState.innerHTML = r.messageIndexInfo.state;
                }
            },
            function (e) {
                Ext.Msg.alert("Error", "Could not create message index");
            }
        );
    },
    onCompose: function () {
        this.messageEditorHandler(null);
    },

    formatDate: function formatDate(timeStamp) {
        var date = new Date(timeStamp);
        var format = "M d";
        // if the timestamp is less than 24 hours old
        if (new Date().getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
            format = "M d g:i:sA";
        }
        return Ext.Date.format(date, format);
    },
});
