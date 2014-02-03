/**
 * Controller that interacts with the Text to Speech application.
 */
Ext.define('SampleApp.controller.speech.FromText', {
	extend: 'Ext.app.Controller',

	requires: [
		'Att.Provider',
		'Att.ApiResults',
		'SampleApp.Config'
	],

	config: {
		provider: undefined,
		refs: {
			view: 'att-speech-fromtext',
			buttonSubmit: 'button[action=submitText]',
			buttonPlay: 'button[action=playConvertedSpeech]',
			text: 'textareafield[name=textToConvert]'
		},
		control: {
			'button[action=submitText]': { 'tap': 'onSubmitText' },
			'button[action=playConvertedSpeech]': { 'tap': 'onPlaySound' },
			'textareafield[name=textToConvert]': { 'change': 'onTextChange', 'keyup': 'onTextChange' }
		}
	},
	controls: {},
	onTextChange: function () {
		this.controls.buttonSubmit.setDisabled(this.controls.text._value.length < 1);
	},
	launch: function () {

		this.controls = {
			buttonSubmit: this.getButtonSubmit(),
			buttonPlay: this.getButtonPlay(),
			text: this.getText()
		};
	},
	onPlaySound: function () {
		this.source.start();
	},
	onSubmitText: function () {
		this.controls.buttonSubmit.setDisabled(true);
		var resultWindow = document.getElementById("resultWindow");
		var me = this;

		AttApiClient.textToSpeech(
			this.controls.text._value,
			function (source) {
				me.source = source;
				me.controls.buttonPlay.setDisabled(false);
				resultWindow.innerHTML = "Success, click Play to hear the converted audio";
			},
			function () {
				resultWindow.innerHTML = "Error decoding audio";
			}
		);
	}
});