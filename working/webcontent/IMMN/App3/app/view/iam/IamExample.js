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
	markMessageRead: function (isUnread, messageId) {
		this.getController().markMessageRead(isUnread, messageId);
	},
	buttonClick: function (el) {
		this.getController().buttonClick(el);
	},
	loadContent: function (el, messageId, url, name) {
		el.innerHTML = '<span>Loading Content ...</span> <img src="../../images/ajax-loader.gif" />';
		this.getController().loadContent(messageId, url, name)
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
					height: 20,
					margin: '10px 0 20px 0',
					items: [{
						xtype: 'button',
						id: 'btnDeleteSelected',
						width: 130,
						margin: '0px 20px 0 10px',
						text: 'Delete Selected',
						disabled: true,
						height: 20,
						action: 'deleteMultiple',
					}, {
						xtype: 'selectfield',
						label: 'Download Count',
						labelWidth: 120,
						width: 170,
						name: 'dataCount',
						value: 20,
						cls: 'smallerSelect',
						labelCls: 'smallerLabel',
						options: [
							{ text: '5', value: 5 },
							{ text: '10', value: 10 },
							{ text: '20', value: 20 },
							{ text: '50', value: 50 },
							{ text: '80', value: 80 },
							{ text: '125', value: 125 },
							{ text: '200', value: 200 },
						]
					}, {
						xtype: 'button',
						height: 20,
						id: 'btnRefresh',
						text: 'Refresh',
						action: 'refresh',
						margin: '0px 30px 0 20px',
						padding: '0 10px',
					},{
						xtype: 'container',
						cls: 'labeledBox',
						height: 20,
						width: 100,
						html: '<span class="label">Message Count</span><span class="box" id="msgCount"></span>'
					}]
				},{
					xtype: 'dataview',
					cssCls: 'messageBox',
					store: 'Messages',
					scrollable: 'vertical',
					height: 840,
					width: '100%',
					itemTpl: [
						'<div  id="msg_{messageId}" class="iam_message <tpl if="selected == true">sel</tpl>">',
						'	<div class="iam_head">',
						'		<div class="iam_buttons">',
						'			<button id="del_{messageId}" onclick="me.buttonClick(this)">Delete</button>',
						'			<button id="reply_{messageId}" onclick="me.buttonClick(this)">Reply</button>',
						'		</div>',
						'		<div class="iamState">',
						'			<span onclick="me.onSelect(this);"><input id="sel_{messageId}" type="checkbox" <tpl if="selected == true">checked</tpl>/><label for="sel_{messageId}">Select</label></span>',
						'			<span class="iam_state_{isUnread}" onclick="me.markMessageRead({isUnread},\'{messageId}\')">',
						'				<tpl if="isUnread == true">Unread</tpl>',
						'				<tpl if="isUnread == false" >Read</tpl>',
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
						'	<tpl if="type == \'TEXT\' || type == \'XML\'">',
						'		<div class="iam_content">{text}</div>',
						'	<tpl else>',
						'		<tpl for="mmsContent">',
						'			<tpl if="hasContent">',
						'				<tpl if="isTextType">',
						'					<div class="iam_content">{content}</div>',
						'				<tpl else>',
						'					<div class="iam_image"><div><img src="{content}" /></div><p>{contentName}</p></div>',
						'				</tpl>',
						'			<tpl else>',
						'				<tpl if="isTextType">',
						'					<div class="iam_content loading" onclick="me.loadContent(this, \'{parent.messageId}\', \'{partNum}\',\'{contentName}\')">Click to load content ... </div>',
						'				<tpl else>',
						'					<div class="iam_image"><div onclick="me.loadContent(this, \'{parent.messageId}\', \'{partNum}\',\'{contentName}\')"><span>Click to load content</span></div><p>{contentName}</p></div>',
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


