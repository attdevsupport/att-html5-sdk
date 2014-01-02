Ext.define('SpeechSample.controller.Speech', {
    extend : 'Ext.app.Controller',
    
    requires : [
        'Att.Provider',
        'Ext.MessageBox'
    ],
    
    config : {
        /**
         * reference to Att.Provider instance
         */
        provider: undefined,
        
        refs : {
            view : 'speech-view'
        },
        
        control : {
            'button[action=speechtotext]' : {
                'tap': 'onSpeechToText'
            }
        }
    },
    
    /**
     * Gets called internally when provider property is set during config initialization.
     * We'll initialize here our Att.Provider instance to perform the API calls. 
     * @param provider the value we set in config option for this property.
     * @returns
     */
    applyProvider : function(provider) {
        if (!provider) {
            provider = Ext.create('Att.Provider',{
                apiBasePath: '/att' 
            });
        }
        return provider;
    },
    
    /**
     * 
     */
    onSpeechToText: function() {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            form = view.down('formpanel').getValues();
        
        view.setMasked(true);
        
        provider.speechToText({
            fileName: form.file,
            streamed: true,
            success: function(response){
                view.setMasked(false);
                if(response.recognition && response.recognition.status == "OK"){
                    Ext.Msg.alert("Hipothesis Text: " + response.recognition.nbest[0].hypothesis);
                }
            },
            failure: function(error){
                view.setMasked(false);
            }
        }); 
    }
});