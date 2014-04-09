/**
 * Controller that interacts with the SMS Voting application.
 */
Ext.define('SampleApp.controller.sms.Voting', {
    extend: 'Ext.app.Controller',

    requires: [
       'Att.ApiResults',
       'SampleApp.Config'
    ],

    config: {
        refs: {
            view: 'att-sms-voting',
            list: 'att-sms-voting list',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control:{
            'att-sms-voting button[action=showvotes]':{
                'tap': 'onShowVotes'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            }
        }
    },
    
    showResponseView: function(success, response){
        var responseView =  this.getResponseView();
       
        Ext.Viewport.add(responseView);
       
        responseView.setData({
            success: success,
            results: JSON.stringify(response, null, '\t')
        });
       
        responseView.show();    
    },
    
    onCloseResponseView: function(){
        this.getResponseView().hide();
    },
    
    /**
     * Reloads the Votes store which will update the Vote totals on the screen.
     */
    onShowVotes: function(btn, event, eOpts){
        var me = this,
            view = me.getView(),
            list = me.getList(),
            store = list.getStore();
        
        view.setMasked(true);
        store.load({
            callback: function(records, operation, success){
                var jsonData = store.getProxy().getReader().rawData;
             
                view.setMasked(false);
                
                me.showResponseView(success, jsonData);
                
            },
            scope: me
        });
    }
});

