/**
 *
 * Model used in the Single Pay Payment app.
 *
 */
Ext.define('SampleApp.model.SinglePayTransaction', {
    extend : 'Ext.data.Model',

    config : {
        idProperty  : 'id',
        identifier  : 'sequential',

        /**
         * The fields that make up this Model
         */
        fields : [
            { name  : 'TransactionId' },
            { name  : 'MerchantTransactionId' },
            { name  : 'TransactionAuthCode' }
        ]
    }

});