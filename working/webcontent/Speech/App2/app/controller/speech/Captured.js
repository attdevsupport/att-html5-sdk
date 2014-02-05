/**
 * Controller that interacts with the Speech to Text Captured application.
 */
Ext.define('SampleApp.controller.speech.Captured', {
	extend: 'Ext.app.Controller',

	requires: [
		'Att.Provider',
		'Att.ApiResults',
		'SampleApp.Config'
	],

	config: {
		provider: undefined,
		refs: {
			view: 'att-speech-captured',
			buttonSubmit:	'button[action=submitAudio]',
			buttonStart:	'button[action=startRecording]',
			buttonStop:		'button[action=stopButton]',
			buttonPlay:		'button[action=playRecording]',
			buttonClear:	'button[action=clearRecording]',
		},
		control: {
			'button[action=submitAudio]'	:	{'tap': 'onSubmitAudio'		},
			'button[action=startRecording]'	:	{'tap': 'onStartRecording'	},
			'button[action=stopButton]'		:	{'tap': 'onStopButton'		},
			'button[action=clearRecording]'	:	{'tap': 'onClearRecording'	},
			'button[action=playRecording]'	:	{'tap': 'onPlayRecording'	}
		}
	},
	launch: function () {
		this.buttons = {
			Start: this.getButtonStart(),
			Stop: this.getButtonStop(),
			Play: this.getButtonPlay(),
			Clear: this.getButtonClear(),
			Submit: this.getButtonSubmit()
		};
		this.logWindow = document.getElementById("logWindow");
		this.responseWindow = document.getElementById("responseWindow");
		this.getContext();
	},
	log: function (e, data) {
		var p = document.createElement("p");
		p.innerText = e + " " + (data || '');
		this.logWindow.appendChild(p);
		p.scrollIntoView();
	},
	isRecording: false,
	hasRecording: false,
	isPlaying: false,
	toggleButtons: function (recording) {
		this.isRecording = recording;
		this.buttons.Start.setDisabled(this.isRecording || this.isPlaying);
		this.buttons.Stop.setDisabled(! (this.isRecording || this.isPlaying) );
		this.buttons.Clear.setDisabled(this.isRecording || this.isPlaying || !this.hasRecording);
		this.buttons.Play.setDisabled(this.isRecording || this.isPlaying || !this.hasRecording);
		this.buttons.Submit.setDisabled(this.isRecording || this.isPlaying || !this.hasRecording);
	},
	onStartRecording: function () {
		this.recorder.record();
		this.toggleButtons(true);
		this.log('Recording...');
	},
	onStopButton: function () {
		if (this.isRecording) {
			this.recorder.stop();
			this.hasRecording = true;
			this.toggleButtons(false);
			this.log('Stopped recording.');
		}
		if (this.isPlaying) {
			this.audioSource.stop();	
			this.isPlaying = false;
			this.log('Stopped playing');
		}
		this.toggleButtons(false);
	},
	onPlayRecording: function play() {
		var me = this;
		this.isPlaying = true;
		this.recorder.getBuffer(function (buffers) {
			me.audioSource = me.audioContext.createBufferSource();
			var buffer = me.audioContext.createBuffer(2, buffers[0].length, me.audioContext.sampleRate);
			buffer.getChannelData(0).set(buffers[0]);
			buffer.getChannelData(1).set(buffers[1]);
			me.audioSource.buffer = buffer;
			me.audioSource.connect(me.audioContext.destination);
			me.audioSource.start(0);
			me.audioSource.onended = function () {
				me.onStopButton();
			};
		});

		this.toggleButtons(false);
		this.log("Playing back audio.");
	},
	onClearRecording: function () {
		this.recorder.clear();
		this.hasRecording = false;
		this.toggleButtons(false);
	},
	/**
	*  Submits audio to att-api-client speechToText
	*
	*/
	onSubmitAudio: function () {
		
		var me = this;
		me.recorder.exportWAV(function (blob) {
			AttApiClient.speechToText(
				blob,
				function (response) {
					displayResponse(true, response);
				},
				function (error) {
					displayResponse(false, error);
				}
			);
		});
		function displayResponse(success, response) {
			var p = document.createElement("p");
			p.innerText = JSON.stringify(response);
			p.className = success ? "success" : "error";
			me.responseWindow.innerHTML = "";
			me.responseWindow.appendChild(p);
		}
	},
	/**
     * internal function to obtain the audioContext
     */
	getContext: function () {
		try {
			// webkit shim
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
			window.URL = window.URL || window.webkitURL;
			this.audioContext = new AudioContext;
			this.log('Audio context set up.');
			this.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
		} catch (e) {
			this.log('No web audio support in this browser!');
		}
		var me = this;
		navigator.getUserMedia({ audio: true }, startUserMedia, err);
		
		function err(e) {
			me.log('No live audio input: ' + e);
		}

		function startUserMedia(stream) {
			var input = me.audioContext.createMediaStreamSource(stream);
			me.log('Media stream created.');
			var zeroGain = me.audioContext.createGain();
			zeroGain.gain.value = 0;
			input.connect(zeroGain);
			me.log('Input connected to zero gain (mute local audio).');
			zeroGain.connect(me.audioContext.destination);
			me.log('zero gain (mute) connected to audio context destination.');
			me.recorder = new Recorder(input, { workerPath: '../../lib/js/recorderWorker.js' } );
			me.log('Recorder initialized.');
			me.toggleButtons(false);
		}
	}
});