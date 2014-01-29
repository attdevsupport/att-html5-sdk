(function(){
    try {
        /**
         *
         * Store used to hold MIM Message Headers model instances.
         *
         */
        Ext.define('SampleApp.store.MessageHeaders', {
            extend : 'Ext.data.Store',
            requires: ['Ext.data.proxy.LocalStorage'],
            
            config:{
                autoLoad: true,
                
//                sorters  : [
//                    {
//                        property : 'Received',
//                        direction: 'ASC'
 //                   }
 //               ],
                /**
                 * Uses the SampleApp.model.SinglePayTransaction model 
                 */        
                model    : 'SampleApp.model.MessageHeader',
                /**
                 * Uses a localstorage proxy
                 */
                proxy   : {
                    type    : 'localstorage',
                    id      : 'att-sample-mim-headers',
                    reader  : {
                        type: 'json',
                        rootProperty : 'Headers'
                    }
                }
            }
        });
        
        
    } catch(e){
        // if we get here it is usually due to private browsing
        // turned on in iOS and local/session storage doesn't like that
    }
})();