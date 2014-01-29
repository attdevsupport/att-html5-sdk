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
			buttonStart: 'button[action=startRecording]',
			buttonStop: 'button[action=stopRecording]',
			buttonPlay: 'button[action=playRecording]',
			buttonClear: 'button[action=clearRecording]',
		},
		control: {
			'button[action=submitAudio]'	:	{'tap': 'onSubmitAudio'		},
			'button[action=startRecording]'	:	{'tap': 'onStartRecording'	},
			'button[action=stopRecording]'	:	{'tap': 'onStopRecording'	},
			'button[action=clearRecording]'	:	{'tap': 'onClearRecording'	},
			'button[action=playRecording]'	:	{'tap': 'onPlayRecording'	}
		}
	},
	launch: function () {
		this.buttons = {
			Start: this.getButtonStart(),
			Stop: this.getButtonStop(),
			Play: this.getButtonPlay(),
			Clear: this.getButtonClear()
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
	hasRecording: false,
	isPlaying: false,
	toggleButtons: function (recording) {
		isRecording = recording;
		this.buttons.Start.setDisabled(isRecording);
		this.buttons.Stop.setDisabled(!isRecording);
		this.buttons.Clear.setDisabled(isRecording || ! ( this.hasRecording || this.isPlaying) );
		this.buttons.Play.setDisabled(isRecording || !this.hasRecording);
	},
	onStartRecording: function () {
		this.recorder.record();
		this.toggleButtons(true);
		this.log('Recording...');
	},
	onStopRecording: function () {
		this.recorder.stop();
		this.hasRecording = true;
		this.toggleButtons(false);
		this.log('Stopped recording.');
	},
	onPlayRecording: function play() {

		var that = this;
		if (this.isPlaying) {
			this.newSource.stop();	
			this.isPlaying = false;
		} else {
			this.isPlaying = true;
			this.recorder.getBuffer(function (buffers) {
				that.newSource = this.audioContext.createBufferSource();
				var newBuffer = this.audioContext.createBuffer(2, buffers[0].length, this.audioContext.sampleRate);
				newBuffer.getChannelData(0).set(buffers[0]);
				newBuffer.getChannelData(1).set(buffers[1]);
				that.newSource.buffer = newBuffer;
				that.newSource.connect(this.audioContext.destination);
				that.newSource.start(0);
			});
		}
	},
	onClearRecording: function () {
		this.recorder.clear();
		this.hasRecording = false;
		this.toggleButtons(false);
	},
	onSubmitAudio: function() {
		recorder.exportWAV(function (blob) {
			alert(" not yet implemented");
		})
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
			input.connect(that.audioContext.destination);
			that.log('Input connected to audio context destination.');
			that.recorder = new Recorder(input, { workerPath: '../../lib/js/recorderWorker.js' } );
			that.log('Recorder initialized.');
		}
	}
});