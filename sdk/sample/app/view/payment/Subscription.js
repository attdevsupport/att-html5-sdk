/**
 *
 * User Interface for the Payment Subscription application
 *
 */
Ext.define('SampleApp.view.payment.Subscription', {
    extend: 'Ext.Container',
    xtype: 'att-payment-subscription',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'SampleApp.view.Header',
        'SampleApp.view.Footer',
        'SampleApp.Config',
        'ux.ListWindow'
    ],
    
    config: {
        title: 'Subscription App',
        scrollable: 'vertical',
        defaults: {scrollable: false}
    },
    
    //override
    initialize: function() {
        this.add([
            {xtype: 'att-header'},
            this.buildCreateSubsciptionForm(),
            this.buildSubscriptionStatusForm(),
            this.buildSubscriptionDetails(),
            {xtype: 'att-footer'}
        ]);
    },
    
    /**
     * Builds the UI components for Feature 1: Create New Subscription.
     */
    buildCreateSubsciptionForm: function() {
        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Create New Subscription',
                    defaults : {
                        xtype : 'radiofield',
                        labelWidth : '80%'
                    },
                    items   : [
                        {
                            name    : 'productPrice',
                            value   : 1.99,
                            checked : true,
                            label   : 'Subscribe for $1.99'
                        },
                        {
                            name    : 'productPrice',
                            value   : 3.99,
                            label   : 'Subscribe for $3.99'
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'createsubscription',
                    text    : 'Subscribe'
                }
            ]
        };
    },
   
    /**
     * Builds the UI components for Feature 2: Get Subscription Status.
     */
    buildSubscriptionStatusForm: function() {
        return {
            xtype   : 'formpanel',
            itemId  : 'subscriptionStatusForm',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Get Subscription Status',

                   items:[{
                       xtype: 'fieldset',
                       defaults: {
                           labelWidth: '80%',
                       },
                       items: [{
                           xtype  : 'radiofield',
                           label  : 'Merchant Subscription ID',
                           name   : 'statusBy',
                           value  : 'MerchantTransactionId' // this MUST BE MerchantTransactionId despite we are in subscriptions
                       },{
                           xtype  : 'textfield',
                           name   : 'MerchantTransactionId', // this MUST BE MerchantTransactionId despite we are in subscriptions
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
                           value  : 'SubscriptionAuthCode'
                       },{
                           xtype  : 'textfield',
                           name   : 'SubscriptionAuthCode',
                           readOnly : true
                       }]
                   },{
                       xtype  : 'fieldset',
                       defaults: {
                           labelWidth: '80%',
                       },

                       items  : [ {
                           xtype  : 'radiofield',
                           label  : 'Subscription ID',
                           name   : 'statusBy',
                           value  : 'SubscriptionId'
                       },{
                           xtype  : 'textfield',
                           name   : 'SubscriptionId',
                           readOnly : true
                       }]
                   }]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'subscriptionstatus',
                    text    : 'Get Subscription Status'
                }
            ]
        };
    },
    
    /**
     * Builds the UI components for Feature 3: Get Subscription Details.
     */
    buildSubscriptionDetails: function() {
        var me = this;

        return {
            xtype   : 'formpanel',
            items   : [
                {
                    xtype    : 'fieldset',
                    title    : 'Get Subscription Details',
                    instructions : 'Select a Subscription from the list to see details or refund it',
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
                            itemTpl      : me.buildSubscriptionDetailsTpl(),
                            store        : 'SubscriptionTransactions'
                        }
                    ]
                },
                {
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'subscriptiondetails',
                    text    : 'Get Subscription Details'
                },{
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'cancelsubscription',
                    text    : 'Cancel Subscription'
                },{
                    xtype   : 'button',
                    ui      : 'action',
                    action  : 'refundsubscription',
                    text    : 'Refund Subscription'
                }
            ]
        };
    },
    
    /**
     * Builds the checkbox configuration to allow user to see the response from API call.
     */
    buildShowResponse: function() {
        return {
            xtype: 'fieldset',
            title: 'Options',
            items:[{
                xtype: 'checkboxfield',
                name: 'showresults',
                label: 'Show Server Response',
                labelWidth : '70%'
            }]  
        };
    },
    
    /**
     * Builds the Ext.XTemplate used by the Subscription Details List.
     */
    buildSubscriptionDetailsTpl: function() {
        return new Ext.XTemplate(
                '<div class="tx-row">',
                '   <div>Consumer ID</div>',
                '   <div style="color:#666">{ConsumerId}</div>',
                '   <div> Merchant Subscription ID</div>',
                '   <div style="color:#666">{MerchantTransactionId}</div>',
                '</div>'        
        );
    }

});