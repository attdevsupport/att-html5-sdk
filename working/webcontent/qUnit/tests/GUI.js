JTF.views.ClientTest = Ext.extend(Ext.Panel, {

    layout: 'fit',

    // This function is run when initializing the component
    initComponent: function() {

        var self = this; // We need a reference to this instance for use in callbacks

        this.items = [{
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                title: 'Client Test',
                items: {
                    xtype: 'button',
                    text: 'Back',
                    handler: function() {
                        Ext.dispatch({
                             controller: 'index',
                             action    : 'showList'
                         });
                    }
                }
            }],
            layout: 'vbox',
            items: []
        }];

        JTF.views.ClientTest.superclass.initComponent.apply(this, arguments);

        $("#viewport").hide(); // hide the example app so we can see our test screen
	}
});

Ext.reg('attTST', JTF.views.ClientTest);