/**
 *
 * User Interface for the IAM sample application.
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
		scrollable: 'vertical',
		defaults: { scrollable: null }
	},
	toggleClass: function (cls, id, toggle) {
		var o = document.getElementById(id);
		var arrClasses = o.className.split(" ");
		var arrNewClasses = [];
		arrClasses.forEach(function(x){
			if (x != cls) {
				arrNewClasses.push(x);
			}
		});
		if (toggle) {
			arrNewClasses.push(cls);
		};
		o.className = arrNewClasses.join(" ");
	},
	initialize: function () {
		me = this;

		this.add([
			{
				xtype: 'att-header'
			}, {
				'xtype': 'container',
				margin: '10px 20px',
				padding: 3,
				items: [
					{
						id: 'authorizing',
						xtype: 'container',
						margin: '10px 20px',
						html: "<h1>Authorizing ... </h1>"
					}, {
						id: 'messagesDataView',
						xtype: 'dataview',
						hidden: true,
						cssCls: 'messageBox',
						height: 700,
						maxWidth: 700,
						scrollable: 'vertical',
						store: 'Messages',
						listeners: {
							'itemtap': function (theView, i, target, record, e, opts) {
								var data = record.data;
								setTimeout(function () {
									data.selected = document.getElementById("sel_" + data.messageId).checked;
									me.toggleClass("sel", "msg_" + data.messageId, data.selected);
								}, 10);
							}
						},
						itemTpl: [
							'<div  id="msg_{messageId}" class="iam_message <tpl if="selected == true">sel</tpl>">',
							'	<div class="iam_head">',
							'		<div class="iam_buttons">',
							'			<button id="del_{messageId}">Delete</button>',
							'			<button id="reply_{messageId}">Reply</button>',
							'		</div>',
							'		<div class="iamState">',
							'			<input type="checkbox" id="sel_{messageId}" <tpl if="selected == true">checked</tpl>/><label for="sel_{messageId}">Select</label>',
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
							'			<tpl for="from">',
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
					}]
			}, {
				xtype: 'att-footer'
			}
		]);
	}
});