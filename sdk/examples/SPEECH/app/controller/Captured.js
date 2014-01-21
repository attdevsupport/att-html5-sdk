/**
 * Controller that interacts with the Basic Speech to Text application.
 */
Ext.define('SampleApp.controller.speech.BrowserCaptured', {
    extend: 'Ext.app.Controller',

    requires: [
       'Att.Provider',
       'Att.ApiResults',
       'SampleApp.Config'
    ],

    config: {
        provider: undefined,

        refs: {
            view: 'att-speech-basic',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        }
    }
});