Ext.define('SampleApp.store.SpeechFiles', {
    extend: 'Ext.data.Store',
    config: {
        model: 'SampleApp.model.SpeechFile',
        data: [
           { label: 'Bananas.wav',    name: 'Bananas.wav', type: 'audio/x-wav'},
           { label: 'Bananas.amr',    name: 'Bananas.amr', type: 'audio/amr'},
           { label: 'Starbucks.wav',  name: 'Starbucks.wav', type: 'audio/x-wav'},
           { label: 'Starbucks.amr',  name: 'Starbucks.amr', type: 'audio/amr'},
           { label: 'Test/8khz AMR',  name: 'test-8khz-amrnb-MR475.amr', type: 'audio/amr' },
           { label: 'Test/8khz SPX',  name: 'test1_8khz_speex.spx', type: 'audio/x-speex'},
           { label: 'Test/8khz WAV',  name: 'test-8khz-linear-pcm.wav', type: 'audio/x-wav' },
           { label: 'Test/16khz AMR', name: 'test-16khz.awb', type: 'audio/amr-wb' },
           { label: 'Test/16khz SPX', name: 'test-16khz peexwb-16.spx', type: 'audio/x-speex' },
           { label: 'Test/16khz WAV', name: 'test-16khz-linear-pcm.wav', type: 'audio/x-wav' }        
       ]
    }
});