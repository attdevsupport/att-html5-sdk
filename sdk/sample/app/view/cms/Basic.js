/**
 *
 * User Interface for the CMS Basic application.
 * Registration IDs or short codes need to be configured on SampleApp.Config class.
 * Please refer to <code> shortCode </code> and <code> anotherShortCode </code> configuration parameters in order to be able to receive message.
 *
 */
Ext.define('SampleApp.view.cms.Basic', {
	extend: 'Ext.Container',
	xtype: 'att-cms-basic',

	requires: [
		'Ext.form.Panel',
		'Ext.form.FieldSet',
		'SampleApp.view.Header',
		'SampleApp.view.Footer',
		'SampleApp.Config'
	],

	config: {
		title: 'Basic Call Management',
		scrollable: 'vertical',
		defaults: {scrollable: null}
	},

	initialize: function() {
		this.add([
			{xtype: 'att-header'},
			this.buildCreateSession(),
			{xtype: 'att-footer'}
		]);
	},


	/**
	 * Builds the UI components for Feature 1: create CMS Session.
	 */
	buildCreateSession: function() {
		var cfg = SampleApp.Config;
		return {
			xtype   : 'formpanel',
			layout	: 'hbox',
			items   : [{
				xtype : 'container',
				align : 'start',
				style: 'margin-right: 20px;',
				flex: 1,
				items: [{
					xtype    : 'fieldset',
					title    : 'Feature 1: Outbound Session',
					flex: 2,
					defaults : {
						labelWidth : '40%'
					},
					items : [{
						xtype    : 'textfield',
						placeHolder: 'SIP address or wireless number to dial',
						label    : 'Make call to:',
						name     : 'numberToDial'
					}, {
						xtype   : 'selectfield',
						label   : 'Script Function',
						name    : 'feature',
						value   : 'ask',
						options: [
							{ text: 'Ask', value: 'ask', description: [
								'<strong>ask()</strong> script function, ',
								'the user is prompted to enter a few digits and the entered digits are spoken back. ',
								'The user is then asked to press a digit to activate music on hold <strong>"Message to Play"</strong> ',
								'while it waits for a signal (Feature 2)'
							].join("") },
							{ text: 'Conference', value: 'conference', description: [
								'For <strong>conference()</strong> script function, ',
								'the user is prompted to join a conference. After quitting the conference, the user ',
								'is then asked to press a digit to activate music on hold <strong>"Message to Play"</strong> ',
								'while it waits for a signal (Feature 2)'
							].join("") },
							{ text: 'Reject', value: 'reject', description: [
								'For <strong>reject()</strong> script function, ',
								'if <strong>"Number parameter for Script Function"</strong> matches the calling ID, the call ',
								'will be dropped. If it does not match, both the calling Id and <strong>"Number parameter for ',
								'Script Function"</strong> are said to the user. The user is then asked to press a digit to activate ',
								'music on hold <strong>"Message to Play"</strong> while it waits for a signal (Feature 2)'
							].join("") },
							{ text: 'Transfer', value: 'transfer', description: [
								'For <strong>transfer()</strong> script function, the <strong>"Number parameter ',
								'for Script Function"</strong> is said to the user and the call will be transferred to that number. While ',
								'waiting for the transfer to complete, music on hold <strong>"Message to Play"</strong> is played. When the ',
								'transfer has completed, and the end number has disconnected, the user is asked to press a digit to ',
								'activate music on hold <strong>"Message to Play"</strong> while it waits for a signal (Feature 2)'
							].join("") },
							{ text: 'Wait', value: 'wait', description: [
								'For <strong>wait()</strong> script function, if the <strong>"Number parameter ',
								'for Script Function"</strong> matches the calling Id, the call will be placed on hold for 3 seconds. ',
								'If it does not match, both the calling Id and <strong>"Number parameter for Script Function"</strong> are ',
								'said to the user. The user is then asked to press a digit to activate music on hold <strong>"Message to ',
								'Play"</strong> while it waits for a signal (Feature 2)' 
							].join("") }
						]
					}, {
						xtype: 'container',
						styleHtml: true,
						name : 'functionDescription',
						styleHtmlContent: true,
						style: 'background-color: #DFDFDF;',
						html: [
							'For <strong>ask()</strong> script function, ',
							'the user is prompted to enter a few digits and the entered digits are spoken back. ',
							'The user is then asked to press a digit to activate music on hold <strong>"Message to Play"</strong> ',
							'while it waits for a signal (Feature 2)'
						].join("")
					}, {
						xtype    : 'textfield',
						label    : 'Number parameter for Script Function:',
						placeHolder: 'SIP address or wireless number to pass to script function',
						name     : 'featurenumber'
					}, {
						xtype    : 'textfield',
						label    : 'Message or URL to play',
						placeHolder: 'eg http://... your server ../path/to/mp3/file',
						name     : 'messageToPlay'
					}]
				}, {
					xtype   : 'button',
					ui      : 'action',
					action  : 'createsession',
					text    : 'Create Session'
				}, {
					xtype: 'fieldset',
					title: 'Feature 2: Send Signal',
					defaults: {
						labelWidth: '40%'
					},
					items: [{
						xtype: 'textfield',
						readOnly: true,
						label: 'Session ID:',
						name: 'sessionId'
					}, {
						xtype: 'selectfield',
						label: 'Signal to Send:',
						name: 'signal',
						options: [
						   { text: 'Exit', value : 'exit' },
						   { text: 'Stop/Hold', value: 'stopHold' },
						   { text: 'DeQueue', value: 'dequeue'}
						]
					}]
				}, {
					xtype: 'button',
					ui: 'action',
					disabled: true,
					action: 'sendsignal',
					text: 'Send Signal'
				}]
			}, {
				flex: 1,
				xtype: 'fieldset',
				title: 'Script Source',
				style: 'margin: 0px;',
				height: 500,
				items: [{
					xtype: 'panel',
					layout: 'fit',
					name: 'script',
					height: 500,
					style: 'background-color: #FFFFE0; font-weight: normal; font-size: 12px; padding: 2px; white-space: pre;',
					scrollable: true,
					html: 'Loading script...'
				}]
			}]
		};
	}
	
});