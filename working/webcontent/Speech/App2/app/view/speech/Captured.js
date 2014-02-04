/**
 *
 * User Interface for the Speech to Text Captured application.
 *
 */
Ext.define('SampleApp.view.speech.Captured', {
	extend: 'Ext.Container',
	xtype: 'att-speech-captured',

	requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer'
	],

	config: {
		title: 'Captured Speech',
		scrollable: 'vertical',
		defaults: { scrollable: null }
	},

	initialize: function () {
		this.add([
            { xtype: 'att-header' },
            this.buildForm(),
            { xtype: 'att-footer' }
		]);
	},

	/**
     * Builds the UI components for Feature 1: Send Speech To Text.
     */
	buildForm: function () {
		return {

			xtype: 'container',
			flex: 1,
			defaults: { margin: 20 },
			items: [
				{
					xtype: 'fieldset',
					layout: 'hbox',
					maxWidth: 500,
					title: 'First, record an audio file in your browser',

					defaults: { flex: 1, margin: 15, width: 120 },
					items: [
						{
							xtype: 'button',
							action: 'startRecording',
							text: 'Start',
							disabled: true
						}, {
							xtype: 'button',
							action: 'stopButton',
							text: 'Stop',
							disabled: true
						}, {
							xtype: 'button',
							action: 'clearRecording',
							text: 'Clear',
							disabled: true
						}, {
							xtype: 'button',
							action: 'playRecording',
							text: 'Play',
							disabled: true
						}
					]
				}, {
					xtype: 'fieldset',
					title: 'Next, submit audio to be converted to text',
					layout: 'vbox',
					maxWidth: 700,
					padding: 5,
					items: [
						{
							margin: 10,
							width: 120,
							xtype: 'button',
							action: 'submitAudio',
							width: 120,
							text: 'Submit',
							disabled: true
						}, {
							margin: 5,
							xtype: 'fieldset',
							title: 'Result',
							padding: 0,
							items: [{
								xtype: 'container',
								scrollable: true,
								height: 100,
								html: '<div id="responseWindow" class="logWindow"></div>'
							}]
						}
					]
				}, {
					xtype: 'fieldset',
					title: "Log Window",
					maxWidth: 700,
					marginLeft: 100,
					flex: 1,
					padding: 0,
					items: [{
						xtype: 'container',
						scrollable: true,
						padding: 0,
						height: 150,
						html: '<div id="logWindow" class="logWindow"></div>'
					}]
				}
			]
		}
	}
});


