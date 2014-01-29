package com.sencha.att.provider;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import org.json.JSONException;
import org.json.JSONObject;

import com.sencha.att.AttConstants;

/**
 *
 * Payment class provides methods for charging the user and managing transactions and subscriptions.
 * @class com.sencha.att.provider.Payment
 *
 */
public class Payment {

    private static final String DEFAULT_PAYMENT_CHANNEL = "MOBILE_WEB";
	private static final String SUBSCRIPTIONS = "/Subscriptions/";
    private static final String TRANSACTIONS = "/Transactions/";
    private static final String NOTIFICATIONS = "/Notifications/";
    private static final String PAYMENTS_BASE_PATH = "/rest/3/Commerce/Payment";

    private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);


    /**
     * @property {String} TYPE_SUBSCRIPTION
     */
    public static String TYPE_SUBSCRIPTION ="SUBSCRIPTION";

    /**
     * @property {String} TYPE_SINGLEPAY
     */
    public static String TYPE_SINGLEPAY ="SINGLEPAY";


    private String host;
    private String clientId;
    private String clientSecret;

    /**
     * @param {String} host
     * @param {String} clientId
     * @param {String} clientSecret
     * @constructor
     */
    public Payment(String host, String clientId, String clientSecret) {
        this.host = host;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    /**
     * First, it calls Notary to sign the payment request, then forwards the request
     * to either Subscription or Single Pay, depending on the type passed.
     * Assuming both calls are successful, a JSON object with an adviceOfChargeUrl will be returned.
     * The user will be directed to this url to authorize the charge against their account.
     *
     * @param type
     * @param paymentDetails
     * @return JSONObject with the {"adviceOfChargeUrl":https://someurl"} that the user needs to be redirected to.
     * @throws ApiRequestException
     * @method requestChargeAuth
     */
    public ApiResponse requestChargeAuth(String type, JSONObject paymentDetails) throws ApiRequestException {


        ApiResponse paycall = null;

        try {

        	//putOpt, if MerchantPaymentRedirectUrl is not already defined then add it.
            paymentDetails.putOpt("MerchantPaymentRedirectUrl", AttConstants.PAYMENTCOMPLETECALLBACK);

            NotaryProvider notary = new NotaryProvider(this.host, this.clientId, this.clientSecret);

            ApiResponse response = notary.signPayload(paymentDetails);

            String signedPaymentDetail;

            signedPaymentDetail = response.getResponse().getString("SignedDocument");
            String signature = response.getResponse().getString("Signature");

            paycall = this.chargeUser(type, signature, signedPaymentDetail);

        } catch (JSONException e) {
            e.printStackTrace();
        }



        return paycall;


    }

    /**
     * Get the advice of charge url for a signed payment request.
     *
     * @param type
     * @param signature
     * @param signedPaymentDetail
     * @return
     * @throws ApiRequestException
     * @method chargeUser
     */
    public ApiResponse chargeUser(String type, String signature, String signedPaymentDetail) throws ApiRequestException {

        String url = host + PAYMENTS_BASE_PATH;

        if(TYPE_SUBSCRIPTION.equals(type)) {
            url += "/Subscriptions";
        } else if(TYPE_SINGLEPAY.equals(type)) {
            url += "/Transactions";
        }

        url += "?clientid=" + this.clientId + "&Signature=" + signature + "&SignedPaymentDetail=" + signedPaymentDetail;



		log.info("Payment :: chargeUser GET to url: " +url);

        ApiResponse results = ApiRequestManager.get(url);

        if(results.getRedirectUrl() != null) {
            JSONObject obj = new JSONObject();
            try {
                obj.put("adviceOfChargeUrl", results.getRedirectUrl());
            } catch (JSONException e) {
                e.printStackTrace();
            }
            ApiResponse response = new ApiResponse(results.getStatusCode(), null,obj, null);
            
    		log.info("Payment :: chargeUser Response: " + response.toJson());
            return response;
        } else {
            throw new ApiRequestException("Expected a redirect from Payment call got " + results.getStatusCode(), results.getStatusCode(), results.getRawBody());
        }
    }


    /**
     * For a valid subscription id type and a valid id of that type, get the status of a subscription.
     * @param accessToken
     * @param type
     * @param subscriptionId
     * @return
     * @throws ApiRequestException
     * @method subscriptionStatus
     */
    public ApiResponse subscriptionStatus(String accessToken, String type, String subscriptionId) throws ApiRequestException {
        String url = host + PAYMENTS_BASE_PATH + SUBSCRIPTIONS + type + "/" +subscriptionId;
        Map<String, String> headers = new HashMap<String, String>();

        headers.put("Authorization", "Bearer "+accessToken);

        log.info("Payment :: subscriptionStatus GET to url: " + url);

        ApiResponse response  = ApiRequestManager.get(url, headers);
        
		log.info("Payment :: subscriptionStatus Response: " + response.toJson());

        return response;

    }

    /**
     * For a valid subscription id type and a valid id of that type, get the details of a subscription.
     *
     * @param accessToken
     * @param merchantSubscriptionId
     * @param consumerId
     * @return
     * @throws ApiRequestException
     * @method subscriptionDetails
     */
    public ApiResponse subscriptionDetails(String accessToken, String merchantSubscriptionId, String consumerId) throws ApiRequestException {
        String url = host + PAYMENTS_BASE_PATH + SUBSCRIPTIONS +merchantSubscriptionId+ "/Detail/" +consumerId;
        Map<String, String> headers = new HashMap<String, String>();

        headers.put("Authorization", "Bearer "+accessToken);
        
        log.info("Payment :: subscriptionDetails GET to url: " + url);

        ApiResponse response  = ApiRequestManager.get(url, headers);

		log.info("Payment :: subscriptionDetails Response: " + response.toJson());

        return response;

    }

    
    /**
     * Refund a transaction using a refund reason code and text
     * @param accessToken
     * @param transactionId
     * @param refundReasonCode
     * @param refundReasonText
     * @return
     * @throws JSONException
     * @throws ApiRequestException
     */
    public ApiResponse refundTransaction(String accessToken, String transactionId,String refundReasonCode, String refundReasonText) throws JSONException, ApiRequestException{
    	JSONObject refund =  new JSONObject();
    	refund.put("TransactionOperationStatus", "Refunded");
    	refund.put("RefundReasonCode", refundReasonCode);
    	refund.put("RefundReasonText", refundReasonText);
    	return refundTransaction(accessToken, transactionId, refund);
    }
    
    /**
     * Cancel a subscription using a cancel reason code and text
     * @param accessToken
     * @param transactionId
     * @param cancelReasonCode
     * @param cancelReasonText
     * @return
     * @throws JSONException
     * @throws ApiRequestException
     */
    public ApiResponse cancelSubscription(String accessToken, String transactionId, String cancelReasonCode, String cancelReasonText) throws JSONException, ApiRequestException{
    	JSONObject refund =  new JSONObject();
    	refund.put("TransactionOperationStatus", "SubscriptionCancelled");
    	refund.put("RefundReasonCode", cancelReasonCode);
    	refund.put("RefundReasonText", cancelReasonText);
    	return refundTransaction(accessToken, transactionId, refund);
    }


    /**
     * Refund a transaction id.  You must supply a JSON Object with the refund reason code.
     * @param accessToken
     * @param transactionId
     * @param details
     * @return
     * @throws ApiRequestException
     * @method refundTransaction
     */
    public ApiResponse refundTransaction(String accessToken, String transactionId, JSONObject details) throws ApiRequestException {
        String url = host + PAYMENTS_BASE_PATH + TRANSACTIONS +transactionId + "?Action=refund";

        Map<String, String> headers = new HashMap<String, String>();

        headers.put("Authorization", "Bearer "+accessToken);
        
        log.info("Payment :: refundTransaction PUT to url " + url);
        log.info("Payment :: refundTransaction Request: " + details);
        /*
         *
         * {
            "RefundReasonCode":1,
            "RefundReasonText":"Customer was not happy"
            }
         *
         */
        ApiResponse response  = ApiRequestManager.put(url, details, headers);

		log.info("Payment :: refundTransaction Response: " + response.toJson());

        
        return response;
    }


    /**
     * Get the transaction status
     *
     * @param accessToken
     * @param type  String for the type of transaction id being passed "TransactionAuthCode" or "MerchantTransactionId" or "TransactionId"
     * @param transactionId the id of the transaction to check.
     * @return
     * @throws ApiRequestException
     * @method transactionStatus
     */
    public ApiResponse transactionStatus(String accessToken, String type, String transactionId) throws ApiRequestException {
        String url = host + PAYMENTS_BASE_PATH + TRANSACTIONS + type + "/" + transactionId;

        Map<String, String> headers = new HashMap<String, String>();

        headers.put("Authorization", "Bearer "+accessToken);
        
        log.info("Payment :: transactionStatus GET to url: " + url);

        ApiResponse response  = ApiRequestManager.get(url, headers);

        log.info("Payment :: transactionStatus Response: " + response.toJson());
        
        return response;
    }


    /**
     * Gets the notification details for a notificationId
     * @param accessToken
     * @param notificationId
     * @method getNotification
     */
    public ApiResponse getNotification(String accessToken, String notificationId) throws ApiRequestException {
        String url = host + PAYMENTS_BASE_PATH + NOTIFICATIONS +notificationId;
        Map<String, String> headers = new HashMap<String, String>();

        headers.put("Authorization", "Bearer "+accessToken);
        log.info("Payment :: getNotification GET to url: " + url);

        ApiResponse response  = ApiRequestManager.get(url, headers);

		log.info("Payment :: getNotification Response: " + response.toJson());
        
        return response;
    }

    /**
     * acknowledge the receipt of a notificationId
     * @param accessToken
     * @param notificationId
     * @method acknowledgeNotification
     */
    public ApiResponse acknowledgeNotification(String accessToken, String notificationId) throws ApiRequestException {
        String url = host + PAYMENTS_BASE_PATH + NOTIFICATIONS +notificationId;
        Map<String, String> headers = new HashMap<String, String>();

        headers.put("Authorization", "Bearer "+accessToken);
        
        log.info("Payment :: acknowledgeNotification PUT to: " + url);

        ApiResponse response  = ApiRequestManager.put(url, null, headers);
        
		log.info("Payment :: acknowledgeNotification Response: " + response.toJson());

        return response;
    }

    
    
    /**
     * Creates a JSONObject representing a Subscription Payment based on the given parameters
     * @param amount Amount of Transaction with a maximum of 2 decimals
     * @param category Product category
     * @param paymentDescription Short description of the entire purchase
     * @param productDescription Product name or short description
     * @param merchantTransactionId the id for the merchantTransaction.
     * @param paymentRedirectUrl url used when the transaction is completed
     * @param merchantSubscriptionIdList One or more subscription IDs that this transaction is associated with. Each ID has a maximum length of 12 alphanumeric characters, and commas are used to separate the values.  
     * @param freePeriods Number of free days before charging begings. Range is 0-90 
     * @return
     * @throws JSONException
     */
    public static JSONObject createSubscriptionPaymentDescription(double amount, int category, String paymentDescription, String productDescription, String merchantTransactionId, String paymentRedirectUrl, String merchantSubscriptionIdList, int freePeriods) throws JSONException{
    	JSONObject payment = createSinglePaymentDescription(amount, category, paymentDescription, productDescription, merchantTransactionId, paymentRedirectUrl);
    	payment.put("MerchantSubscriptionIdList", merchantSubscriptionIdList);
    	payment.put("SubscriptionRecurrences", 99999);
    	payment.put("SubscriptionPeriod", "MONTHLY");
    	payment.put("SubscriptionPeriodAmount", 1);
    	payment.put("IsPurchaseOnNoActiveSubscription", false);
    	payment.put("FreePeriods", freePeriods);
    	return payment;
    }

    
    /**
     * Creates a JSONObject representing a Single Payment based on the given parameters
     * @param amount Amount of Transaction with a maximum of 2 decimals
     * @param category Product category
     * @param paymentDescription Short description of the entire purchase
     * @param productDescription Product name or short description
     * @param merchantTransactionId the id for the merchantTransaction.
     * @param paymentRedirectUrl url used when the transaction is completed
     * @return
     * @throws JSONException
     */
    public static JSONObject createSinglePaymentDescription(double amount, int category, String paymentDescription, String productDescription, String merchantTransactionId, String paymentRedirectUrl) throws JSONException{
    	JSONObject payment = new JSONObject();
		payment.put("Amount", amount);
		payment.put("Category", category);
		payment.put("Channel", DEFAULT_PAYMENT_CHANNEL);
		payment.put("Description", paymentDescription);
		payment.put("MerchantTransactionId", merchantTransactionId);
		payment.put("MerchantProductId", productDescription);
    	payment.put("MerchantPaymentRedirectUrl", paymentRedirectUrl);
    	return payment;
    }
    
    /**
     * Create a description JSONObject to be used on refundTransaction
     * @param refundReasonCode
     * @param refundReasonText
     * @return
     * @throws JSONException
     */
    public static JSONObject refundTransactionDescription(String refundReasonCode, String refundReasonText) throws JSONException{
    	JSONObject refund =  new JSONObject();
    	refund.put("TransactionOperationStatus", "Refunded");
    	refund.put("RefundReasonCode", refundReasonCode);
    	refund.put("RefundReasonText", refundReasonText);
    	return refund;
    }
    
    /**
     * Create a description JSONObject to be used on refundTransaction
     * @param cancelReasonCode
     * @param cancelReasonText
     * @return
     * @throws JSONException
     */
    public static JSONObject cancelSubscriptionDescription(String cancelReasonCode, String cancelReasonText) throws JSONException{
    	JSONObject refund =  new JSONObject();
    	refund.put("TransactionOperationStatus", "SubscriptionCancelled");
    	refund.put("RefundReasonCode", cancelReasonCode);
    	refund.put("RefundReasonText", cancelReasonText);
    	return refund;    	
    }

    
}
