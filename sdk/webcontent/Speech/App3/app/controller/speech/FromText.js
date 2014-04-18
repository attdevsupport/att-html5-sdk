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
        this.setResult("");
        this.controls.buttonPlay.setDisabled(true);
        var me = this;
        setTimeout(function(){
            me.controls.buttonSubmit.setDisabled(me.controls.text._value.length < 1);
        }, 0);
    },
    launch: function () {

        this.controls = {
            buttonSubmit: this.getButtonSubmit(),
            buttonPlay: this.getButtonPlay(),
            text: this.getText()
        };
        
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        this.canPlayAudio = window.AudioContext !== undefined;
        if (this.canPlayAudio) {
            document.getElementById('noAudioContextError').style.display = 'none';
            this.getAudioContext();
        } else {
            this.controls.text.setReadOnly(true);
        }
    },
    onPlaySound: function () {

        var source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    },
    setResult: function(text) {
        document.getElementById("resultWindow").innerHTML = text;
    },
    audioContext: null,
    getAudioContext: function() {
        if (this.audioContext == null) {
            this.audioContext = new AudioContext();
        }
    },
    onSubmitText: function () {
        this.controls.buttonSubmit.setDisabled(true);
        var me = this;

        AttApiClient.Speech.textToSpeech(
            this.controls.text._value,
            function (blob) {
                
                me.getAudioContext();
                var reader = new FileReader();
                reader.addEventListener("loadend", function() {
                    me.audioContext.decodeAudioData(reader.result, function(buffer){ 
                        me.audioBuffer = buffer;
                        me.controls.buttonPlay.setDisabled(false);
                        me.setResult("Success, click Play to hear the converted audio");
                    })
                });
                reader.readAsArrayBuffer(blob);
            },
            function (error) {
                me.setResult(error);
            }
        );
    }
});