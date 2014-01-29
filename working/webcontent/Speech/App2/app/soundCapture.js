var soundCapture = (function () {

	var audioContext;
	var logWindow;
	var isRecording = false;
	var buttons = {};
	var recorder;

	function log(e, data) {
		var p = document.createElement("p");
		p.innerText = e + " " + (data || '');
		logWindow.appendChild(p);
		p.scrollIntoView();
	}

	function toggleButtons(recording) {
		isRecording = recording;
		buttons.start.prop("disabled", isRecording);
		buttons.stop.prop("disabled", !isRecording);
	}

	function start() {
		recorder.record();
		toggleButtons(true);
		log('Recording...');
	}

	function stop() {
		recorder.stop();
		toggleButtons(false);
		log('Stopped recording.');
	}

	function play() {
		// create WAV download link using audio data blob
		createDownloadLink();
		recorder.clear();
	}

	function clear() {

	}

	function startUserMedia(stream) {
		var input = audioContext.createMediaStreamSource(stream);
		log('Media stream created.');

		input.connect(audioContext.destination);
		log('Input connected to audio context destination.');

		recorder = new Recorder(input);
		log('Recorder initialized.');
	}

	function createDownloadLink() {
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
	}

	function getContext() {
		try {
			// webkit shim
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
			window.URL = window.URL || window.webkitURL;
			audioContext = new AudioContext;
			log('Audio context set up.');
			log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));


		} catch (e) {
			alert('No web audio support in this browser!');
		}

		navigator.getUserMedia({
			audio: true
		}, startUserMedia, function (e) {
			log('No live audio input: ' + e);
		});
	}

	return {
		init: function (opts) {
			buttons = opts.buttons;
			toggleButtons(false);
		},
		start: start,
		stop: stop,
		getContext: getContext
	};

}());