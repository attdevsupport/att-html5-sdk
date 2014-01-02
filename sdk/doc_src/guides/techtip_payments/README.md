Payments Cookbook
===

Overview
---
This guide explains the usage of the Att.Provider for accepting payments within your app using the AT&T HTML5 SDK Platform.

What do I need to start?
---
- Include Att.Provider by declaring it as a required on your class definition  

<code>
	Ext.define('MyApp.MyController', {
		extend  : 'Ext.Controller',
		requires: [
			'Att.Provider'
			//more dependencies here ... 
		],

		//...
	});
</code>

- Create an instance of Att.Provider

<code>    
	var provider = Ext.create('Att.Provider');
</code>


How do I create a one-time-only payment (transaction) ?
---

- Execute the requestPayment method. For more information about the parameters refer to Att.Provider.requestPayment documentation. 
- You can define the success/failure callbacks as anonymous functions or pass them as parameters.

<code>

	provider.requestPayment({
		paymentOptions: {
			"Amount" : 12.99,
			"Category" : 1,
			"Channel" : "MOBILE_WEB",
			"Description" : "Product description",
			"MerchantProductId" : "Product ID",
			"MerchantTransactionId" : "Your unique transaction identifier here"
		},
		success : onSuccess,
		failure : onFailure
	});

	//callback for success response
	function onSuccess(response){
		// you can handle here the response
		console.log(response);
	};

	//callback for failed call
	function onFailure(error){
	  //you can handle the error
	  console.log(error);
	};

</code>  

###Tip! Keep the MerchantTransactionId!

When submitting a payment request, you will be providing your own unique identifier for the transaction - the **MerchantTransactionId**. This identifier must be unique for each transaction you create and must be saved as they are necessary for retrieving information about transactions.

How do I create a recurring payment (subscription) ?
---

- Execute the requestPaidSubscription method. For more information about the parameters refer to Att.Provider.requestPaidSubscription documentation. 
- You can define the success/failure callbacks as anonymous functions or pass them as parameters.

<code>

	provider.requestPaidSubscription({
		paymentOptions: {
			"Amount": : 9.99,
			"Category":1,
			"Channel":"MOBILE_WEB",
			"Description":"Word subscription 1",
			"MerchantProductId":"wordSubscription1",
			"MerchantTransactionId":"Your unique transaction id here",
			"MerchantSubscriptionIdList": ("List" + "38495").substring(0, 11),
			"SubscriptionRecurrences":99999,
			"SubscriptionPeriod":"MONTHLY",
			"SubscriptionPeriodAmount":"1",
			"IsPurchaseOnNoActiveSubscription":"false" // setting to true returns that the charge is a SINGLEPAY
		},
		success : onSuccess,
		failure : onFailure
	});

	//callback for success response
	function onSuccess(response){
		// you can handle here the response
		console.log(response);
	};

	//callback for failed call
	function onFailure(error){
	  //you can handle the error
	  console.log(error);
	};

</code>  


###Tip! You may wish to save the Authorization Code.
  
When either a single or recurring transaction is successful, the response returned from the AT&T will include an authorization code. You can use this to lookup this individual transaction as well.

<code>

	//...

	function onSuccess(response) {

		var AuthorizationCode = response.TransactionAuthCode;

		//...
	}

	//... 

</code>


How do I check the status of a transaction or subscription ?
---

- Save the MerchantTransactionId, TransactionAuthCode or SubscriptionAuthCode.

	<code>
		var merchantTransactionId,
			authCode,
			transactionId;

		//...

		provider.requestPayment({
			//... payment parameters here 

		});

		function onSuccess(response) {
			authCode = response.TransactionAuthCode;
		}

	</code>

- Execute the getTransactionStatus (for single payments) or getSubscriptionStatus (for recurring payments) methods. For more information about required parameters, you may consult the Att.Provider.getTransactionStatus or Att.Provider.getSubscriptionStatus documentation.

	<code>
	
		var TransactionId;

		provider.getTransactionStatus({
        	codeType: "MerchantTransactionId", // Can be either MerchantTransacionId, TransactionAuthCode or TransactionId
            transactionId: "Unique transaction identifier", // Value for the above specified codeType

            success: function(response) {
            	TransactionId = response.TransactionId;

            	//...
        	},

        	failure: function(error) {
        		console.log(error);
        	}
		};

	</code> 
	
How do I refund a transaction ?
---

- Get the unique AT&T TransactionId by executing the getTransactionStatus method (see above).
- Execute the refundTransaction method. For more information about required parameters, you may consult the Att.Provider.refundTransaction documentation.

<code>
	//... get TransactionId 

	provider.refundTransaction({
        transactionId : transaction.get('TransactionId'),
        refundOptions : {
            "RefundReasonCode": 1,
            "RefundReasonText": "Customer was not happy"
        },

        success: function(response){
	       	//...
        },

        failure: function(error){
        	// ...
        }

	});

</code> 


###Tip! While a single payment transaction can be refunded, a subscription cannot. 

A subscription can only be cancelled which prevents further recurring charges from being applied to the customer's account.
