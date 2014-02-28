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
            	height: 500,
            	maxWidth: 700,
            	store: {
            		fields: ['isUnread', 'messageId', 'from', 'recipients', 'timeStamp', 'type', 'typeMetaData', 'isIncoming', 'mmsContent'],
            		data: [{
            			"messageId": "WU124",
            			"from": { "value": "+12065551212" },
            			"recipients": [{
            				"value": "+14255551212"
            			}, {
            				"value": "someone@att.com"
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
            			}]
            		}

            		]
            	},
            	itemTpl: [
					'<div class="iam_message">',
					'   <div class="iam_line">',
					'		<div class="iam_state_{isUnread}"><span>',
					'			<tpl if="isUnread == true">Unread</tpl>',
					'			<tpl if="isUnread == false">Read</tpl>',
					'		</span></div>',
					'		<div class="iam_state_{isIncoming}"><span>',
            		'			<tpl if="isIncoming == true">Incoming</tpl>',
            		'			<tpl if="isIncoming == false">Outgoing</tpl>',
            		'		</span></div>',
					'		<div><span>Type</span><p>{type}</p></div>',
					'		<div><span>Sent</span><p>{timeStamp:date("g:i A M d, Y ")}</p></div>',
					'		<div class="iam_id"><span>Id</span><p>{messageId}</p></div>',
					'	</div>',
					'	<div class="iam_line">',
					'		<div class="iam_from"><span>From</span><p>',
            		'			<tpl for="from">',
					'				<span>{value};</span>',
					'			</tpl>',
            		'		</p></div>',
            		'		<div class="iam_recipient"><span>To</span><p>',
					'			<tpl for="recipients">',
					'				<span>{value};</span>',
					'			</tpl>',
            		'		</p></div>',
					'	</div>',
           			'	<div class="iam_subject"><span>Subject</span><p>{typeMetaData.subject}</p></div>',
            		'	<div class="mms_Content">{mmsContent}</div>',
					'</div>'
            	]
            },
			{
				xtype: 'att-footer'
			}
		]);
	}
});