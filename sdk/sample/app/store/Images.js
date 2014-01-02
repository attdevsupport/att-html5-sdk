/**
 * Store used to hold Image models.
 */
Ext.define('SampleApp.store.Images', {
    extend: 'Ext.data.Store',
    requires: ['SampleApp.Config'],
    
    config: {
        autoLoad: true,
        model: 'SampleApp.model.Image',

        proxy   : {
            type    : 'ajax',
            reader  : {
                type : 'json',
                rootProperty : 'galleryImages',
                totalProperty : 'galleryCount'
            }
        }
    },
    
    applyProxy: function(proxy, currentProxy) {
        var cfg = SampleApp.Config;
        
        proxy = this.callParent(arguments);
        //set proxy url here since we read it from configuration
        proxy.setUrl(cfg.imageDataUri);
       
        return proxy;
    }
});