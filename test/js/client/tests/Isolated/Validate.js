/* * Validates response gotten by making new transaction. Checks that success is equal to 'true'. Checks for the existence of TransactionAuthCode
 * parameter.
 */
function validateNewTransactionResponse(response) {
	if (response) {
		notEqual(response["success"], undefined, "success");
		notEqual(response["TransactionAuthCode"], undefined, "TransactionAuthCode");
	}
}

/*
 * Validates response gotten by making new subscription. Checks that success is equal to 'true'. Checks for the existence of TransactionAuthCode
 * parameter.
 */
function validateNewSubscriptionResponse(response) {
	if (response) {
		notEqual(response["success"], undefined, "success");
		notEqual(response["TransactionAuthCode"], undefined, "TransactionAuthCode");
	}
}

/*
 * Validates response gotten by requesting transaction status. Checks for the existence of the Channel, Description, Currency, ConsumerId,
 * MerchantTransactionId, MerchantApplicationId, TransactionId, OriginalTransactionId, ContentCategory, MerchantProductId, MerchantIdentifier,
 * Amount, and Version parameters. Checks that TransactionType is equal to 'SINGLEPAY', TransactionStatus is equal to 'SUCCESSFUL', and isSuccess
 * is equal to 'true'.
 */
function validateTransactionStatus(response) {
	if (response) {
		notEqual(response["Channel"], undefined, "Channel");
		notEqual(response["Description"], undefined, "Description");
		notEqual(response["Currency"], undefined, "Currency");
		equal(response["TransactionType"], "SINGLEPAY", "TransactionType");
		equal(response["TransactionStatus"], "SUCCESSFUL", "TransactionStatus");
		notEqual(response["ConsumerId"], undefined, "ConsumerId");
		notEqual(response["MerchantTransactionId"], undefined, "MerchantTransactionId");
		notEqual(response["MerchantApplicationId"], undefined, "MerchantApplicationId");
		notEqual(response["TransactionId"], undefined, "TransactionId");
		notEqual(response["OriginalTransactionId"], undefined, "OriginalTransactionId");
		notEqual(response["ContentCategory"], undefined, "ContentCategory");
		notEqual(response["MerchantProductId"], undefined, "MerchantProductId");
		notEqual(response["MerchantIdentifier"], undefined, "MerchantIdentifier");
		notEqual(response["Amount"], undefined, "Amount");
		notEqual(response["Version"], undefined, "Version");
		notEqual(response["MerchantId"], undefined, "MerchantId");
		notEqual(response["IsAutoCommitted"], undefined, "IsAutoCommitted");
		notEqual(response["CreationTime"], undefined, "CreationTime");
		notEqual(response["AuthorizationTime"], undefined, "AuthorizationTime");
		equal(response["IsSuccess"], "true", "IsSuccess");
	}
}

/*
 * Validates response gotten by refunding a transaction or subscription. Checks for the existence of the TransactionId and Verion parameters. 
 * Checks that TransactionStatus is equal to 'SUCCESSFUL' and IsSuccess is equal to 'true'.
 */
function validateRefund(response) {
	if (response) {
		notEqual(response["TransactionId"], undefined, "TransactionId");
		equal(response["TransactionStatus"], "SUCCESSFUL", "TransactionStatus");
		notEqual(response["IsSuccess"], undefined, "IsSuccess");
		notEqual(response["Version"], undefined, "Version");
	}
}

/*
 * Validates response gotten by requesting transaction status. Checks for the existence of the Channel, Description, Currency, ConsumerId,
 * MerchantTransactionId, MerchantApplicationId, SubscriptionId, OriginalTransactionId, ContentCategory, MerchantProductId, MerchantIdentifier,
 * Amount, Version, PeriodAmount, MerchantSubscriptionId, Recurrences, and SubscriptionPeriod parameters. Checks that TransactionType is equal 
 * to 'SINGLEPAY', TransactionStatus is equal to 'SUCCESSFUL', isSuccess is equal to 'true', and IsAutoCommitted is equal to 'false'.
 */
function validateSubscriptionStatus(response) {
	if (response) {
		notEqual(response["Channel"], undefined, "Channel");
		notEqual(response["Description"], undefined, "Description");
		notEqual(response["Currency"], undefined, "USD");
		equal(response["SubscriptionType"], "SUBSCRIPTION", "SubscriptionType");
		equal(response["SubscriptionStatus"], "SUCCESSFUL", "SubscriptionStatus");
		notEqual(response["ConsumerId"], undefined, "ConsumerId");
		notEqual(response["MerchantTransactionId"], undefined, "MerchantTransactionId");
		notEqual(response["MerchantApplicationId"], undefined, "MerchantApplicationId");
		notEqual(response["SubscriptionId"], undefined, "SubscriptionId");
		notEqual(response["OriginalTransactionId"], undefined, "OriginalTransactionId");
		notEqual(response["ContentCategory"], undefined, "ContentCategory");
		notEqual(response["MerchantProductId"], undefined, "MerchantProductId");
		notEqual(response["MerchantIdentifier"], undefined, "MerchantIdentifier");
		notEqual(response["Amount"], undefined, "Amount");
		notEqual(response["Version"], undefined, "Version");
		equal(response["IsSuccess"], "true", "IsSuccess");
		notEqual(response["PeriodAmount"], undefined, "PeriodAmount");
		notEqual(response["MerchantSubscriptionId"], undefined, "MerchantSubscriptionId");
		notEqual(response["Recurrences"], undefined, "Recurrences");
		notEqual(response["SubscriptionPeriod"], undefined, "SubscriptionPeriod");
		notEqual(response["MerchantId"], undefined, "MerchantId");
		notEqual(response["IsAutoCommitted"], undefined, "IsAutoCommitted");
		notEqual(response["CreationTime"], undefined, "CreationTime");
		notEqual(response["AuthorizationTime"], undefined, "AuthorizationTime");
		notEqual(response["RenewalStatus"], undefined, "RenewalStatus");		
		notEqual(response["OriginalSubscriptionStartTime"], undefined, "OriginalSubscriptionStartTime");	
		equal(response["IsAutoCommitted"], "false", "IsAutoCommitted");
	}
}

/*
 * Validates response gotten by requesting subscription details. Checks for the existence of the IsActiveSubscription, Currency, CreationDate,
 * CurrentStartDate, CurrentEndDate, GrossAmount, Recurrences, RecurrencesLeft, Status, and Version parameters. Checks that IsSuccess is equal to
 * 'true'. 
 */
function validateSubscriptionDetails(response) {
	if (response) {
		notEqual(response["IsActiveSubscription"], undefined, "IsActiveSubscription");
		notEqual(response["Currency"], undefined, "Currency");
		notEqual(response["CreationDate"], undefined, "CreationDate");
		notEqual(response["CurrentStartDate"], undefined, "CurrentStartDate");
		notEqual(response["CurrentEndDate"], undefined, "CurrentEndDate");
		notEqual(response["GrossAmount"], undefined, "GrossAmount");
		notEqual(response["SubscriptionRecurrences"], undefined, "SubscriptionRecurrences");
		notEqual(response["SubscriptionRemaining"], undefined, "SubscriptionRemaining");
		notEqual(response["Status"], undefined, "Status");
		notEqual(response["Version"], undefined, "Version");
		equal(response["IsSuccess"], "true", "IsSuccess");
	}
}

function validateTransactionFailure(response) {
	if (response) {
		equal(response["IsSuccess"], "false", "IsSuccess");
		equal(response["Version"], "1", "Version");
		se = response["ServiceError"];
		notEqual(se, undefined, "ServiceError");
		if (se) {
			equal(se["FaultCode"], "PMT-0002", "FaultCode");
			equal(se["FaultDescription"], "Invalid parameter", "FaultDescription");
			notEqual(se["FaultMessage"], undefined, "FaultMessage");
		}
	}
}

function validateSubDetailsFailure(response) {
	
}