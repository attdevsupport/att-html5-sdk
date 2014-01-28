/**
 *
 * User Interface for the Speech to Text Basic application.
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
			xtype: 'formpanel',
			layout: 'hbox',
			defaults: { margin: 20 },
			items: [
                {
                	xtype: 'container',
                	flex: 1,
                	defaults: {margin: 0},
                	items: [
						{
							xtype: 'fieldset',
							layout: 'hbox',
							title: 'First, Record an Audio File in Your Browser',

							defaults: { flex: 1, margin: 20, width: 120 },
							items: [
                				{
                					xtype: 'button',
                					id: 'start',
                					text: 'Start'
                				}, {
                					xtype: 'button',
                					id: 'stop',
                					text: 'Stop'
                				}, {
                					xtype: 'button',
                					text: 'Clear'
                				}, {
                					xtype: 'button',
                					text: 'Play'
                				}
							]
						}, {
							xtype: 'fieldset',
							title: 'Next, submit audio to be converted to text',
							layout: 'vbox',
							items: [
                				{
                					margin: 20, 
                					width: 120,
                					xtype: 'button',
                					width: 120,
                					text: 'Submit'
                				}, {
                					xtype: 'fieldset',
                					title: 'Result',
                					margin: 20,
                					height: 200
                				}
							]
						}
                	]
                }, {
                	xtype: 'fieldset',
                	title: "Log Window",
                	marginLeft: 100,
                	height: 200,
                	flex: 2,
                	padding: 10,
                	html: "<p>yadda</div>"
                }
			]
		};
	}
});
