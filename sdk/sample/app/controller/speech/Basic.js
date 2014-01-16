/**
 * Controller that interacts with the Basic Speech to Text application.
 */
Ext.define('SampleApp.controller.speech.Basic', {
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
        },
        
        control: {
            'att-speech-basic button[action=sendspeech]': {
                'tap': 'onSendSpeech'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            }
        }
    },
    
    /**
     * Gets called internally when provider property is set during config initialization.
     * We'll initialize here our Att.Provider instance to perform the API calls. 
     * @param provider the value we set in config option for this property.
     * @returns
     */
    applyProvider: function(provider) {
        if (!provider) {
            provider = Ext.create('Att.Provider',{
                apiBasePath: SampleApp.Config.apiBasePath
            });
        }

        return provider;
    },
    
    
    showResponseView: function(success, response){
        var responseView =  this.getResponseView();
       
        Ext.Viewport.add(responseView);
       
        responseView.setData({
            success: success,
            results: JSON.stringify(response, null, '\t')
        });
       
        responseView.show();    
    },
    
    onCloseResponseView: function(){
        this.getResponseView().hide();
    },
    
    /**
     * Handler for Send speech button
     */
    onSendSpeech: function(){
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            form = view.down('formpanel').getValues(),
            fileName = form.file,
            record = Ext.getStore('SpeechFiles').findRecord("name", fileName);
        
        view.setMasked(true);
        
        provider.speechToText({
            fileName: record.get('name'),
            fileContentType: record.get('type'),
            chunked: !!form.chunked,
            context: form.context,
            xarg: SampleApp.Config.speechXArgs,
            success: function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });        
        
    }

    
});