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
			text: 'textareafield[name=textToConvert]'
		},
		control: {
			'button[action=submitText]': { 'tap': 'onSubmitText' },
			'textareafield[name=textToConvert]': { 'change': 'onTextChange', 'keyup': 'onTextChange' }
		}
	},
	controls: {},
	onTextChange: function () {
		this.setResult("");
		this.controls.buttonSubmit.setDisabled(this.controls.text._value.length < 1);
	},
	launch: function () {

		this.controls = {
			buttonSubmit: this.getButtonSubmit(),
			text: this.getText()
		};
	},
	onPlaySound: function () {
		var contextType = window.AudioContext || window.webkitAudioContext;
		var context = new contextType();
		var reader = new FileReader();
		reader.addEventListener("loadend", function() {
			context.decodeAudioData(reader.result, function(buffer){ 
				var source = context.createBufferSource();
				source.buffer = buffer;
	      			source.connect(context.destination);
				source.start();
			})
		});
		reader.readAsArrayBuffer(this.audioBlob);
	},
	setResult: function(text) {
		document.getElementById("resultWindow").innerHTML = text;
	},
	onSubmitText: function () {
		this.controls.buttonSubmit.setDisabled(true);
		var me = this;

		AttApiClient.textToSpeech(
			this.controls.text._value,
			function (blob) {
				me.audioBlob = blob;
                var audioControl = document.querySelector("#audioControls audio");
                audioControl.src = URL.createObjectURL(blob);
                audioControl.style.display = 'inline';
				me.setResult("Success, click Play to hear the converted audio");
			},
			function () {
				me.setResult("Error decoding audio");
			}
		);
	}
});