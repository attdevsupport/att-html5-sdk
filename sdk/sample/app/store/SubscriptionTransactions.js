(function(){
    try {
        /**
         * @class SampleApp.store.SubscriptionTransactions
         *
         * Store used to hold SubscriptionTransaction model instances.
         *
         * @extends Ext.data.Store
         */
        Ext.define('SampleApp.store.SubscriptionTransactions', {
            extend : 'Ext.data.Store',

            config: {
                autoLoad: true,
                autoSync: true,
                sorters  : [
                    {
                        property : 'id',
                        direction: 'DESC'
                    }
                ],
                model    : 'SampleApp.model.SubscriptionTransaction',
                proxy    : {
                    type    : 'localstorage',
                    id      : 'att-sample-subscription-transactions'
                }
            }
            
        });
    } catch(e){
        // if we get here it is usually due to private browsing
        // turned on in iOS and local/session storage doesn't like that
    }
})();