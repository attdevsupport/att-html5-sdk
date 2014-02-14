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
			defaults: { fontsize:'3%', margin: '3%', width: '92%', maxWidth: 500, },
			items: [
				{
					xtype: 'fieldset',
					layout: 'hbox',
					title: 'First, record an audio file in your browser',
					defaults: { flex: 1, margin: '3%', width: '15%'},
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
					items: [
						{
							margin: '3%',
							width: '22%',
							xtype: 'button',
							action: 'submitAudio',
							text: 'Submit',
							disabled: true
						}, {
							xtype: 'fieldset',
							title: 'Result',
							margin: '3%',
							height: 150,
							html: '<div id="responseWindow" class="logWindow"></div>'
						}
					]
				}, {
					xtype: 'fieldset',
					title: "Log Window",
					maxWidth: 500,
					height: 200,
					html: '<div id="logWindow" class="logWindow"></div>'
				}
			]
		}
	}
});


