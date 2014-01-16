(function(){
    try {
        /**
         *
         * Store used to hold MIM Message Headers model instances.
         *
         */
        Ext.define('KitchenSink.store.MessageHeaders', {
            extend : 'Ext.data.Store',
            requires: ['Ext.data.proxy.LocalStorage'],
            
            config:{
                autoLoad: true,
                
                sorters  : [
                    {
                        property : 'MessageId',
                        direction: 'DESC'
                    }
                ],
                /**
                 * Uses the SampleApp.model.SinglePayTransaction model 
                 */        
                model    : 'KitchenSink.model.MessageHeader',
                /**
                 * Uses a localstorage proxy
                 */
                proxy   : {
                    type    : 'localstorage',
                    id      : 'att-sample-mim-headers'
                }
            }
        });
        
        
    } catch(e){
        // if we get here it is usually due to private browsing
        // turned on in iOS and local/session storage doesn't like that
    }
})();