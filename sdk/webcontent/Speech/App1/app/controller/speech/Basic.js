/**
 * Controller that interacts with the Basic Speech to Text application.
 */
Ext.define('SampleApp.controller.speech.Basic', {
    extend: 'Ext.app.Controller',

    requires: [
       'Att.ApiResults',
       'SampleApp.Config'
    ],

    config: {
        refs: {
            view: 'att-speech-basic',
            formContext:        'selectfield[name=context]',
            formCustomContext:  'selectfield[name=customContext]',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        control: {
            'att-speech-basic button[action=sendspeech]': {
                'tap': 'onSendSpeech'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            },
            'att-speech-basic checkboxfield[name=customDictionary]': {
                'change' : 'onUseDictionary'
            }
        }
    },

    onUseDictionary: function (o) {
        this.getFormContext().setHidden(o._checked);
        this.getFormCustomContext().setHidden(!o._checked);
    },
    showResponseView: function (success, response) {
        var responseView = this.getResponseView();

        Ext.Viewport.add(responseView);

        responseView.setData({
            success: success,
            results: JSON.stringify(response, null, '\t')
        });

        responseView.show();
    },

    onCloseResponseView: function () {
        this.getResponseView().hide();
    },

    /**
     * Handler for Send speech button
     */
    onSendSpeech: function () {
        var me = this,
            view = me.getView(),
            form = view.down('formpanel').getValues(),
            fileName = form.file,
            record = Ext.getStore('SpeechFiles').findRecord("name", fileName);

        view.setMasked(true);
        var data = {
            filename: record.get('name'),
            chunked: !!form.chunked,
            context: form.customDictionary == true ? form.customContext : form.context,
            xargs: SampleApp.Config.speechXArgs
        };

        var method = form.customDictionary == true ? "serverSpeechToTextCustom" : "serverSpeechToText";
        AttApiClient.Speech[method](
            data,
            function (response) {
                view.setMasked(false);
                me.showResponseView(true, response);
            },
            function (response) {
                view.setMasked(false);
                me.showResponseView(false, response);
            }
        )
    }
});
