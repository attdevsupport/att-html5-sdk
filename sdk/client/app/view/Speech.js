/**
 * The Speech view exercises the SpeechToText API. This view allows the user to choose an audio file (wave/amr) and send it to AT&T API to get the 
 * text translation of the message. Since we don't have a way to use a file from a mobile device, we are using a single file stored on server side to exercise the API.
 */
Ext.define('KitchenSink.view.Speech',{
    extend: 'Ext.Container',
    xtype: 'speech',
    
    config: {
        title: 'Speech',
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'center'
        },
        items: [{
            xtype: 'container',
            width: '80%',
            items:[{
                xtype: 'container',
                html: '<strong>Speech file format constraints:</strong><ul><li>16 bit PCM WAV, single channel, 8 kHz sampling</li><li>AMR (narrowband), 12.2 kbits/s, 8 kHz sampling</li></ul>',
                styleHtmlContent: true
            },{
                xtype: 'button',
                text: 'Speech To Text',
                action: 'sendspeech',
                style: 'margin-bottom: 10px;'
            }]
        }],
        control: {
            'button[action=sendspeech]': {
                'tap': 'onSendSpeech'
            }
        }
    },
    
    /**
     * Sets the file name and fires the apicall event 
     */
    onSendSpeech: function() {
        this.fireEvent('apicall', this, {
            method: 'speechToText',
            fileName: 'Test.wav',
            streamed: true,
            success: function(response){
                console.log(response);
            },
            failure: function(response){
                console.log(response);
            }
        }); 
    }
    
});