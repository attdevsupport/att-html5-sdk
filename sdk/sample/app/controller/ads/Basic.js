/**
 * Controller that interacts with the Basic Ads application.
 */
Ext.define('SampleApp.controller.ads.Basic', {
    extend: 'Ext.app.Controller',

    requires: [
       'Att.Provider',
       'Att.ApiResults',
       'SampleApp.Config'
    ],

    /**
     * Configuration for the Ads sample app controller. This sets up all the references
     * for the controller as well as define place holders to keep track of the number
     * of messages returned and the current index cursor.
     */
    
    config: {
        provider: undefined,
        headerCount: 0,
        indexCursor: 0,

        refs: {
            view: 'att-ads-basic',
            form: 'att-ads-basic formpanel',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-ads-basic button[action=getad]': {
                'tap': 'onGetAdvertisment'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            }
        }
    },
    
    /**
     * This method is called internally when provider property is set during config initialization.
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
    
    /**
     * Display raw response value received from the AT&T getMessageHeader API call to the user.
     */
    showResponseView: function(success, response, url) {
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
     * Handler for get advertisment button in Ads application. 
     * Obtain Ad from the AT&T API and display response to end user. Ad is based
     * on the criteria submitted for the ad.
     */
    onGetAdvertisment: function(){
        var me = this,
            view = me.getView(),
            options = me.getForm().getValues(),
            provider = me.getProvider(),
            adUrl = view.down('container[name=adUrl]');

        if (options.mmasize) {
            var wh = options.mmasize.split(",");
            delete options.mmasize;
            options.MaxWidth = options.MinWidth = wh[0];
            options.MaxHeight = options.MinHeight = wh[1];
        }
        
        view.setMasked(true);
        provider.getAd({
            udid: '123456789012345678901234567890',
            parameters: options,
            success: function(response){
                view.setMasked(false);
                if(response){
                    adUrl.setData({
                        type: response.AdsResponse.Ads.Type,
                        url: response.AdsResponse.Ads.ClickUrl,
                        content: response.AdsResponse.Ads.Content
                    });
                }else{
                    adUrl.setData({});
                }
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
    }

});