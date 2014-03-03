/**
 *
 * User Interface for the IAM Basic sample application.
 *
 */

Ext.define('SampleApp.view.iam.Basic', {
	extend: 'Ext.Container',
	xtype: 'att-iam-basic',

	requires: [
		'Ext.form.Panel',
		'Ext.form.FieldSet',
		'SampleApp.view.Header',
		'SampleApp.view.Footer',
		'SampleApp.Config'
	],
	config: {
		title: 'Basic IAM',
		scrollable: 'vertical',
		defaults: { scrollable: null }
	},

	initialize: function () {
		this.add([
			{ xtype: 'att-header' },
			{
 				xtype: 'dataview',
 				margin: '10px 20px',
 				padding: 3,
 				cssCls: 'messageBox',
 				height: 700,
 				maxWidth: 700,
 				scrollable: 'vertical',
 				store: {
 					fields: ['isUnread', 'messageId', 'from', 'recipients', 'timeStamp', 'type', 'typeMetaData', 'isIncoming', 'mmsContent'],
 					data: [{
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
 						"messageId": "WU124",
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
 					}

 					]
 				},
 				itemTpl: [
					'<div class="iam_message">',
					'	<div class="iam_head">',
					'		<div class="iam_buttons"><button id="del_{iam_id}">Delete</button><button id="reply_{iam_id}">Reply</button></div>',
					'		<div class="iamState">',
					'			<span class="iam_state_{isUnread}">',
					'				<tpl if="isUnread == true">Unread</tpl>',
					'				<tpl if="isUnread == false">Read</tpl>',
					'			</span>',
					'			<span class="iam_state_{isIncoming}">',
 					'				<tpl if="isIncoming == true">Incoming</tpl>',
 					'				<tpl if="isIncoming == false">Outgoing</tpl>',
					'			</span>',
					'		</div>',
					'	</div>',
					'	<div class="iam_flex">',
					'		<div class="iam_prop iam_short">',
					'			<span>Type</span><p>{type}</p>',
					'		</div>',
					'		<div class="iam_prop">',
					'			<span>Sent</span><p>{timeStamp:date("g:i A M d, Y ")}</p>',
					'		</div>',
					'		<div class="iam_prop iam_short">',
					'				<span>Id</span><p>{messageId}</p>',
					'			</div>',
					'		 <div class="iam_prop iam_long">',
					'			<span>From</span><p>',
					'				<tpl for="from">',
					'					<span>{value};</span>',
					'				</tpl>',
					'			</p>',
					'		</div>',
					'		<div class="iam_prop iam_long">',
					'			<span>To</span><p>',
					'				<tpl for="recipients">',
					'					<span>{value};</span>',
					'				</tpl>',
					'			</p>',
					'		</div>',
					'		<div class="iam_prop iam_long">',
					'			<span>Subject</span><p>{typeMetaData.subject}</p>',
					'		</div>',
					'	</div>',
					'	<tpl for="mmsContent">',
					'		<tpl if="type == \'TEXT\'">',
					'			<div class="iam_content">Loading Content ...</div>',
					'		</tpl>',
					'	</tpl>',
					'	<tpl for="mmsContent">',
					'		<tpl if="type == \'IMAGE\'">',
					'			<div class="iam_image"><img src="{contentUrl}/{contentName}"/><p>{contentName}</p></div>',
					'		</tpl>',
					'	</tpl>',
					'</div>'
 				]
			},
			{
			xtype: 'att-footer'
			}
		]);
	}
});