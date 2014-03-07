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
		scrollable: false,
		height: '100%',
		width: '100%',
		defaults: {
			maxWidth: 700,
			margin: '10px %1 0 1%'
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
	loadContent: function (el, messageId, url, name) {
		this.getController().loadContent(el, messageId, url, name)
	},
	initialize: function () {
		me = this;

		this.add([
			{
				xtype: 'att-header',
				scrollable: 'vertical',
				height: 60
			},{
				id: 'waitMessage',
				xtype: 'container',
				margin: '10px 20px',
				height: 200,
				scrollable: false,
				html: '<h1 id="waitMessageText">Authorizing ... </h1><img src ="../../images/loading.gif">',
			},{
				maxWidth: 700,
				height: 900,
				xtype: 'formpanel',
				scrollable: 'false',
				id: 'formPanel',
				title: "Messages",
				hidden: true,
				width: '100%',
				items: [{
					xtype: 'container',
					layout: 'hbox',
					height: 45,
					margin: '10px 0 10px 0',
					items: [{
						xtype: 'button',
						id: 'btnDeleteSelected',
						width: 130,
						margin: '0px 30px 0 10px',
						text: 'Delete Selected',
						disabled: true,
						action: 'deleteMultiple'
					}, {
						xtype: 'selectfield',
						label: 'Download Count',
						labelWidth: 150,
						width: 220,
						name: 'dataCount',
						value: 20,
						options: [
							{ text: '5', value: 5 },
							{ text: '10', value: 10 },
							{ text: '20', value: 20 },
							{ text: '50', value: 50 },
							{ text: '80', value: 80 },
							{ text: '125', value: 125 },
							{ text: '200', value: 125 },
						]
					}]
				},{
					xtype: 'dataview',
					cssCls: 'messageBox',
					store: 'Messages',
					scrollable: 'vertical',
					height: 840,
					width: '100%',
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
						'		<tpl if="type != \'TEXT\'>',
						'			<tpl if="typeMetaData.subject">',
						'				<div class="iam_prop iam_long">',
						'					<span>Subject</span><p>{typeMetaData.subject}</p>',
						'				</div>',
						'			</tpl>',
						'		</tpl>',
						'	</div>',
						'	<tpl if="type == \'TEXT\'">',
						'		<div class="iam_content">{text}</div>',
						'	<tpl else>',
						'		<tpl for="mmsContent">',
						'			<tpl if="hasContent">',
						'				<tpl if="type == \'TEXT\'">',
						'					<div class="iam_content" style="background-color: red;">{content}</div>',
						'				</tpl>',
						'				<tpl if="type == \'IMAGE\'">',
						'					<div class="iam_image"><img src="{content}" /><p>{contentName}</p></div>',
						'				</tpl>',
						'			<tpl else>',
						'				<tpl if="type == \'TEXT\'">',
						'					<div class="iam_content" onclick="me.loadContent(this, {parent.index}, \'{partNum}\',\'{contentName}\')">Click to load content ... </div>',
						'				</tpl>',
						'				<tpl if="type == \'IMAGE\'">',
						'					<div class="iam_image"><span>Click to load content</span><p>{contentName}</p></div>',
						'				</tpl>',
						'			</tpl>',
						'		</tpl>',
						'	</tpl>',
						'</div>'
					]
				}]
			},{
				xtype: 'att-footer',
				scrollable: 'vertical',
				height: 150
			}
		]);
	}
});


