/**
 * This view is intended to display the results from an API call.
 * 
 */
Ext.define('KitchenSink.view.ApiResults', {
    extend: 'Ext.Container',
    xtype: 'apiresults',
    
    config: {
        masked: {
            xtype: 'loadmask',
            message: 'Retrieving data...'
        },
        styleHtmlContent: true,
        scrollable: true,
        tpl: [
            '<h1>Results ',
                '<tpl if="success"><span style="font-size: 0.5em; color: green">Success</span>',
                '<tpl else><span style="font-size: 0.5em; color: red">Exception</span></tpl>',
            '</h1>',
            '<pre>{results}</pre>'
        ]
    }
});