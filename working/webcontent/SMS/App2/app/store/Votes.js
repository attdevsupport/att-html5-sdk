Ext.define('SampleApp.store.Votes', {
    extend: 'Ext.data.Store',

    requires: [ 'SampleApp.Config' ],

    config:{
        model: 'SampleApp.model.Vote',
        
        proxy   : {
            type    : 'ajax',
            url     : '/att/sms/votegetter',
            reader  : {
                type : 'json',
                rootProperty : 'data',
                totalProperty : 'total'
            }
        }
    }

});
