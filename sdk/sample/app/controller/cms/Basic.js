/**
 * Controller that interacts with the Basic CMS application.
 */
Ext.define('SampleApp.controller.cms.Basic', {
	extend: 'Ext.app.Controller',

    requires: [
       'Att.Provider',
       'Att.ApiResults',
       'SampleApp.Config',
       'Ext.MessageBox'
    ],

    config: {
        provider: undefined,
        sessionId: undefined,
        refs: {
            view: 'att-cms-basic',

            signalbtn: 'att-cms-basic button[action=sendsignal]',

            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-cms-basic': {
                'initialize': 'loadScript'
            },
            'att-cms-basic selectfield': {
                'change': 'updateDescription'
            },
            'att-cms-basic button[action=createsession]': {
                'tap': 'onCreateSession'
            },
            'att-cms-basic button[action=sendsignal]':{
                'tap': 'onSendSignal'
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
    
    updateDescription: function(field) {
        var view = this.getView(),
            desc = field.getRecord().raw.description;

        view.down('container[name=functionDescription]').setHtml(desc);
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
     * Handler for Create Session button.
     */
    onCreateSession: function(btn, event, eOpts){
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            cfg = SampleApp.Config,
            signalbtn = me.getSignalbtn();
        
        view.setMasked(true);
        view.down('textfield[name=sessionId]').setValue('');
        view.down('selectfield[name=signal]').reset();
        var form = btn.up('formpanel').getValues();

        signalbtn.disable();

        provider.cmsCreateSession({
			parameters: form, 
            success: function(response){
                view.setMasked(false);
                view.down('textfield[name=sessionId]').setValue(response.id);
                me.setSessionId(response.id);
                signalbtn.enable();
                me.showResponseView(true, response);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },
    
    /**
     * Handler for sending a signal to an active CMS session.
     */
    onSendSignal: function(btn, event, eOpts){
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            form = btn.up('formpanel').getValues(),
            signal = form.signal,
            sessionId = me.getSessionId();

        view.setMasked(true);
        
        provider.cmsSendSignal({
            sessionId: sessionId,
            signal: signal,
            success: function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },

    //private
    loadScript: function() {
        var view = this.getView();
        
        Ext.Ajax.request({
            url : 'assets/data/cmsScripts/sample.js',
            success : function(response, opts) {
                view.down('panel[name=script]').setHtml(response.responseText);
            },
            failure : function(response, opts) {
                Ext.Msg.alert('Error', 'There was an error loading the sample script file.');
            }
        });
    }    

});