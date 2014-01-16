/**
 * Controller that interacts with the Basic MIM application.
 */
Ext.define('SampleApp.controller.mim.Basic', {
    extend: 'Ext.app.Controller',

    requires: [
       'Att.Provider',
       'Att.ApiResults',
       'SampleApp.Config',
       'Ext.MessageBox'
    ],

    
    /**
     * @private
     * authScope: the scope name used by provider to get authorization from user. 
     */
    authScope: 'MIM',
    
    
    /**
     * Configuration for the MIM sample app controller. This sets up all the references
     * for the controller as well as define place holders to keep track of the number
     * of messages returned and the current index cursor.
     */
    
    config: {
        provider: undefined,
        headerCount: 0,
        indexCursor: 0,

        refs: {
            view: 'att-mim-basic',
            form: 'att-mim-basic formpanel',
            messageId: 'att-mim-basic textfield[name=messageId]',
            partNumber: 'att-mim-basic textfield[name=partNumber]',
            getContentButton: 'att-mim-basic button[action=getMessageContent]',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-mim-basic button[action=getmessages]': {
                'tap': 'onGetMessageHeaders'
            },
            'att-mim-basic button[action=getMessageContent]': {
                'tap': 'onGetMessageContent'
            },
            'att-mim-basic list': {
                'itemtap' : 'onMessageHeaderTap'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            }
        }
    },
    
    /**
     * This method is called internally when provider property is set during config initialization.
     * We'll initialize here our Att.Provider instance to perform the API calls. 
     * @param provider the value we set in config option for this property.
     * @returns
     */
    applyProvider: function(provider) {
        if (!provider) {
            provider = Ext.create('Att.Provider',{
                apiBasePath: SampleApp.Config.apiBasePath
            });
        }

        return provider;
    },
    
    /**
     * Display raw response value received from the AT&T getMessageHeader API call to the user.
     */
    showResponseView: function(success, response, url) {
        var responseView =  this.getResponseView();
        
        Ext.Viewport.add(responseView);
        
        responseView.setData({
             success: success,
             results: JSON.stringify(response, null, '\t')
         });
        
        responseView.show();    
    },
    
    onCloseResponseView: function(btn){
        var responseView = btn.up('actionsheet');
        responseView.hide();
    },

    /**
     * Handler for get messages button on MIM application. This will check to see if the
     * application is authorized, and if not, will attempt to obtain authorization.
     * If the app gets successful authorization, it sends a request to retrieve a set of
     * message headers from the AT&T API and then make a call to 'doGetMessageHeaders'.
     */
    onGetMessageHeaders: function(){
        var me = this,
            view = me.getView(),
            provider = me.getProvider();
        
        view.setMasked(true);
        
        provider.isAuthorized({
            authScope : me.authScope,
            success   : me.doGetMessageHeaders,
            failure   : function(){
                provider.authorizeApp({
                    authScope : me.authScope,
                    success   : me.doGetMessageHeaders,
                    failure   : function(error) {
                        view.setMasked(false);
                        Ext.Msg.alert('Access denied', 'User denied authorization');
                    },
                    scope: me
                });
            },
            scope: me
        });   
    },
    
    /**
     * Obtain message headers from the AT&T API and populate our store with the message headers.
     * If the indexCursor is 0, we are obtaining the messages from the start, so clear out the
     * store before adding received records, otherwise we will append received records to the existing
     * ones already in the store.
     */ 
    doGetMessageHeaders: function(){
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            options = me.getForm().getValues(),
            cfg = SampleApp.Config,
            getMessageContentButton = view.down('button[action=getMessageContent]');


        if(!options.headerCount){
            view.setMasked(false);
            Ext.Msg.alert(cfg.alertTitle, 'Please enter number of headers to retrieve');
            return;
        }
                        
        provider.getMessageHeaders({
            headerCount: options.headerCount,
            indexCursor: options.indexCursor,
            success: function(response){

                view.setMasked(false);


                if (! (response.MessageHeadersList && response.MessageHeadersList.HeaderCount > 0)) {
                    Ext.Msg.alert(cfg.alertTitle, 'No (more) messages found to retrieve.');
                    return;
                }

                var store = view.down('list').getStore(),
                    ic = view.down('textfield[name=indexCursor]'),
                    MessageHeaderModel = store.getModel(),
                    record;
                
                me.showResponseView(true, response);
                ic.setValue(response.MessageHeadersList.IndexCursor);
                        
                if (options.indexCursor == 0) {
                    store.removeAll();
                }

                store.add(response.MessageHeadersList.Headers);

            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },

    /**
     * When a message header is selected (tapped) disable the getMessageContent button, clear the 
     * message part field and fill the message id field with the message id of the selected message.
     * If the selected message has parts (content), enable the getMessageContent button to allow the
     * user to show content after they have entered the specific message part.
     */
    onMessageHeaderTap: function(dv, index, target, record, event, opts) {
        var me = this,
            btn = me.getGetContentButton(),
            view = me.getView();

        btn.disable();

        me.getMessageId().setValue(record.data.MessageId);
        me.getPartNumber().setValue('');
        if (record.data.MmsContent) {
            btn.enable();
        }
    },

    /**
     * When user clicks the Get Message Content button, check for appropriate values in form fields
     * and then preform a call to the Att.Provider helper method to form a source URL which will provide
     * the content stream received from the AT&T APIs.
     */
    onGetMessageContent: function() {
        var me = this,
            cfg = SampleApp.Config,
            view = me.getView(),
            store = view.down('list').getStore(),
            messageId = me.getMessageId().getValue(),
            partNumber = me.getPartNumber().getValue(),
            contentUrl = view.down('container[name=contentUrl]'),
            rec, parts;
        
        contentUrl.hide();

        if (!messageId) {
            Ext.Msg.alert(cfg.alertTitle, 'Please enter Message ID');
            return;
        }

        if (!partNumber) {
            Ext.Msg.alert(cfg.alertTitle, 'Please enter Part Number');
            return;
        }

        rec = store.findRecord('MessageId', messageId);
        if (! rec) {
            Ext.Msg.alert(cfg.alertTitle, 'Unknown messageId entered.');
            return;
        }

        parts = rec.data.MmsContent;

        if (! parts[partNumber]) {
            Ext.Msg.alert(cfg.alertTitle, 'Part does not exist for the Message ID');
            return;
        }

        contentUrl.setData({
            url: Att.Provider.getContentSrc(messageId, partNumber),
            name: parts[partNumber].ContentName
        });
        
        contentUrl.show();
        
    }
    
});
