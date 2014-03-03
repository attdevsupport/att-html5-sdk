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

    config: {
        provider: undefined,

        refs: {
            view: 'att-iam-basic',
        },
    },
    controls: {},
    launch: function () {


    }
});