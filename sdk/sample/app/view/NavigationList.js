/**
 * A Navigation List to itemize all the available samples.
 */
Ext.define('SampleApp.view.NavigationList', {
    extend: 'Ext.List',
    xtype: 'navigationlist',

    config: {
        store: 'Apps',
        itemTpl: '<div>{title}</div>',
        grouped: true
    }
});