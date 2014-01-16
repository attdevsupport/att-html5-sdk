/**
 * Model used in SMS Voting app.
 */
Ext.define('SampleApp.model.Vote', {
    extend: 'Ext.data.Model',
    
    config:{
        fields : [
            { name : 'sport' },
            { name : 'votes' }
        ]
    }
});