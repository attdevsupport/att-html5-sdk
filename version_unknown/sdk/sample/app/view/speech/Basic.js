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
        'SampleApp.view.Footer'
    ],

    config: {
        title: 'Basic Speech',
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },

    initialize: function() {
        this.add([
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
                                     label: 'Choose File',
                                     name : 'file',
                                     options: [
                                         {text: 'Bananas.wav',  value: 'Bananas.wav'},
                                         {text: 'Bananas.amr', value: 'Bananas.amr'},
                                         {text: 'Starbucks.wav',  value: 'Starbucks.wav'},
                                         {text: 'Starbucks.amr', value: 'Starbucks.amr'}
                                     ]
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
                    html: '<strong>Speech file format constraints:</strong><ul><li>16 bit PCM WAV, single channel, 8 kHz sampling</li><li>AMR (narrowband), 12.2 kbits/s, 8 kHz sampling</li></ul>',
                    styleHtmlContent: true
                }
            ]
        };    
    }
    
});