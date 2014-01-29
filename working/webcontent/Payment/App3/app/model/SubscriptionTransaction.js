/**
 *  Model used in Subscription Payment app. 
 */
Ext.define('SampleApp.model.SubscriptionTransaction', {
    extend : 'Ext.data.Model',

    config : {
        idProperty  : 'id',
        identifier  : 'sequential',

        fields : [
            { name  : 'MerchantSubscriptionId' }, //do we need this?
            { name  : 'SubscriptionId'},
            { name  : 'ConsumerId' },
            { name  : 'MerchantTransactionId' },
            { name  : 'SubscriptionAuthCode' }
        ]
    }

});