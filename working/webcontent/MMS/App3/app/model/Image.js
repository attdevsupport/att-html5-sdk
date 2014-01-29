/**
 *
 * Model used in the MMS Gallery app.
 *
 */
Ext.define('SampleApp.model.Image', {
    extend : 'Ext.data.Model',

    config : {
        /**
         * The fields that make up this Model
         */
        fields : [
            { name : 'image' },
            { name : 'address' },
            { name : 'date' },
            { name : 'text' },
            { name : 'textMessage'}
        ]
    }


});