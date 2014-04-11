/**
 * Controller that interacts with the Advertisements (ADS) application.
 */
Ext.define('SampleApp.controller.sample.Advertisements', {
    extend: 'Ext.app.Controller',
    
    requires: [
       'SampleApp.Config',
       'Ext.MessageBox'
    ],
    
    config: {
        refs: {
            view: 'att-sample-ads',
            form: 'att-sample-ads formpanel'
        },
        
        control: {
            'att-sample-ads button[action=showad]' : {
                'tap' : 'onShowPhoneAd'
            }
        }
    },
   
    /**
     * Handler for the Show Advertisement button.
     */
    onShowPhoneAd: function() {
        var me = this,
            view = me.getView(),
            data = {
                Udid: 'unique opaque anonymous user identifier',
                Category: Ext.getCmp('dataCategory').getValue(),
                UserAgent: Ext.getCmp('dataUserAgent').getValue(),
                AgeGroup: Ext.getCmp('dataAgeGroup').getValue(),
                Gender: Ext.getCmp('dataGender').getValue()
            };
        
        view.setMasked(true);
        
        AttApiClient.Advertising.getAd(data,
            function(response){
                view.setMasked(false);
                var adImage = Ext.getCmp('adImage');
                adImage.setSrc(response.AdsResponse.Ads.ImageUrl.Image);
            },
            function(error){
                view.setMasked(false);
                var adFail = Ext.getCmp('adFail');
                adFail.setValue("Failed");
            }
        );
    }
});
