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
			dataView: 'att-iam-iamExample dataview',
			formPanel: 'att-iam-iamExample #formPanel',
			waitMessage: 'att-iam-iamExample #waitMessage',
			view: 'att-iam-iamExample',
			messageStore: 'SampleApp.model.Messages'
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
			}
		},
	},
	dataCount: 20,
	setDataCount: function() {
		this.dataCount = this.getFormDataCount().getValue()
		this.getMessages();
	},
	setWaitMessage: function (msg, hideAfterDisplay) {
		me = this;
		this.waitMessage.setMessage(msg);
		this.waitMessage.show();

		if (hideAfterDisplay) {
			setTimeout(function () { me.hideWaitMessage(); }, 1200);
		}
	},
	hideWaitMessage: function () {
		this.waitMessage.hide();
		me.countSelectedMessages();
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
		var me = this;

		//timeout so event propagates to get correct checked value;
		setTimeout(function () {
			var selected = el.checked;
			context.record.set('selected', selected);
			me.countSelectedMessages();
		}, 30);
	},
	refreshMail: function () {

		var me = this;
		me.setWaitMessage("Refreshing Email");
		AttApiClient.getMessageDelta(me.messageIndexInfo.state, success, fail);
		
		function success (r) {
			if (me.messageIndexInfo.state != r.deltaResponse.state) {
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
							var record = me.store.findRecord("messageId", del.messageId);
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
							debugger;
							me.store.addData(result.messageList, function (r) { alert("success") }, function (r) { alert('fail'); });
							
							doDelete();
						},
						function (result) {
							me.setWaitMessage("Error retrieving records " + actions.newData.join(", "));
							doUpdate();
						}
					);
				} else { doDelete(); }

				function doDelete() {
					if (actions.deletes.length > 0) {
						me.store.remove(actions.deletes)
					};
					done();
				}

				function done () {

					debugger;
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
					me.setWaitMessage(msg, true);
					me.getIndexInfo();
				}
				return;
			}
			me.setWaitMessage("No changes", true);
		}

		function fail(e) {
			me.hideWaitMessage();
			Ext.Msg.alert("Error", "Unexpected failure refreshing mail");
		}
	},
	buttonClick: function (el) {

		var me = this;
		var context = this.getContextFromEl(el);

		switch (el.innerHTML) {
			case "Delete":
				me.setWaitMessage("Deleting Message");
				AttApiClient.deleteMessage(context.messageId,
					function () {
						me.store.remove(context.record);
						me.getIndexInfo();
						me.hideWaitMessage();
					},
					function (r) {
						me.setWaitMessage("Failed to delete message", true);
					}
				);
				break;
			case "Reply":
				break;
		}
	},
	currentScroll: null,
	objectUrls: [],
	loadContent: function (el, messageId, partNum, name) {
		
		el.innerHTML = '<span>Loading Content ...</span> <img src="../../images/ajax-loader.gif" />';

		var me = this;
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
					me.objectUrls.push(r);
					success(URL.createObjectURL(r));
				}
				
				function success(result) {
					part.content = result;
					part.hasContent = true;
					mmsContent[partNum] = part;
					me.currentScroll = me.dataView.getScrollable().getScroller().position.y
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
		var me = this;
		this.setWaitMessage("Deleting Messages");
		AttApiClient.deleteMessages(ids,
			function () {
				var records = [];
				ids.forEach(function (messageId) {
					records.push(me.store.findRecord("messageId", messageId))
				});
				me.store.remove(records);
				me.hideWaitMessage();
				me.getIndexInfo();
			},
			function (r) {
				Ext.Msg.alert("Error", "Failed to delete messages");
			}
		);
	},
	markMessageRead: function (isUnread, messageId) {
		var me = this;
		AttApiClient.updateMessage(
			{
				isUnread: !isUnread,
				id: messageId
			},
			function () {
				var record = me.store.findRecord("messageId", messageId);
				record.set("isUnread", !isUnread);
			},
			function (e) {
				Ext.Msg.alert("Error", "Unexpected Error: " + e);
			}
		);
	},
	getMessages: function () {
		
		var me = this;
		me.objectUrls.forEach(URL.revokeObjectURL);
		me.objectUrls = [];
		
		me.setWaitMessage("Downloading Messages");
		AttApiClient.getMessageList({ count: me.dataCount }, function (result) {

			me.hideWaitMessage();
			me.store.setData(result.messageList.messages);
			me.formPanel.show();

		}, function (result) {
			Ext.Msg.alert("Error", JSON.parse(result.responseJSON.error).RequestError.PolicyException.Text);
		});
		
	},
	launch: function () {

		AttApiClient.authorizeUser({ scope: "MIM,IMMN" }, launchExec, function errorHandler() {
			Ext.Msg.alert("Error", "Was not able to authorize user");
			return;
		});

		var me = this;

		function launchExec() {

			me.waitMessage = me.getWaitMessage();
			me.dataView = me.getDataView();
			me.dataView.addListener(
				'refresh',
				function () {
					if (me.currentScroll != null) {
						try {
							me.dataView.getScrollable().getScroller().setOffset({ x: 0, y: me.currentScroll });
						} catch (e) { }
						me.currentScroll = null;
					}
				}
			);

			me.store = me.dataView.getStore();
			me.waitMessageText = document.getElementById("waitMessageText");
			me.btnDeleteSelected = me.getBtnDeleteSelected();
			me.formPanel = me.getFormPanel();
			me.view = me.getView();

			me.getMessages();
			me.getIndexInfo();
		}
	},
	getIndexInfo: function () {
		me = this;
		me.countSelectedMessages();

		AttApiClient.getMessageIndexInfo(
			function (r) {
				me.messageIndexInfo = r.messageIndexInfo;
				document.getElementById("msgCount").innerHTML = r.messageIndexInfo.messageCount;
			},
			function (e) {
				Ext.Msg.alert("Error", "Could not create message index");
			}
		);
	}

});