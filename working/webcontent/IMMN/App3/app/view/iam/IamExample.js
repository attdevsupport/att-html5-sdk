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
		scrollable: 'vertical',
		defaults: {
			scrollable: null,
			maxWidth: 700,
			margin: '0px 5px'
		}
	},
	getController: function () {
		if (!this.controller) {
			this.controller = SampleApp.app.getController('iam.iamExample');
		}
		return this.controller;
	},
	onSelect: function (el) {
		this.getController().onSelect(el.getElementsByTagName("input")[0]);
	},
	buttonClick: function (el) {
		this.getController().buttonClick(el);
	},
	loadContent: function (el, url, name) {
		this.getController().loadContent(el, url, name)
	},

	initialize: function () {
		me = this;

		this.add([
			{
				xtype: 'att-header'
			}, {
				id: 'waitMessage',
				xtype: 'container',
				margin: '10px 20px',
				html: '<h1 id="waitMessageText">Authorizing ... </h1><img src ="../../images/loading.gif">',
			}, {
				xtype: 'button',
				id: 'btnDeleteSelected',
				hidden: true,
				width: 200,
				margin: '10px 10px 0 10px',
				text: 'Delete Selected Messages',
				disabled: true,
				action: 'deleteMultiple'
			}, {
				id: 'messagesDataView',
				height: 700,
				xtype: 'dataview',
				hidden: true,
				cssCls: 'messageBox',
				scrollable: 'vertical',
				store: 'Messages',
				itemTpl: [
					'<div  id="msg_{index}" class="iam_message <tpl if="selected == true">sel</tpl>">',
					'	<div class="iam_head">',
					'		<div class="iam_buttons">',
					'			<button id="del_{index}" onclick="me.buttonClick(this)">Delete</button>',
					'			<button id="reply_{index}" onclick="me.buttonClick(this)">Reply</button>',
					'		</div>',
					'		<div class="iamState">',
					'			<span onclick="me.onSelect(this);"><input id="sel_{index}" type="checkbox" <tpl if="selected == true">checked</tpl>/><label for="sel_{index}">Select</label></span>',
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
					'		<tpl if="type != \'TEXT\'">',
					'			<div class="iam_prop iam_long">',
					'				<span>Subject</span><p>{typeMetaData.subject}</p>',
					'			</div>',
					'		</tpl>',
					'	</div>',
					'	<tpl if="type == \'TEXT\'">',
					'		<div class="iam_content">{text}</div>',
					'	<tpl else>',
					'		<tpl for="mmsContent">',
					'			<tpl if="type == \'TEXT\'">',
					'				<div class="iam_content" onclick="me.loadContent(this, \'{contentURL}\',\'{contentName}\')">Click to load content ... </div>',
					'			</tpl>',
					'		</tpl>',
					'		<tpl for="mmsContent">',
					'			<tpl if="type == \'IMAGE\'">',
					'				<div class="iam_image"><img src="{contentUrl}/{contentName}" /><p>{contentName}</p></div>',
					'			</tpl>',
					'		</tpl>',
					'	</tpl>',
					'</div>'
				]
			}, {
				xtype: 'att-footer'
			}
		]);
	}
});