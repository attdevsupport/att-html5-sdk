/**
 * The Main controller is responsible for handling all the api calls from each view.
 * It is used for global navigation. 
 * 
 */
Ext.define('KitchenSink.controller.Main', {
    extend: 'Ext.app.Controller',

    requires: [
        'Att.Provider',
        'KitchenSink.view.ApiResults',
        'Ext.data.Store',
        'Ext.form.FieldSet'
    ],

    config: {
        provider: undefined,

        refs: {
            navigationView: 'navigationview',
            navigationList: 'navigationlist',
            apiResults: {
                xtype: 'apiresults',
                selector: 'apiresults',
                autoCreate: true
            }
        },

        control: {
            navigationView: {
                pop: 'onNavigationPop'
            },
            navigationList: {
                itemtap: 'onNavigationTap'
            },
            'container': {
                apicall           : 'onApiCall',
                checkauthorization: 'onAuthorizationCheck'
            }
        },

        routes: {
            ''   : 'showNavigationList',
            ':id': 'showNavigationItem'
        }
    },

    /**
     * @private
     */    
    applyProvider: function(provider) {
        if (!provider) {
            provider = Ext.create('Att.Provider');
        }

        return provider;
    },

    /**
     * Handler for ATT API calls. This method will be responsible to perform the call to the provider
     * in order to establish the communication with the server side, and show the results.
     * 
     * @param item {Ext.Container} the container which launched the api call
     * @param info {Object} a config object with the api call description in the way:
     *  @param info.method {String} name of the api method. i.e. sendSms
     *  @param info.success {Function} callback function called on success.
     *  @param info.failure {Function} callback function called on failure.
     *  @param scope {Object} the scope where callback functions will execute.   
     */
    onApiCall: function(item, info) {
        var method = info.method,
            success = info.success,
            failure = info.failure,
            scope = info.scope,
            me = this;

        Ext.apply(info, {
            success: function(results) {
                me.onApiCallSuccess(results);
                if (success) {
                    success.call(scope || me, results);
                }
            },
            failure:  function(error) {
                me.onApiCallFailure(error);
                if (failure) {
                    failure.call(scope || me, error);
                }
            }
        });

        this.getProvider()[method](info);

        this.getNavigationView().push(this.getApiResults({
            title: item.config.title
        }));
    },

    /**
     * @private
     */    
    onApiCallSuccess: function(results) {
        var apiResults = this.getApiResults();
        apiResults.setData({
            success: true,
            results: JSON.stringify(results, null, '    ')
        });
        apiResults.setMasked(false);
    },

    /**
     * @private
     */    
    onApiCallFailure: function(error) {
        var apiResults = this.getApiResults();
        apiResults.setData({
            success: false,
            results: JSON.stringify(error, null, '    ')
        });
        apiResults.setMasked(false);
    },

    /**
     * @private 
     */
    onAuthorizationCheck: function(item, options, e) {
        var me = this;

        item.setMasked({
            xtype: 'loadmask',
            message: 'Authorizing...'
        });

        e.pause();
        me.getProvider().isAuthorized({
            success: function() {
                item.setMasked(false);
                e.resume();
            },
            failure: function() {
                me.getProvider().authorizeApp({
                    success: function() {
                        item.setMasked(false);
                        e.resume();
                    }
                });
            }
        });
    },

    /**
     * This takes care of history when a view is pop from the navigation view.
     * @param navigationView
     * @param item
     */
    onNavigationPop: function(navigationView, item) {
        if (navigationView.getActiveItem() === this.getNavigationList()) {
            var history = this.getApplication().getHistory();
            history.add(Ext.create('Ext.app.Action', {
                url: ''
            }));
        }
    },


    /**
     * Show the corresponding view when the user selects an element from the main list.
     * @param list
     * @param index
     * @param node
     * @param record
     */
    onNavigationTap: function(list, index, node, record) {
        this.redirectTo(record.get('id'));
    },

    /**
     * Resets the navigation list.
     */
    showNavigationList: function() {
        this.getNavigationView().reset();
    },

    /**
     * Gets or creates a view based on the given view id and show it. 
     * @param id {String} the view id.
     */
    showNavigationItem: function(id) {
        var itemView = Ext.widget(id),
            list = this.getNavigationList(),
            store = list.getStore();

        this.getNavigationList().select(store.getById(id));
        this.getNavigationView().push(itemView);
    }
});