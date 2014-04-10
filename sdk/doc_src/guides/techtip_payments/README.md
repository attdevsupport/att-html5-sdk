Payments Cookbook
===

Overview
---
This cookbook explains how to create an instance of the AttApiClient class in your app and use it to access methods in the AT&T API Platform SDK for HTML5 for accepting payments (transactions), checking the status of transactions, refunding transactions, and accepting or canceling recurring payments (subscriptions).

What do I need to start?
---

1. Include att-api-client.js. Include att-api-client.js as a dependency by including it in your HTML:  

        <script type="text/javascript" src="att-api-client.js"></script>

Adjust the _src_ attribute value to match the site path where you store the _att_api_client.js_ file.


How do I create a one-time-only payment (transaction)?
---

1. **Execute the createTransactionUrl method. For more information about the parameters of this method, refer to AttApiClient.createTransactionUrl.**
2. **You can define the success and failure callbacks as anonymous functions or pass them as parameters.**

<code>

	AttApiClient.createTransactionUrl({
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
		// we'll return to redirect_uri after the user has authorized the purchase
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

Execute the createSubscriptionUrl method. For more information about the parameters of this method, refer to AttApiClient.createSubscriptionUrl.

You can define the success and failure callbacks as anonymous functions or pass them as parameters.

<code>

	AttApiClient.createSubscriptionUrl({
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
		// we'll return to redirect_uri after the user has authorized the purchase
	};

	//callback for failed call
	function onFailure(error){
	  //you can handle the error
	  console.log(error);
	};

</code>  


How do I check the status of a transaction or subscription?
---

1. **Save the MerchantTransactionId, TransactionAuthCode or SubscriptionAuthCode.** 

2. **Execute the getTransactionStatus method (for single payments) or getSubscriptionStatus method (for recurring payments). For more information about the required parameters for these methods, refer to AttApiClient.getTransactionStatus or AttApiClient.getSubscriptionStatus.**


		var TransactionId;

		AttApiClient.getTransactionStatus({
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

1. **Get the unique AT&T TransactionId by executing the getTransactionStatus method (as in the previous example).**
2. **Execute the refundTransaction method. For more information about the required parameters for this method, refer to AttApiClient.refundTransaction.**

		//... get TransactionId 

		AttApiClient.refundTransaction({
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

1. **Get the unique AT&T TransactionId by executing the getSubscriptionStatus method (as in the previous example).**
2. **Execute the cancelSubscription method. For more information about the required parameters for this method, refer to AttApiClient.cancelSubscription**

		//... get TransactionId 

		AttApiClient.cancelSubscription({
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
