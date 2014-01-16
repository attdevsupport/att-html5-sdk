/**
 *
 * Model used in the MIM app.
 *
 */
Ext.define('SampleApp.model.MessageHeader', {
    extend : 'Ext.data.Model',

    config : {
        /**
         * The fields that make up this Model
         */
        fields : [
            { name : 'MessageId' },
            { name : 'From' },
            { name : 'To' },
            { name : 'Subject' },
            { name : 'Received' },
            { name : 'Text' },
            { name : 'Favorite' },
            { name : 'Read' },
            { name : 'Type' },
            { name : 'Direction' },
            { name : 'MmsContent'},
            { name : 'Parts', mapping: 'Text', convert: function(v, rec) {
                if (rec.data.MmsContent) {
                    var parts = new Array();
                    for (var i = 0; i < rec.data.MmsContent.length; i++ ) {
                        parts.push(rec.data.MmsContent[i].PartNumber);
                    }
                    return parts.join();
                } 
            }}
        ]
    }

});
