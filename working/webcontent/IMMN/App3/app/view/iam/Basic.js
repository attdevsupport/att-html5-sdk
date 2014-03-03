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
		title: 'IAM Example',
		scrollable: 'vertical',
		defaults: { scrollable: null }
	},

	initialize: function () {
		this.add([
			{ xtype: 'att-header' },
			{
				id: 'messages',
 				xtype: 'dataview',
 				margin: '10px 20px',
 				padding: 3,
 				cssCls: 'messageBox',
 				height: 700,
 				maxWidth: 700,
 				scrollable: 'vertical',
 				store: 'Messages',
 				itemTpl: [
					'<div class="iam_message">',
					'	<div class="iam_head">',
					'		<div class="iam_buttons">',
					'			<button id="del_{messageId}">Delete</button>',
					'			<button id="reply_{messageId}">Reply</button>',
					'		</div>',
					'		<div class="iamState">',
					'			<input type="checkbox" id="sel_{messageId}"/><label for="sel_{messageId}">Select</label>',
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