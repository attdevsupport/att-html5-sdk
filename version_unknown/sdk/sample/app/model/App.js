Ext.define('SampleApp.model.App', {
    extend: 'Ext.data.Model',

    config : {
        /**
         * The fields that make up this Model
         */
        fields : [
            { name  : 'group' },
            { name  : 'title' },
            { name  : 'index' },
            { name  : 'pageXType' }
        ]

    }
});