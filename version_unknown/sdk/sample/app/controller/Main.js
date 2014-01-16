Ext.define('SampleApp.controller.Main', {
    extend: 'Ext.app.Controller',

    config:{

        refs: {
            navigationView: 'navigationview',
            navigationList: 'navigationlist'
        },

        control: {
            'navigationlist': {
                itemtap: 'onItemSelected'
            },
             'navigationview': {
                pop: 'onNavigationPop'
            }
        },

        routes: {
             ''   : 'showNavigationList',
            ':id': 'showNavigationItem'
        }
    },


    onNavigationPop: function(navigationView, item) {
        if (navigationView.getActiveItem() === this.getNavigationList()) {
            var history = this.getApplication().getHistory();
            history.add(Ext.create('Ext.app.Action', {
                url: ''
            }));
        }
    },

    onItemSelected: function(list, index, node, record) {
        var id = record.get('id');
        this.redirectTo(id);
    },

    showNavigationList: function() {
        this.getNavigationView().reset();
    },

    showNavigationItem: function(id) {
        var list = this.getNavigationList(),
            store = list.getStore(),
            itemView = Ext.widget(id);

        this.getNavigationList().select(store.getById(id));
        this.getNavigationView().push(itemView);
    }
});