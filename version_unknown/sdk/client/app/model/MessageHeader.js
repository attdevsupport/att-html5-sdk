/**
 *
 * Model used in the Mim app.
 *
 */
Ext.define('KitchenSink.model.MessageHeader', {
    extend : 'Ext.data.Model',

    config : {
        /**
         * The fields that make up this Model
         */
        fields : [
            { name : 'Favourite' },
            { name : 'Text' },
            { name : 'MessageId' },
            { name : 'To' },
            { name : 'Received' },
            { name : 'Read' },
            { name : 'Direction' },
            { name : 'From' }
        ]
    }

});
