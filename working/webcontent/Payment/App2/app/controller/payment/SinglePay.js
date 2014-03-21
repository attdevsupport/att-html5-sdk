/**
 * Controller that interacts with the SinglePay application.
 */
Ext.define('SampleApp.controller.payment.SinglePay', {
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
            view: 'att-payment-singlepay',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            },
            transactionList: 'att-payment-singlepay dataview'
        },
        
        control: {
            'att-payment-singlepay button[action=buyproduct]': {
                'tap': 'onBuyProduct'
            },
            'att-payment-singlepay button[action=transactionstatus]': {
                'tap': 'onTransactionStatus'
            },
            'att-payment-singlepay button[action=refundtransaction]': {
                'tap': 'onRefundTransaction'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            },
            'att-payment-singlepay list': {
                'select': 'onTransactionSelected'
            },

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
    
    launch: function() {
        globalPaymentController = this;
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
     * Handler for buy product button.
     * Performs a requestPayment call to establish a single pay transaction.
     */
    onBuyProduct: function(btn, event, eOpts) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            list = me.getTransactionList(),
            transactionStatusForm = view.down('#transactionStatusForm'),
            form = btn.up('formpanel').getValues(),
            paymentOptions;
        
        list.deselectAll();
        
        view.setMasked(true);
        
        transactionStatusForm.reset();
        
        paymentOptions = me.buildPaymentOptions(form);
        
        provider.requestPayment({
            paymentOptions: paymentOptions,
            success: function(response){
                var store = list.getStore();
                
                view.setMasked(false);
                me.showResponseView(true, response);
        
                transactionStatusForm.down('textfield[name=MerchantTransactionId]').setValue(paymentOptions.merch_trans_id);
                transactionStatusForm.down('textfield[name=TransactionAuthCode]').setValue(response.TransactionAuthCode);

                store.add({
                    MerchantTransactionId: paymentOptions.merch_trans_id,
                    TransactionAuthCode: response.TransactionAuthCode
                });

            },
            failure: function(xhr, errorText){
                view.setMasked(false);
                me.showResponseView(false, { results: { error: errorText } });
            }
        });
    },
   
    //private
    buildPaymentOptions: function(form) {
        var tx = new Date().getTime();

        return {
            "amount":form.productPrice,
            "category":1,
            "desc":"Word game 1",
            "merch_trans_id":"User" + tx + "Transaction",
            "merch_prod_id":"wordGame1",
            "redirect_uri":"http://localhost:4567/att/payment"
        };
    },

    /**
     * Handler for transaction status button.
     * Calls updateTransactionStatus method with the merchantTransactionId input field value.
     */
    onTransactionStatus: function(btn, event, eOpts) {
        var me = this,
            form = btn.up('formpanel'),
            cfg = SampleApp.Config,
            statusBy = form.getValues().statusBy,
            value;
        
        if(!statusBy) {
            Ext.Msg.alert(cfg.alertTitle, 'Please select a value to use to obtain transaction status');
            return;
        }
        
        value = form.down('textfield[name='+statusBy+']').getValue();

        if(!value) {
            Ext.Msg.alert(cfg.alertTitle, 'Please select a value to use to obtain transaction status');
            return;
        }
        
        
        me.updateTransactionStatus(statusBy, value);
    },
    
    /**
     * Gets the transaction status by calling getTransactionStatus.
     * @param {string} searchParameter
     * @param {string} searchValue
     */
    updateTransactionStatus: function(searchParameter, searchValue) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            store = me.getTransactionList().getStore(),
            transaction = store.findRecord(searchParameter, searchValue),
            transactionStatusForm = view.down('#transactionStatusForm');
        
        view.setMasked(true);
        
        provider.getTransactionStatus({
            codeType: searchParameter,
            transactionId: searchValue,
            success: function(response){

                var tid = response.TransactionId;
                var mid = response.MerchantTransactionId;
                
                view.setMasked(false);
                me.showResponseView(true, response);


                if(tid){ //Make sure we have a success response before update record and form values.

                    transactionStatusForm.down('textfield[name=TransactionId]').setValue(tid);
                    transactionStatusForm.down('textfield[name=MerchantTransactionId]').setValue(mid);

                    if(!transaction){
                        //In case user checks status of another transaction we need to create a
                        //new record since it wasn't generated previously.
                        transaction = Ext.create(store.getModel().getName(), {
                            MerchantTransactionId: response.MerchantTransactionId,
                        });
                        store.add(transaction);
                    }
                    //update record
                    transaction.set('TransactionId', tid);
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
     * Handler for refund transaction button.
     * Performs a call to refundTransaction passing the transactionId input field obtained previously by transaction status.
     */
    onRefundTransaction: function(btn, event, eOpts) {
        var me = this,
            view = me.getView(),
            provider = me.getProvider(),
            list = view.down('list'),
            cfg = SampleApp.Config,
            transactionStatusForm = view.down('#transactionStatusForm'),
            transaction;
        
        transactionStatusForm.reset();
        
        var transaction = me.getTransactionList().getStore().findRecord("Selected", true);

        if (!transaction) {
            Ext.Msg.alert(cfg.alertTitle, 'Select a transaction from list');
            return;
        }
        
        if(!transaction.get('TransactionId')){
            Ext.Msg.alert(cfg.alertTitle, 'Transaction Id is needed to refund. Please first get Transaction Status');
            return;
        }
        
        view.setMasked(true);
        
        provider.refundTransaction({
            transactionId : transaction.get('TransactionId'),
            refundOptions : {
                "RefundReasonCode": 1,
                "RefundReasonText": "Customer was not happy"
            },
            success: function(response){
                response = JSON.parse(response);
                
                var store = me.getTransactionList().getStore();

                view.setMasked(false);
                me.showResponseView(true, response);
                
                if(response.IsSuccess && response.IsSuccess !== "false"){ 
                    store.remove(transaction);
                    store.sync();
                }
            },
            failure: function(error){
                if (error.status == 400) { // the transaction probably doesn't exist
                    var store = me.getTransactionList().getStore();
                    store.remove(transaction);
                    store.sync();
                }
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
    onTransactionSelected: function(list, record, options){
        var me = this,
            view = me.getView(),
            form = view.down('#transactionStatusForm');

        form.reset();

        form.setValues({
            MerchantTransactionId: record.get('MerchantTransactionId'),
            TransactionAuthCode: record.get('TransactionAuthCode'),
            TransactionId: record.get('TransactionId')
        });
        
    },
    
    selectTransaction: function(element, id) {
        var list = this.getTransactionList();
        var store = list.getStore();
        var record = store.findRecord("Selected", true);
        if (record) {
            record.set("Selected", false);
        }
        store.findRecord("MerchantTransactionId", id).set("Selected", true);
        list.refresh();
    }
});
