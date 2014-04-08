Payments Cookbook
===

Overview
---
This cookbook explains how to create an instance of the Att.Provider class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 for accepting payments (transactions), checking the status of transactions, refunding transactions, and accepting or canceling recurring payments (subscriptions).

What do I need to start?
---

1. **Include Att.Provider as a dependency by declaring it in the "requires" section of your class definition**  

		Ext.define('MyApp.MyController', {
			extend  : 'Ext.Controller',
			requires: [
				'Att.Provider'
				//more dependencies here ... 
			],

			//...
		});

2. **Create an instance of the Att.Provider class**

		var provider = Ext.create('Att.Provider');


How do I create a one-time-only payment (transaction)?
---

1. **Execute the requestPayment method. For more information about the parameters of this method, refer to Att.Provider.requestPayment.**
2. **You can define the success and failure callbacks as anonymous functions or pass them as parameters.**

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

###Tip! Keep the MerchantTransactionId

When submitting a payment request, you must provide your own unique identifier for the transaction - the **MerchantTransactionId**. This identifier must be unique for each transaction that you create and must be saved as it is necessary for retrieving information about the transaction.

How do I create a recurring payment (subscription)?
---

Execute the requestPaidSubscription method. For more information about the parameters of this method, refer to Att.Provider.requestPaidSubscription. 

You can define the success and failure callbacks as anonymous functions or pass them as parameters.

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


###Tip! Save the Authorization Code
  
When either a single or recurring transaction is successful, the response returned from the AT&T API will include an authorization code that can be used to lookup the individual transaction.

<code>

	//...

	function onSuccess(response) {

		var AuthorizationCode = response.TransactionAuthCode;

		//...
	}

	//... 

</code>


How do I check the status of a transaction or subscription?
---

1. **Save the MerchantTransactionId, TransactionAuthCode or SubscriptionAuthCode.** 

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


2. **Execute the getTransactionStatus method (for single payments) or getSubscriptionStatus method (for recurring payments). For more information about the required parameters for these methods, refer to Att.Provider.getTransactionStatus or Att.Provider.getSubscriptionStatus.**


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

	
How do I refund a transaction?
---

1. **Get the unique AT&T TransactionId by executing the getTransactionStatus method (as in the previous example).**
2. **Execute the refundTransaction method. For more information about the required parameters for this method, refer to Att.Provider.refundTransaction.**

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


How do I cancel a subscription?
---

1. **Get the unique AT&T TransactionId by executing the getTransactionStatus method (as in the previous example).**
2. **Execute the cancelSubscription method. For more information about the required parameters for this method, refer to Att.Provider.cancelSubscription**

		//... get TransactionId 

		provider.cancelSubscription({
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
