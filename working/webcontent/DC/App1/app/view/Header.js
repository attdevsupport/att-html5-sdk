/**
 * @class SampleApp.view.Header
 * A class to show the header on each Sample Application.
 */
Ext.define('SampleApp.view.Header', {
    extend: 'Ext.Container',
    xtype: 'att-header',
    
    config : {
        cls: 'legal-message',
        tpl: [
            '<p>', 
            '   Local Time: {localTime} <br/>',
            '   User Agent: {userAgent} ',
            '</p>'
        ],
        data:{
            localTime: new Date(),
            userAgent: Ext.browser.userAgent
        }
    }
});