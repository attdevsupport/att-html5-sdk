/**
 *
 * Store used to hold DeliveryInfo model instances.
 *
 */
Ext.define('SampleApp.store.DeliveryInfos', {
    extend: 'Ext.data.Store',

   config: {
       model: 'SampleApp.model.DeliveryInfo'
   }

});