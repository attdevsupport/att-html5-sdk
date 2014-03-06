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
		models: ['Message'],
		stores: ['Messages'],
		refs: {
			btnDeleteSelected: 'att-iam-iamExample #btnDeleteSelected',
			dataView: 'att-iam-iamExample dataview',
			waitMessage: 'att-iam-iamExample #waitMessage',
			view: 'att-iam-iamExample',
			messageStore: 'SampleApp.model.Messages'
		},

		control: {
			'att-iam-iamExample button[action=deleteMultiple]': {
				tap: 'deleteMultiple'
			}
		},
	},
	setWaitMessage: function(msg) {
		this.waitMessageText.innerHTML = msg;
		this.waitMessage.show()
	},
	getContextFromEl: function(el) {

		var context = {
			index : el.id.split("_")[1],
		};
		context.record = this.store.getAt(context.index);
		context.messageId = context.record.get("messageId");
		return context;		
	},
	onSelect: function(el, checkbox) {
		var context = this.getContextFromEl(el);
		var me = this;

		//timeout so event propagates to get correct checked value;
		setTimeout(function () {
			var selected = el.checked;
			context.record.set('selected', selected);
			me.countSelectedMessages();
		}, 10);
	},
	buttonClick: function (el) {

		var me = this;
		var context = this.getContextFromEl(el);
		switch (el.innerHTML) {
			case "Delete":
				AttApiClient.deleteMessage(context.messageId,
					function () {
						me.store.removeAt(context.index);
						me.countSelectedMessages();
						Ext.Msg.alert("Message " + context.messageId + " was removed");
					},
					function (r) {
						Ext.Msg.alert("Failed to delete message");
					}
				);
				break;
			case "Reply":
				break;
		}
	},
	countSelectedMessages: function () {
		
		var selectedIds = [];
		this.store.each(function (record, index) {
			if (record.get('selected')) {
				selectedIds.push(record.get("messageId"))
			};
		});

		this.selectedIds = selectedIds;
		this.btnDeleteSelected.show().setDisabled(this.selectedIds.length == 0);
	},
	deleteMultiple: function (el) {

		var me = this;
		AttApiClient.deleteMessage(this.selectedIds,
			function () {
				
				var records = [];
				me.selectedIds.forEach(function (nessageId) {
					records.push(me.store.findRecord("messageId", nessageId))
				});
				me.store.remove(records);

				Ext.Msg.alert("Message(s) " + me.selectedIds.join(", ") + " were removed");
				me.countSelectedMessages();
			},
			function (r) {
				Ext.Msg.alert("Failed to delete message");
			}
		);
		
	},
	getMessages: function () {

		this.waitMessage = this.getWaitMessage();
		this.dataView = this.getDataView();
		this.store = this.dataView.getStore();
		this.waitMessageText = document.getElementById("waitMessageText");
		this.btnDeleteSelected = this.getBtnDeleteSelected();

		this.view = this.getView();
		var me = this;

		AttApiClient.authorizeUser({ scope: "MIM,IMMN" }, getMessagesExec, function errorHandler() {
			Ext.Msg.alert("Was not able to authorize user");
		});
	
		function getMessagesExec() {
			me.setWaitMessage("Getting messages");
			AttApiClient.getMessageList({ count: 20 }, function (result) {
				
				me.waitMessage.hide();
				me.store.setData(result.messageList.messages);
				me.dataView.show();
				me.countSelectedMessages()
				
			}, function (result) {
				Ext.Msg.alert("Something went wrong");
			});
		}
	},
	mock_getMessages: function () {

		var me = this;
		this.getWaitMessage().hide();
		this.dataView = this.getDataView();

		var data = [{
			"messageId": "WU124",
			"from": { "value": "+12065551212" },
			"recipients": [{
				"value": "+14255551212"
			}, {
				"value": "someone@att.com"
			}, {
				"value": "+14255551111"
			}, {
				"value": "someoneElse@att.com"
			}],
			"timeStamp": "2012-01-14T12:00:00",
			"isUnread": false,
			"type": "MMS",
			"typeMetaData": {
				"subject": "This is an MMS message with parts"
			},
			"isIncoming": false,
			"mmsContent": [{
				"contentType": "text/plain",
				"contentName": "part1.txt",
				"contentUrl": "/myMessages/v2/messages/0",
				"type": "TEXT"
			}, {
				"contentType": "image/jpeg",
				"contentName": "sunset.jpg",
			"contentUrl": "/myMessages/v2/messages/1",
				"type": "IMAGE"
			}]
		},
		{
			"messageId": "WU3124",
			
			"from": { "value": "+12065551212" },
			"recipients": [{
				"value": "+14255551212"
			}, {
				"value": "someone@att.com"
			}],
			"timeStamp": "2012-01-14T12:00:00",
			"isUnread": true,
			"type": "MMS",
			"typeMetaData": {
				"subject": "This is an MMS message with parts"
			},
			"isIncoming": false,
			"mmsContent": [{
				"contentType": "text/plain",
				"contentName": "part1.txt",
				"contentUrl": "/myMessages/v2/messages/0",
				"type": "TEXT"
			}, {
				"contentType": "image/jpeg",
				"contentName": "sunset.jpg",
				"contentUrl": "/myMessages/v2/messages/1",
				"type": "IMAGE"
			}, {
				"contentType": "image/jpeg",
				"contentName": "yadda.jpg",
				"contentUrl": "/myMessages/v2/messages/1",
				"type": "IMAGE"
			}]
		}];
		this.dataView.getStore().setData(data);
		this.dataView.show();

	},
	launch: function () {

		var me = this;
		me.getMessages();
		//me.mock_getMessages();
	}
});