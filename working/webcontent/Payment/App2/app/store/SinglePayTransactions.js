(function(){
    try {
        /**
         *
         * Store used to hold SinglePayTransaction model instances.
         *
         */
        Ext.define('SampleApp.store.SinglePayTransactions', {
            extend : 'Ext.data.Store',
            requires: ['Ext.data.proxy.LocalStorage'],
            
            config:{
                autoLoad: true,
                autoSync: true,
                sorters  : [
                    {
                        property : 'id',
                        direction: 'DESC'
                    }
                ],
                /**
                 * Uses the SampleApp.model.SinglePayTransaction model 
                 */        
                model    : 'SampleApp.model.SinglePayTransaction',
                /**
                 * Uses a localstorage proxy
                 */
                proxy   : {
                    type    : 'localstorage',
                    id      : 'att-sample-singlepay-transactions'
                }
            }
        });
        
        
    } catch(e){
        // if we get here it is usually due to private browsing
        // turned on in iOS and local/session storage doesn't like that
    }
})();