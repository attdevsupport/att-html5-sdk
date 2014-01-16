/**
 *
 * User Interface for the Single Pay application.
 *
 */
Ext.define('SampleApp.view.payment.SinglePay', {
    extend: 'Ext.Container',
    xtype: 'att-payment-singlepay',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config',
        'ux.ListWindow'
    ],
    
    config: {
        title: 'Single Payment App',
        scrollable: 'vertical',
        defaults: {scrollable: false},
        searchByField: null,
        searchByValue: null
    },
    
    //override
    initialize: function() {
        this.add([
             {xtype: 'att-header'},
             this.buildCreateTransactionForm(),
             this.buildTransactionStatusForm(),
             this.buildRefundTransactionForm(),
             {xtype: 'att-footer'}
        ]);
    },
    
    /**
     * Builds the UI components for Feature 1: Create New Transaction.
     */
    buildCreateTransactionForm: function() {
        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 1: Create New Transaction',
                    defaults : {
                        xtype : 'radiofield',
                        labelWidth : '80%'
                    },
                    items   : [
                        {
                            name    : 'productPrice',
                            value   : .99,
                            checked : true,
                            label   : 'Buy product1 for $0.99'
                        },
                        {
                            name    : 'productPrice',
                            value   : 2.99,
                            label   : 'Buy product2 for $2.99'
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'buyproduct',
                    text    : 'Buy Product'
                }
            ]
        };
    },


    buildTransactionStatusForm: function() {
        return {
            xtype: 'formpanel',
            itemId: 'transactionStatusForm',
            items: [{
                xtype    : 'fieldset',
                title    : 'Feature 2: Transaction Status',
                items:[{
                    xtype: 'fieldset',
                    defaults: {
                        labelWidth: '80%',
                    },
                    items: [{
                        xtype  : 'radiofield',
                        label  : 'Merchant Transaction ID',
                        name   : 'statusBy',
                        value  : 'MerchantTransactionId'
                    },{
                        xtype  : 'textfield',
                        name   : 'MerchantTransactionId',
                        readOnly : true
                        
                    }]
                },{
                    xtype  : 'fieldset',
                    defaults: {
                        labelWidth: '80%',
                    },

                    items  : [ {
                        xtype  : 'radiofield',
                        label  : 'Auth Code',
                        name   : 'statusBy',
                        value  : 'TransactionAuthCode'
                    },{
                        xtype  : 'textfield',
                        name   : 'TransactionAuthCode',
                        readOnly : true
                    }]
                },{
                    xtype  : 'fieldset',
                    defaults: {
                        labelWidth: '80%',
                    },

                    items  : [ {
                        xtype  : 'radiofield',
                        label  : 'Transaction ID',
                        name   : 'statusBy',
                        value  : 'TransactionId'
                    },{
                        xtype  : 'textfield',
                        name   : 'TransactionId',
                        readOnly : true
                    }]
                }]
            },{
                xtype  : 'button',
                ui     : 'action',
                action : 'transactionstatus',
                text   : 'Get Transaction Status'
            }]
        };
    },

    /**
     * Builds the UI components for Feature 4: Refund Transaction.
     */
    buildRefundTransactionForm: function() {
        var me = this;

        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Feature 3: Refund Transaction',
                    instructions : 'Select a Transaction to refund.',
                    defaults : {
                        labelWidth : '75%'
                    },
                    items : [
                        {
                            xtype        : 'list',
                            plugins      : [{
                               xclass: 'ux.ListWindow',
                               windowSize: 5
                            }],
                            singleSelect : true,
                            scrollable   : false,
                            itemTpl      : me.buildTpl(),
                            store        : 'SinglePayTransactions'
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'refundtransaction',
                    text    : 'Refund Transaction'
                }
            ]
        };
    },

    /**
     * Builds the Ext.XTemplate used by the Refund List.
     */
    buildTpl: function() {
        return new Ext.XTemplate(
            '<div class="tx-row">',
            '   <div>Transaction ID</div>',
            '   <div style="color:#666">{TransactionId}&nbsp;</div>',
            '   <div> Merchant Transaction ID</div>',
            '   <div style="color:#666">{MerchantTransactionId}</div>',
            '</div>'
        );
    }

});
