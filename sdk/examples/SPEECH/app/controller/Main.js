Ext.define('MyApp.controller.Main', {
    extend : 'Ext.app.Controller',
    
    requires : [
        'Att.Provider',
        'Att.ApiResults',
        'Ext.MessageBox'
    ],
    
    config : {
        /**
         * reference to Att.Provider instance
         */
        provider: undefined,
        
        refs : {
            view : 'speech-view',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }            
        },
        
        control : {
            'button[action=speechtotext]' : {
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
    applyProvider : function(provider) {
        if (!provider) {
            provider = Ext.create('Att.Provider',{
                apiBasePath: '/att' 
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
        var me = this,
            view = me.getView();

        this.getResponseView().hide();
    },

    /**
     * Called when user clicks on the Speech to Text button. This method initiates a call to the SpeechToText API
     * and, if successful, shows the hypothesis of the speech content in text format. The method also displays the 
     * full JSON response from the API regardless of success or failure.
     */
    onSendSpeech: function() {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            form = view.down('formpanel').getValues();

        view.setMasked(true);
        
        provider.speechToText({
            fileName: form.file,
            fileContent: 'audio/x-wav',
            chunked: false,
            success: function(response){
                if(response.recognition && response.recognition.status == "OK"){
                    Ext.Msg.alert("Hypothesis Text: " + response.recognition.nbest[0].hypothesis);
                }
                me.showResponseView(true, response);
                view.setMasked(false);
            },
            failure: function(response){
                me.showResponseView(false, response);
                view.setMasked(false);
            }
        }); 
    }
});