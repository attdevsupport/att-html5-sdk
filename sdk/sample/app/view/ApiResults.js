/**
 * A Sheet to display API call results
 */
Ext.define('SampleApp.view.ApiResults', {
    extend: 'Ext.ActionSheet',
    xtype: 'apiresults',
    
    //override
    initialize: function() {
        this.resultPanel = Ext.create('Ext.Container',{
            tpl:  '<div class="header <tpl if="success == true">success<tpl else>failed</tpl>">Success: {success}</div><div>Server Response:<br/><span>{results}<span></div>',
            styleHtmlContent: true,
            style: 'background: #fff',
            scrollable: 'both',
            height: 150
        });
        this.add([this.resultPanel,{
            xtype: 'toolbar',
            docked: 'top',
            title: 'Response',
            items:[{xtype: 'spacer'},{
                text: 'Done',
                action: 'close'
            }]
        }]);
    },
    
    /**
     * This will update the tpl used to display the response from API calls.
     * The data Object is a simple object that wraps the success and results parameters.
     * data.success represents whether or not the call was successful and the data.results is a String representation of the JSON object returned from API call.
     * @param data {Object}
     */
    setData: function(data) {
        var result = JSON.parse(data.results),
            //this should be changed from server side to make consistent responses
            success = (!data.success || !result
                    || result.error 
                    || result.IsSuccess == "false" 
                    || result.requestError
                    || result.RequestError
                    || result.apiError) ? false : true;
        
        this.resultPanel.setData({
            success: success,
            results: JSON.stringify(result, null, '    ')    
        });
        
        this.resultPanel.getScrollable().getScroller().scrollTo(0,0);
    }

});