/**
 *
 * User Interface for the Text to Speech Example application.
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
     * Builds the UI components for Feature 1: Text to Speech Example.
     */
	buildForm: function () {
		return {

			xtype: 'formpanel',
			defaults: { margin: '3%', width: '93%', fontsize: '2%' , maxWidth: 600 },
			items: [
				{
					xtype: 'fieldset',
					title: 'Type text below to convert to speech',
					layout: 'vbox',
					items: [
						{
							xtype: 'textareafield',
							name: 'textToConvert',
							id: 'textToConvert',
							padding: '2%',
						}, {
							xtype: 'container',
							layout: 'hbox',
							defaults: {margin:'2%', fontsize:'2%'},
							items: [
								{
									xtype: 'button',
									action: 'submitText',
									id: 'submitText',
									text: 'Submit',
									disabled: true
								}, {
									xtype: 'button',
									action: 'playConvertedSpeech',
									text: "Play converted speech",
									disabled: true
								}
							]
						}, {
							xtype: 'fieldset',
							title: 'Result',
							margin: 20,
							height: 200,
							html: '<div class="logWindow"><p id="resultWindow"></p></div>'
						}
					]
				}
			]
		}
	}
});


