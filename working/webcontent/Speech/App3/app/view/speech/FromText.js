/**
 *
 * User Interface for the Speech to Text Basic application.
 *
 */
Ext.define('SampleApp.view.speech.FromText', {
	extend: 'Ext.Container',
	xtype: 'att-speech-fromtext',

	requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer'
	],

	config: {
		title: 'Speech from Text',
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
			defaults: { margin: 30 },
			items: [
				{
					xtype: 'fieldset',
					title: 'Type text below to convert to speech',
					layout: 'vbox',
					maxWidth: 700,
					items: [
						{
							xtype: 'textareafield',
							name: 'textToConvert',
							padding: 10,
						}, {
							xtype: 'container',
							layout: 'box',
							margin: 20,
							items: [
								{
									width: 120,
									xtype: 'button',
									action: 'submitText',
									width: 120,
									text: 'Submit',
									disabled: true
								}, {
									xtype: 'container',
									html: '<a id="linkDiv" disabled>Click to play converted speech</a>'
								}
							]
						}
					]
				}
			]
		}
	}
});


