/**
 * Controller that interacts with the Basic Speech to Text application.
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
			buttonSubmit: 'button[action=submitAudio]',
			buttonStart: 'button[action=startRecording]',
			buttonStop: 'button[action=stopButton]',
			buttonPlay: 'button[action=playRecording]',
			buttonClear: 'button[action=clearRecording]',
		},
		control: {
			'button[action=submitAudio]'	:	{'tap': 'onSubmitAudio'		},
			'button[action=startRecording]'	:	{'tap': 'onStartRecording'	},
			'button[action=stopButton]'	:	{'tap': 'onStopButton'	},
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
		this.getContext();
		this.toggleButtons(false);
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
		var that = this;
		this.isPlaying = true;
		this.recorder.getBuffer(function (buffers) {
			that.audioSource = that.audioContext.createBufferSource();
			var newBuffer = that.audioContext.createBuffer(2, buffers[0].length, that.audioContext.sampleRate);
			newBuffer.getChannelData(0).set(buffers[0]);
			newBuffer.getChannelData(1).set(buffers[1]);
			that.audioSource.buffer = newBuffer;
			that.audioSource.connect(that.audioContext.destination);
			that.audioSource.start(0);
			checkPlayback();
		});
		

		this.toggleButtons(false);
		this.log("Playing back audio.");

		var n = 10;
		function checkPlayback() {
			that.log("Playback state: " + that.audioSource.playbackState)
			if (that.audioSource.playbackState == 3 || n < 0) {
				that.onStopButton();
				n--;
				if (that.playTimer) { clearTimeout(that.playTimer); }
			} else {
				that.playTimer = setTimeout(checkPlayback, 500);
			}
		}
	},
	onClearRecording: function () {
		this.recorder.clear();
		this.hasRecording = false;
		this.toggleButtons(false);
	},
	onSubmitAudio: function () {
		alert(" not yet implemented");
		//recorder.exportWAV(function (blob) {
			
		//})
	},
	createDownloadLink: function () {
		recorder.exportWAV(function (blob) {
			var url = URL.createObjectURL(blob);
			var li = document.createElement('li');
			var au = document.createElement('audio');
			var hf = document.createElement('a');

			au.controls = true;
			au.src = url;
			hf.href = url;
			hf.download = new Date().toISOString() + '.wav';
			hf.innerHTML = hf.download;
			li.appendChild(au);
			li.appendChild(hf);
			recordingslist.appendChild(li);
		});
	},
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
		var that = this;
		navigator.getUserMedia({ audio: true }, startUserMedia, err);
		
		function err(e) {
			that.log('No live audio input: ' + e);
		}

		function startUserMedia (stream) {
			var input = that.audioContext.createMediaStreamSource(stream);
			that.log('Media stream created.');
			var zeroGain = that.audioContext.createGain();
			zeroGain.gain.value = 0;
			input.connect(zeroGain);
			that.log('Input connected to zero gain (mute local audio).');
			zeroGain.connect(that.audioContext.destination);
			that.log('zero gain (mute) connected to audio context destination.');
			that.recorder = new Recorder(input, { workerPath: '../../lib/js/recorderWorker.js' } );
			that.log('Recorder initialized.');
		}
	}
});