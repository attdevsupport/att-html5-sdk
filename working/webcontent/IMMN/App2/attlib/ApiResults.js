/**
 * A helper actionSheet used to display the results of API calls.
 */
Ext.define('Att.ApiResults', {
    extend: 'Ext.ActionSheet',
    xtype: 'apiresults',
    
    config: {
        responseTpl: '<div class="header <tpl if="success == true">success<tpl else>failed</tpl>">Success: {success}</div><div>Server Response:<br/><span>{[JSON.stringify(values.response, null, "  ")]}<span></div>'
    },
    
    //override
    initialize: function() {
        this.resultPanel = Ext.create('Ext.Container',{
            tpl:  this.getResponseTpl(),
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
        var result, success;
            
        if(data && data.results && Ext.isObject(data.results)){
            result = data.results;
        }else{
            result = JSON.parse(data.results);
        }
        
        //this should be changed from server side to make consistent responses
        success = (!data.success || !result
                    || result.error 
                    || result.IsSuccess == "false" 
                    || result.requestError
                    || result.RequestError
                    || result.apiError) ? false : true;
        
        this.resultPanel.setData({
            success: success,
            response: result
        });
        
        this.resultPanel.getScrollable().getScroller().scrollTo(0,0);
    }

});