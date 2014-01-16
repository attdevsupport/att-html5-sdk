/**
 *
 * User Interface for the SMS Voting application.
 * 
 * **Note** In order to get this sample working you must configure the SampleApp.Config.shortCode properly 
 * and your short code URI should point to /att/sms/votelistener in your application configuration.
 *
 */
Ext.define('SampleApp.view.sms.Voting', {
	extend: 'Ext.Container',
	xtype: 'att-sms-voting',
	
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config'
    ],
           
	config: {
        title: 'SMS Voting',
        scrollable: 'vertical',
        defaults: {scrollable: false}
	},
	
	//override
	initialize: function() {
	    this.add([
	        {xtype: 'att-header'},
	        this.buildHeader(), 
	        this.buildVoteList(),
            {xtype: 'att-footer'}
	    ]);
		
	},
	
    /**
     * Builds the UI components for Feature 1: Calculate Votes.
     */
    buildHeader: function() {
        var cfg = SampleApp.Config;
        return {
            xtype   : 'container',
            items   : [
                {
                    xtype: 'fieldset',
                    title: 'Retrieve / Update Vote Totals',
                    instructions: 'Votes sent to ' + cfg.shortCode + ' with text "Football", "Basketball", or "Baseball"'
                }
            ]
        };
    },

    /**
     * Builds the list to display the votes.
     */
    buildVoteList: function() {
        return {
            xtype   : 'fieldset',
            items   : [{
                xtype   : 'list',
                scrollable: false,
                itemTpl : '<div style="float: left">{sport}</div><div style="float: right">{votes}</div>',
                store   : 'Votes'
            },{
                xtype   : 'button',
                ui      : 'action',
                action  : 'showvotes',
                text    : 'Display/Refresh Vote Totals'
            }]
        };
    }
	
});