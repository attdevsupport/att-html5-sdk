/**
 * Payment view exercises the Payment API.
 * This view allows a user to perform a single transaction, get its status and refund it.
 * User can perform Subscription payment, get status, details and refund it as well.  
 * 
 */
Ext.define('KitchenSink.view.Payment', {
    extend: 'Ext.Container',
    xtype: 'payment',

    config: {

        title: 'Payment',
        scrollable: 'vertical',

        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        
        items: [{ 
            xtype: 'fieldset',
            title: 'Single Pay',
            defaults: {
                xtype: 'button',
                style: 'margin-bottom: 10px;',
            },
            items:[
                {
                    xtype: 'button',    
                    text: 'Charge User (Single Pay)',
                    action: 'singlepay'
                },{
                    xtype: 'fieldset',
                    defaults: {
                        xtype: 'textfield',
                        labelWidth: 130
                    },
                    items:[
                        {name: 'authcode', label: 'Auth Code', value: ''},
                        {name: 'transactionId', label: 'Trx ID', value: ''}
                    ]
                },{
                    xtype: 'button',
                    text: 'Transaction Status',
                    action: 'transactionstatus'
                }, {
                    xtype: 'button',
                    text: 'Refund Transaction',
                    action: 'refundtransaction'
                }]
        },{
            xtype: 'fieldset',
            title: 'Subscription',
            defaults: {
                xtype: 'button',
                style: 'margin-bottom: 10px;',
            },
            items: [{
                text: 'Charge User (Subscription)',
                action: 'subscription'
            },{
                xtype: 'fieldset',
                defaults: {
                    xtype: 'textfield',
                    labelWidth: 130
                },
                items:[
                    {name: 'subsAuthCode', label: 'Auth Code', value: ''},
                    {name: 'subscriptionId', label: 'Trx ID', value: ''},
                    {name: 'merchantSubscriptionId', label: 'Merchant ID', value: ''},
                    {name: 'consumerId', label: 'Consumer ID', value: ''}

                ]
            },{
                text: 'Subscription Status',
                action: 'subscriptionstatus'
            },{
                text: 'Subscription Details',
                action: 'subscriptiondetails'
            },{
                text: 'Refund Subscription',
                action: 'refundsubscription'
            }]
        }],

        control: {
            'button[action=singlepay]'          : {tap: 'onSinglePayTap'},
            'button[action=subscription]'       : {tap: 'onSubcriptionTap'},
            'button[action=transactionstatus]'  : {tap: 'onTransactionStatusTap'},
            'button[action=refundtransaction]'  : {tap: 'onRefundTransactionTap'},
            'button[action=subscriptiondetails]': {tap: 'onSubscriptionDetailsTap'},
            'button[action=subscriptionstatus]' : {tap: 'onSubscriptionStatusTap'},
            'button[action=refundsubscription]' : {tap: 'onRefundSubscriptionTap'}
        }
    },

    /**
     * Perform a single payment request to the API. On a success response it will populate the Authorization code so the user can retrieve the status of this payment.
     */
    onSinglePayTap: function() {
        var ts = new Date().getTime(),
            me = this;
        this.fireEvent('apicall', this, {
            method: 'requestPayment',
            paymentOptions: {
                'Amount': 0.99,
                'Category': 1,
                'Channel': 'MOBILE_WEB',
                'Description': 'D' + ts,
                'MerchantTransactionId': 'T' + ts,
                'MerchantProductId': 'P' + ts
            },
            success: function(results) {
                me.down("textfield[name=authcode]").setValue(results.TransactionAuthCode);
                me.down('textfield[name=transactionId]').setValue("");
            }
        });
    },
    
    /**
     * Gets the status of a transaction using the Authorization Code obtained when user performed a single payment.  
     */
    onTransactionStatusTap: function() {
        var me = this,
            authCode = me.down('textfield[name=authcode]').getValue();
        this.fireEvent('apicall', this, {
            method: 'getTransactionStatus',
            codeType: 'TransactionAuthCode',
            transactionId: authCode,
            success: function(results){
                me.down('textfield[name=transactionId]').setValue(results.TransactionId);
            }
        });
    },

    /**
     * Refunds the transaction based on the information retrieved by transaction status
     */
    onRefundTransactionTap: function() {
        var transactionId = this.down('textfield[name=transactionId]').getValue(),
            refundOptions = {
                "RefundReasonCode": 1,
                "RefundReasonText": "Customer was not happy"
            };
        
        this.fireEvent('apicall', this, {
            method: 'refundTransaction',
            transactionId: transactionId,
            refundOptions: refundOptions
        });
    },
    
    /**
     * Perform a Subscription payment and sets the authorization code retrieved from API if it was successful.
     */
    onSubcriptionTap: function() {
        var ts = new Date().getTime();
        
        this.fireEvent('apicall', this, {
            method: 'requestPaidSubscription',
            paymentOptions: {
                "Amount":0.99,
                "Category": 1,
                "Channel":"MOBILE_WEB",
                'Description': 'D' + ts,
                'MerchantTransactionId': 'T' + ts,
                'MerchantProductId': 'P' + ts,
                "MerchantSubscriptionIdList": "User" + ts + "Ls",
                "SubscriptionRecurringNumber":99999,
                "SubscriptionRecurringPeriod":"MONTHLY",
                "SubscriptionRecurringPeriodAmount":"1",
                "IsPurchaseOnNoActiveSubscription":"false"
            },
            success: function(results){
                console.log('Subscription',results);
                me.down('textfield[name=subsAuthCode]').setValue(results.TransactionAuthCode);
            }
        });
    },

    /**
     * Gets the Subscription status using the Authorization code set in subsAuthCode field.
     */
    onSubscriptionStatusTap: function() {
        var me = this,
        authCode = this.down('textfield[name=subsAuthCode]').getValue();
        this.fireEvent('apicall', this, {
            method: 'getSubscriptionStatus',
            codeType: 'TransactionAuthCode',
            transactionId: authCode,
            success: function(results){
                me.down('textfield[name=subscriptionId]').setValue(results.SubscriptionId); //needed to refund subscription
                me.down('textfield[name=merchantSubscriptionId]').setValue(results.MerchantSubscriptionId); //needed to get details
                me.down('textfield[name=consumerId]').setValue(results.ConsumerId);
                
            }
        });
    },

    /**
     * Gets the Subscription Details for the consumerId and merchantSubscriptionId fields.
     */
    onSubscriptionDetailsTap: function() {
        var me = this,
            consumerId = me.down('textfield[name=consumerId]').getValue(),
            merchantSubscriptionId = me.down('textfield[name=merchantSubscriptionId]').getValue();
        
        this.fireEvent('apicall', this, {
            method: 'getSubscriptionDetails',
            consumerId: consumerId,
            merchantSubscriptionId: merchantSubscriptionId
        });
    },

    /**
     * Refunds a Subscription by using the subscriptionId.
     */
    onRefundSubscriptionTap: function() {
        var transactionId = this.down('textfield[name=subscriptionId]').getValue(),
            refundOptions = {
                "RefundReasonCode": 1,
                "RefundReasonText": "Customer was not happy"
            };
    
        this.fireEvent('apicall', this, {
            method: 'refundTransaction',
            transactionId: transactionId,
            refundOptions: refundOptions
        });
    }

});