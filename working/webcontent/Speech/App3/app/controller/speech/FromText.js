/**
 * Controller that interacts with the Basic Speech to Text application.
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
		debugger;
		var context = new webkitAudioContext();
		var source = context.createBufferSource(); // Create Sound Source
		var buffer = context.createBuffer(this.sound, true); // Create Mono Source Buffer from Raw Binary
		source.buffer = buffer; // Add Buffered Data to Object
		source.connect(context.destination); // Connect Sound Source to Output
		source.noteOn(context.currentTime); // Play the Source when Triggered
	},
	onSubmitText: function () {
		this.controls.buttonSubmit.setDisabled(true);
		var resultWindow = document.getElementById("resultWindow");
		var me = this;
		AttApiClient.textToSpeech(
			this.controls.text._value,
			function (data) {
				debugger;
				var context = new webkitAudioContext();
				context.decodeAudioData(data, function (buffer) {
					me.source = context.createBufferSource(); 
					me.source.buffer = buffer;
					me.source.connect(context.destination); 
				});
				resultWindow.innerText = "Success, click button to play";
				me.controls.buttonPlay.setDisabled(false);
			},
			function (result) {
				me.controls.buttonPlay.setDisabled(true); resultWindow.innerText = JSON.stringify(result);
			},
			function (result) {
				alert("error");
			}
		);

		function playWave() {
			me.source.start();
		}
	}
});