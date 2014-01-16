/**
 *
 * Model used in the MMS Coupon app.
 *
 */
Ext.define('SampleApp.model.DeliveryInfo', {
    extend : 'Ext.data.Model',

    config : {
        /**
         * The fields that make up this Model
         */
        fields : [
            { name : 'Id' },
            { name : 'Address' },
            { name : 'DeliveryStatus' }
        ]
    }

});