/**
 * Controller that interacts with the Basic IAM application.
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
			dataView: 'att-iam-iamExample dataview',
			authorizing: 'att-iam-iamExample #authorizing',
			view: 'iamExample',
			messageStore: 'SampleApp.model.Messages'
		},
	},
	getMessages: function () {
		var me = this;
		this.getAuthorizing().hide();

		this.dataView = this.getDataView();
		//AttApiClient.getMessageList(function (result) { dataStore.setData(data); }, function (result) { Ext.Msg.alert(JSON.stringify(result)); })

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
		return;
		AttApiClient.authorizeUser({ scope: "MIM,IMMN" }, me.getMessages, function errorHandler() {
			Ext.Msg.alert("Was not able to authorize user");
		});
	}
});