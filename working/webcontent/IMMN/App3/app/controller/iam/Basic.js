/**
 * Controller that interacts with the Basic IAM application.
 */
Ext.define('SampleApp.controller.iam.Basic', {
	extend: 'Ext.app.Controller',

	requires: [
       'Att.ApiResults',
       'SampleApp.Config',
       'Ext.MessageBox'
	],
	stores: ['Messages'],
	controls: {},
	init: function () {
		
	}
});