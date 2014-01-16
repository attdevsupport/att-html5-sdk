Ext.define('SampleApp.store.Apps', {
    extend: 'Ext.data.Store',

    config: {
        autoLoad: true,
        model: 'SampleApp.model.App',

        proxy   : {
            type    : 'ajax',
            url     : 'assets/data/apps.json',
            reader  : {
                type : 'json',
                rootProperty : 'data'
            }
        },

        grouper     : {
            groupFn : function(record) {
                return record.get('group') + ' sample apps';
            }
        }
    }
});