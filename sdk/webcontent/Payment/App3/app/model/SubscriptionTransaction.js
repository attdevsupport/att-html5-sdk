/**
 *  Model used in Subscription Payment app. 
 */
Ext.define('SampleApp.model.SubscriptionTransaction', {
    extend : 'Ext.data.Model',

    config : {
        idProperty  : 'id',
        identifier  : 'sequential',

        fields : [
            { name  : 'MerchantTransactionId' },
            { name  : 'MerchantSubscriptionId' },
            { name  : 'SubscriptionId'},
            { name  : 'ConsumerId' },
            { name  : 'SubscriptionAuthCode' },
            { name  : 'Selected' }
        ]
    }

});