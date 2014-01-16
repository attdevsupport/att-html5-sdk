/**
 *
 * User Interface for the Speech to Text Basic application.
 *
 */
Ext.define('SampleApp.view.speech.Basic', {
    extend: 'Ext.Container',
    xtype: 'att-speech-basic',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer'
    ],

    config: {
        title: 'Basic Speech',
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },

    initialize: function() {
        this.add([
            {xtype: 'att-header'},
            this.buildForm(),
            {xtype: 'att-footer'}
        ]);
    },
   
    /**
     * Builds the UI components for Feature 1: Send Speech To Text.
     */
    buildForm: function(){
        return {
            xtype   : 'formpanel',
            itemId  : 'feature1',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 1: Speech to Text',
                    defaults : {
                        labelWidth : '40%'
                    },
                    items : [
                        {
                            xtype : 'fieldset',
                            title: 'Audio File',
                            items : [
                                {
                                    xtype: 'selectfield',
                                    label: 'Speech Context',
                                    name: 'context',
                                    options: [
                                        { text: 'Generic', value: 'Generic' },
                                        { text: 'TV', value: 'TV' },
                                        { text: 'Business Search', value: 'BusinessSearch' },
                                        { text: 'Web Search', value: 'Websearch' },
                                        { text: 'SMS', value: 'SMS' },
                                        { text: 'Voicemail', value: 'Voicemail' },
                                        { text: 'Question and Answer', value: 'QuestionAndAnswer' }
                                    ]
                                }, {
                                     xtype: 'selectfield',
                                     label: 'Choose File',
                                     name : 'file',
                                     store: 'SpeechFiles',
                                     displayField: 'label',
                                     valueField: 'name'
                                 }, {
                                    xtype: 'checkboxfield',
                                    label: 'Send Chunked',
                                    name: 'chunked'
                                 }, {
                                    xtype: 'textareafield',
                                    label: 'X-Arg',
                                    name: 'xarg',
                                    value: 'x-arg defined in config file',
                                    readOnly: true
                                 }
                            ]
                        }, 
                        {
                            xtype    : 'button',
                            ui       : 'action',
                            action   : 'sendspeech',
                            text     : 'Submit'
                        }
                    ]
                },{
                    xtype: 'container',
                    html: '<strong>Speech file format constraints:</strong> \
                        <ul> \
                           <li>16 bit PCM WAV, single channel, 8 kHz sampling</li> \
                           <li>16 bit PCM WAV, single channel, 16 kHz sampling</li> \
                           <li>AMR (narrowband), 12.2 kbit/s, 8 kHz sampling </li> \
                           <li>AMR-WB (wideband) is 12.65 kbit/s, 16khz sampling</li> \
                           <li>OGG - speex encoding, 8kHz sampling</li> \
                           <li>OGG - speex encoding, 16kHz sampling</li> \
                        </ul>',
                    styleHtmlContent: true
                }
            ]
        };    
    }
    
    
});