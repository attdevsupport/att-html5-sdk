/**
 * Controller that interacts with the Subscription application.
 */
Ext.define('SampleApp.controller.payment.Subscription', {
    extend: 'Ext.app.Controller',
   
    requires: [
       'Att.Provider',
       'Att.ApiResults',
       'SampleApp.Config',
       'Ext.MessageBox'
    ],

    config: {
        provider: undefined,

        refs: {
            view: 'att-payment-subscription',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            }
        },
        
        control: {
            'att-payment-subscription button[action=createsubscription]': {
                'tap': 'onCreateSubscription'
            },
            'att-payment-subscription button[action=subscriptionstatus]': {
                'tap': 'onSubscriptionStatus'
            },
            'att-payment-subscription button[action=subscriptiondetails]':{
                'tap': 'onSubscriptionDetails'
            },
            'att-payment-subscription button[action=refundsubscription]': {
                'tap': 'onRefundSubscription'
            },
            'att-payment-subscription button[action=cancelsubscription]': {
                'tap': 'onCancelSubscription'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            },
            'att-payment-subscription list': {
                'select': 'onSubscriptionSelected'
            }
        }
    },
    
    /**
     * Gets called internally when provider property is set during config initialization.
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
    
    
    showResponseView: function(success, response){
        var responseView =  this.getResponseView();
       
        Ext.Viewport.add(responseView);
       
        responseView.setData({
            success: success,
            results: JSON.stringify(response, null, '\t')
        });
       
        responseView.show();    
    },
    
    onCloseResponseView: function(){
        this.getResponseView().hide();
    },
    
    /**
     * Creates a subscription payment by calling requestPaidSubscription
     */
    onCreateSubscription: function(btn, event, eOpts) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            list = view.down('list'),
            subscriptionStatusForm = view.down('#subscriptionStatusForm'),
            form = btn.up('formpanel').getValues(),
            paymentOptions;
        
        list.deselectAll();
        
        view.setMasked(true);
        
        subscriptionStatusForm.reset();
        
        paymentOptions = me.buildPaymentOptions(form);
        
        provider.requestPaidSubscription({
            paymentOptions: paymentOptions,
            success: function(response){
                var store = view.down('list').getStore();
                
                view.setMasked(false);
                me.showResponseView(true, response);
        
                subscriptionStatusForm.down('textfield[name=MerchantTransactionId]').setValue(paymentOptions.MerchantTransactionId);
                subscriptionStatusForm.down('textfield[name=SubscriptionAuthCode]').setValue(response.TransactionAuthCode);

                store.add({
                    MerchantTransactionId: paymentOptions.MerchantTransactionId,
                    SubscriptionAuthCode: response.TransactionAuthCode
                });
                
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
    },
   
    //private
    buildPaymentOptions: function(form) {
        var tx = new Date().getTime();
        return {
            "Amount":form.productPrice,
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"Word subscription 1",
            "MerchantTransactionId":"User" + tx + "Transaction",
            "MerchantProductId":"wordSubscription1",
            "MerchantSubscriptionIdList": ("List" + tx).substring(0, 11),
            "SubscriptionRecurrences":99999,
            "SubscriptionPeriod":"MONTHLY",
            "SubscriptionPeriodAmount":"1",
            "IsPurchaseOnNoActiveSubscription":"false" // setting to true returns that the charge is a SINGLEPAY
        };
    },

    /**
     * Handler for subscription status button. Calls updateSubscriptionStatus with the merchatTransactionId obtained when the subscription was created.
     */
    onSubscriptionStatus: function(btn, event, eOpts) {
        var me = this,
            cfg = SampleApp.Config,
            form = btn.up('formpanel'),
            statusBy = form.getValues().statusBy,
            value;
        
        if(!statusBy) {
            Ext.Msg.alert(cfg.alertTitle, 'Please select a value to use to obtain subscription status');
            return;
        }
        
        value = form.down('textfield[name='+statusBy+']').getValue();

        if(!value) {
            Ext.Msg.alert(cfg.alertTitle, 'Please select a value to use to obtain subscription status');
            return;
        }        
        
        me.updateSubscriptionStatus(statusBy, value);
        
    },
    
    /**
     * Retrieve Subscription status
     * @param type {String} the type of ID used to get status
     * @param value {String} the value used to retrieve the status
     */
    updateSubscriptionStatus: function(type, value) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider();
            store = view.down('list').getStore(),
            transaction = store.findRecord(type, value),
            subscriptionStatusForm = view.down('#subscriptionStatusForm');

        
        view.setMasked(true);
        
        provider.getSubscriptionStatus({
            codeType: type,
            transactionId: value,
            success: function(response){
                var sid = response.SubscriptionId;
                
                view.setMasked(false);
                me.showResponseView(true, response);
                

                if(sid){  //Make sure we have a success response before update record and form values.
                    
                    subscriptionStatusForm.down('textfield[name=SubscriptionId]').setValue(sid);
                    if(!transaction){
                        //In case user checks status of another subscription we need to create a
                        //new record since it wasn't generated previously.
                        transaction = Ext.create(store.getModel().getName(), {
                            MerchantTransactionId: response.MerchantTransactionId,
                        });
                        store.add(transaction);
                    }
                    //update record
                    transaction.set('SubscriptionId', sid);
                    transaction.set('MerchantSubscriptionId',response.MerchantSubscriptionId);
                    transaction.set('ConsumerId',response.ConsumerId);
                    store.sync();
                }
            
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
    },
    
    /**
     * Gets the Subscription details by pulling merchantSubscriptionId and consumerId inputs fields values previously obtained by getting status.
     */
    onSubscriptionDetails: function(btn, event, eOpts) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            list = view.down('list'),
            cfg = SampleApp.Config,
            subscription;
        
        if(!list.hasSelection()) {
            Ext.Msg.alert(cfg.alertTitle, 'Select a subscription from list');
            return;
        }
        view.setMasked(true);
        subscription = list.getSelection()[0];
        
        provider.getSubscriptionDetails({
            merchantSubscriptionId : subscription.get('MerchantSubscriptionId'),
            consumerId : subscription.get('ConsumerId'),
            success: function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },
    
    /**
     * Refunds a Subscription using the subscriptionId
     */
    onRefundSubscription: function(btn, event, eOpts) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            list = view.down('list'),
            cfg = SampleApp.Config,
            subscriptionStatusForm = view.down('#subscriptionStatusForm'),
            subscription;
        
        subscriptionStatusForm.reset();
        
        if(!list.hasSelection()) {
            Ext.Msg.alert(cfg.alertTitle, 'Select a subscription from list');
            return;
        }
        
        subscription = list.getSelection()[0];
        
        if(!subscription.get('SubscriptionId')){
            Ext.Msg.alert(cfg.alertTitle, 'Subscription Id is needed to refund. Please first get Subscription Status');
            return;
        }
        
        view.setMasked(true);

        provider.refundTransaction({
            transactionId : subscription.get('SubscriptionId'),
            refundOptions : {
                "RefundReasonCode": 1,
                "RefundReasonText": "Customer was not happy"
            },
            success: function(response){
                var store = list.getStore();

                view.setMasked(false);
                me.showResponseView(true, response);
                
                if(response.IsSuccess && response.IsSuccess !== "false"){ 
                    list.deselect(subscription);
                    store.remove(subscription);
                    store.sync();
                }
                
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },

    /**
     * Cancel a Subscription using the subscriptionId
     */
    onCancelSubscription: function(btn, event, eOpts) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            list = view.down('list'),
            cfg = SampleApp.Config,
            subscriptionStatusForm = view.down('#subscriptionStatusForm'),
            subscription;
        
        subscriptionStatusForm.reset();
        
        if(!list.hasSelection()) {
            Ext.Msg.alert(cfg.alertTitle, 'Select a subscription from list');
            return;
        }
        
        subscription = list.getSelection()[0];
        
        if(!subscription.get('SubscriptionId')){
            Ext.Msg.alert(cfg.alertTitle, 'Subscription Id is needed to cancel. Please first get Subscription Status');
            return;
        }
        
        view.setMasked(true);

        provider.cancelSubscription({
            transactionId : subscription.get('SubscriptionId'),
            refundOptions : {
                "RefundReasonCode": 1,
                "RefundReasonText": "Customer was not happy"
            },
            success: function(response){
                view.setMasked(false);
                me.showResponseView(true, response);
            },
            failure: function(error){
                view.setMasked(false);
                me.showResponseView(false, error);
            }
        });
        
    },
    
    
    
    /**
     * Handler to fill out the status form with the selected record on the list
     * @param list
     * @param record
     * @param options
     */
    onSubscriptionSelected: function(list, record, options){
        var me = this,
            view = me.getView(),
            form = view.down('#subscriptionStatusForm');

        form.reset();
        
        form.setValues({
            MerchantTransactionId: record.get('MerchantTransactionId'),
            SubscriptionAuthCode: record.get('SubscriptionAuthCode'),
            SubscriptionId: record.get('SubscriptionId')
        });
        
    }

    
    
});