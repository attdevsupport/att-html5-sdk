/**
 *
 * User Interface for the MMS Basic sample application.
 *
 * Note: At this time, since iOS does not support file uploads, the file upload fields on the Basic MMS app have been hidden.
 *
 */
Ext.define('SampleApp.view.mms.Basic', {
	extend: 'Ext.Container',
	xtype: 'att-mms-basic',

	requires: [
		'Ext.form.Panel',
		'Ext.form.FieldSet',
		'SampleApp.view.Header',
		'SampleApp.view.Footer',
		'SampleApp.Config'
	],
	config: {
		title: 'Basic MMS',
		scrollable: 'vertical',
		defaults: { scrollable: null }
	},

	initialize: function () {
		this.add([
			 { xtype: 'att-header' },
			 this.buildSendMms(),
			 this.buildMmsStatus(),
			 { xtype: 'att-footer' }
		]);
	},


	/**
	 * Builds the UI components for Feature 1: Send MMS Message.
	 *
	 */
	buildSendMms: function () {
		var cfg = SampleApp.Config;
		return {
			xtype: 'formpanel',
			defaults: { margin: '5px 15px 15px 15px', width: 500 },
			items: [
				{
					xtype: 'container',
					cls: 'note',
					maxWidth: 510,
					html: '<span>Note</span><span>This application will send MMS only to phones on the AT&T Network</span>',
				},{
					xtype: 'fieldset',
					title: 'Feature 1: Send MMS Message',
					//instructions : 'WARNING: Total size of all attachments cannot exceed 600 KB.',
					defaults: {
						labelWidth: 120,
					},
					items: [
						{
							xtype: 'textfield',
							label: 'Phone',
							name: 'address',
							value: cfg.defaultPhoneNbr,
							required: true
						}, {
							xtype: 'textareafield',
							label: 'Message',
							name: 'subject',
							value: cfg.defaultMessage,
							required: true
						}, {

							xtype: 'radiofield',
							name: 'uploadType',
							cls: 'radioItem',
							labelWidth: 460,
							label: 'Select Attachment on Server',
							labelAlign: 'right',
							checked: true
						}, {
							xtype: 'selectfield',
							name: 'attachment',
							cls: 'radioItem',
							options: [
								{ text: 'Sencha.jpg', value: 'sencha.jpg' },
								{ text: 'Hello.jpg', value: 'hello.jpg' },
							],
							labelAlign: 'top',
							margin: '0 0 0 50'
						}, {
							xtype: 'radiofield',
							cls: 'radioItem',
							name: 'uploadType',
							id: "uploadAttachment",
							labelWidth: 460,
							label: 'Upload Attachment(s)',
							labelAlign: 'right',
						},{
							xtype: 'filefield',
							cls: 'radioItem',
							name: 'f1',
							hidden: true,
							disabled: true,
							labelAlign: 'top',
							margin: '0 0 0 45'
						}, {
							xtype: 'filefield',
							cls: 'radioItem',
							name: 'f2',
							hidden: true,
							disabled: true,
							labelAlign: 'top',
							margin: '0 0 0 45'
						}, {
							xtype: 'filefield',
							cls: 'radioItem',
							name: 'f3',
							hidden: true,
							disabled: true,
							labelAlign: 'top',
							margin: '0 0 0 45'
						}
					]
				}, {
					xtype: 'button',
					ui: 'action',
					action: 'sendmessage',
					id: 'btnSendMessage',
					text: 'Send Message'
				}
			]
		};
	},


	/**
	 * Builds the UI components for Feature 2: Get Delivery Status.
	 */
	buildMmsStatus: function () {
		return {
			xtype: 'formpanel',
			itemId: 'feature2',
			defaults: { margin: '5px 15px', maxWidth: 500 },
			items: [
				{
					xtype: 'fieldset',
					title: 'Feature 2: Get Delivery Status',
					defaults: {
						labelWidth: '40%'
					},
					items: [
						{
							xtype: 'textfield',
							label: 'Message ID',
							name: 'mmsId',
							required: true
						}
					]
				}, {
					xtype: 'button',
					ui: 'action',
					action: 'messagestatus',
					id: 'btnGetStatus',
					text: 'Get Status'
				}
			]
		};
	}

});