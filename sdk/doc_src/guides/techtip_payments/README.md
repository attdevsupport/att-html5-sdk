Payments Cookbook
===

Overview
---
This cookbook explains how to create an instance of the AttApiClient class in your app and use it to access methods in the HTML5 SDK for accepting payments (transactions), checking the status of transactions, refunding transactions, and accepting or cancelling recurring payments (subscriptions).

What do I need to start?
---

1. Include att-api-client.js as a dependency by adding the following code to your HTML:  

        <script type="text/javascript" src="att-api-client.js"></script>

Adjust the _src_ attribute value to match the site path where you store the _att_api_client.js_ file.


How do I create a transaction (i.e. single payment)?
---

1. Use the createTransactionUrl method. For more information about the parameters of this method, refer to AttApiClient.Payment.createTransactionUrl.
2. Define the success and failure callbacks as anonymous functions, or pass them as parameters.

<code>

	AttApiClient.Payment.createTransactionUrl({
		paymentOptions: {
			"amount" : 12.99,
			"category" : 1,
			"desc" : "Product description",
			"merch_prod_id" : "Product ID",
			"merch_trans_id" : "Your unique transaction identifier here",
			"redirect_uri" : "http://app.server.com/payment/callback"
		},
		success : onSuccess,
		failure : onFailure
	});

	//callback for success response
	function onSuccess(response){
		window.navigate(response.url);
		// Return to redirect_uri after the user has authorized the purchase
	};

	//callback for failed call
	function onFailure(error){
	  // Handle the error here
	  console.log(error);
	};

</code>  

###Tip: Keep the MerchantTransactionId

When submitting a payment request, you must provide your own unique identifier for the transaction - the **MerchantTransactionId**. This identifier must be unique for each transaction that you create, and must be saved as it is necessary for retrieving information about the transaction.

How do I create a subscription (i.e. recurring payment)?
---

Use the createSubscriptionUrl method. For more information about the parameters of this method, refer to AttApiClient.Payment.createSubscriptionUrl.

Define the success and failure callbacks as anonymous functions, or pass them as parameters.

<code>

	AttApiClient.Payment.createSubscriptionUrl({
		paymentOptions: {
			"amount" : 12.99,
			"category" : 1,
			"desc" : "Product description",
			"merch_prod_id" : "Product ID",
			"merch_trans_id" : "Your unique transaction identifier here",
			"merch_sub_id_list": ("List" + "38495").substring(0, 11),
			"sub_recurrences":99999,
			"redirect_uri" : "http://app.server.com/subscription/callback"
		},
		success : onSuccess,
		failure : onFailure
	});

	//callback for success response
	function onSuccess(response){
		window.navigate(response.url);
		// Return to redirect_uri after the user has authorized the purchase
	};

	//callback for failed call
	function onFailure(error){
	  // Handle the error here
	  console.log(error);
	};

</code>  


How do I check the status of a transaction or subscription?
---

1. Retrieve the MerchantTransactionId, TransactionAuthCode or SubscriptionAuthCode.

2. Use the getTransactionStatus method (for single payments) or getSubscriptionStatus method (for recurring payments). For more information about the required parameters for these methods, refer to AttApiClient.Payment.getTransactionStatus or AttApiClient.Payment.getSubscriptionStatus.


		var TransactionId;

		AttApiClient.Payment.getTransactionStatus({
        	type: "MerchantTransactionId", // Can be either MerchantTransacionId, TransactionAuthCode or TransactionId
            id: "Unique transaction identifier", // Value for the above specified codeType

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

1. Get the unique AT&T TransactionId by executing the getTransactionStatus method, as in the previous example.
2. Use the refundTransaction method. For more information about the required parameters for this method, refer to AttApiClient.Payment.refundTransaction.

		//... get TransactionId 

		AttApiClient.Payment.refundTransaction({
    	    transactionId : transaction.get('TransactionId'),
        	reasonId: 1,
            reasonText: "Customer was not happy"
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

1. Get the unique AT&T TransactionId by executing the getSubscriptionStatus method, as in the previous example.
2. Use the cancelSubscription method. For more information about the required parameters for this method, refer to AttApiClient.Payment.cancelSubscription

		//... get TransactionId 

		AttApiClient.Payment.cancelSubscription({
    	    transactionId : transaction.get('TransactionId'),
        	reasonId: 1,
            reasonText: "Customer was not happy"
        	},

        	success: function(response){
	       		//...
        	},

        	failure: function(error){
        		// ...
        	}

		});

