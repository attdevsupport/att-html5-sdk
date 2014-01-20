=begin rdoc
/**
 * @class Sencha.ServiceProvider.Att
 */
=end
module Sencha
  module ServiceProvider
    module Att

=begin rdoc
/**
 * requestChargeAuth
 *
 * @param {String} access_token The OAuth access token
 * @param {String} type Payment type
 * @param {Hash} payment_details A hash of payment options that include:
 *   @param {Number} payment_details.amount The payment amount
 *   @param {String} payment_details.product_id A product identifier
 *   @param {String} payment_details.transaction_id A unique transaction ID
 *   @param {String} payment_details.description A description of the payment
 *
 * @method requestChargeAuth
 */
=end
      def requestChargeAuth(access_token, type, payment_details)

        if payment_details[:MerchantPaymentRedirectUrl].nil?
          payment_details[:MerchantPaymentRedirectUrl] = "#{@local_server}/att/payment"
        end
        signed = signPayload(payment_details)

        if Sencha::DEBUG == :all
          @agent.log.debug "signed.data['SignedDocument'] = "
          @agent.log.debug signed.data['SignedDocument']
        end

        signed_document = signed.data['SignedDocument']
        signature = signed.data['Signature']

        paycall = chargeUser(type, signature, signed_document)
        return paycall

      end

=begin rdoc
/**
 * chargeUser
 * @param {String} type the type of charge (SUBSCRIPTION or SINGLEPAY
 * @param {String} signature
 * @param {String} signed_document the signed payload
 * @method chargeUser
 */
=end
      def chargeUser(type, signature, signed_document)
        puts 'START chargeUser'

        begin

          if type == "SUBSCRIPTION"
            type = "Subscriptions"
          end

          if type == "SINGLEPAY"
            type = "Transactions"
          end

          url = "#{@base_url}/rest/3/Commerce/Payment/#{type}?clientid=#{@client_id}&Signature=#{signature}&SignedPaymentDetail=#{signed_document}"
          chargeUrl = get_header_location(url)

          response = {
            :adviceOfChargeUrl => chargeUrl
          }

        rescue Exception => e
          Response.new e
        end
      end

=begin rdoc
/**
 * Sign a document
 * @param {Object} to_sign the JSON object to sign
 * @method signPayload
 */
=end
      def signPayload(to_sign)
        json_post("#{@base_url}/Security/Notary/Rest/1/SignedPayload?&client_id=#{@client_id}&client_secret=#{@client_secret}", to_sign.to_json)
      end

=begin rdoc
/**
 * Issues a refund for a transaction
 *
 * @param {String} access_token The OAuth access token
 * @param {String} transaction_id The id of the transaction
 * @param {String} details The json data
 *
 * @method refundTransaction
 */
=end
      def refundTransaction(access_token, transaction_id, details)
        url = "#{@base_url}/rest/3/Commerce/Payment/Transactions/#{transaction_id}?Action=refund"
        
        json_put(url, details.to_json, {"Authorization"  => "Bearer #{access_token}"})
      end

=begin rdoc
/**
 * Queries the status of a transaction
 *
 * @param {String} access_token The OAuth access token
 * @param {String} type The type of transaction (e.g. TransactionAuthCode, etc.)
 * @param {String} id
 *
 * @method transactionStatus
 */
=end
      def transactionStatus(access_token, type, id)
        url = "#{@base_url}/rest/3/Commerce/Payment/Transactions/#{type}/#{id}"
        json_get(url, {"Authorization"  => "Bearer #{access_token}"})
      end

=begin rdoc
/**
 * Queries the status of a subscription
 *
 * @param {String} access_token - the OAuth access token
 * @param {String} type - the type of transaction (e.g. TransactionAuthCode, etc.)
 * @param {String} id
 *
 * @method subscriptionStatus
 */
=end
      def subscriptionStatus(access_token, type, id)
        url = "#{@base_url}/rest/3/Commerce/Payment/Subscriptions/#{type}/#{id}"
        json_get(url, {"Authorization"  => "Bearer #{access_token}"})
      end

=begin rdoc
/**
 * Retrieves the subscription details
 *
 * @param {String} access_token The OAuth access token
 * @param {String} merchant_subscription_id The merchant subscription id
 * @param {String} consumer_id The consumer id
 *
 * @method subscriptionDetails
 */
=end
      def subscriptionDetails(access_token, merchant_subscription_id, consumer_id)
        url = "#{@base_url}/rest/3/Commerce/Payment/Subscriptions/#{merchant_subscription_id}/Detail/#{consumer_id}"
        json_get(url, {"Authorization"  => "Bearer #{access_token}"})
      end

=begin rdoc
/**
 * Retrieves a notification object
 *
 * @param {String} access_token The OAuth access token
 * @param {String} notification_id The notification id
 *
 * @method getNotification
 */
=end
      def getNotification(access_token, notification_id)
        url = "#{@base_url}/rest/3/Commerce/Payment/Notifications/#{notification_id}"
        json_get(url, {"Authorization"  => "Bearer #{access_token}"})
      end

=begin rdoc
/**
 * Stops the notification from being sent to the notification callback
 *
 *  {String} access_token The OAuth access token
 *  {String} notification_id The notification id
 *
 * @method acknowledgeNotification
 */
=end
      def acknowledgeNotification(access_token, notification_id)
        url = "#{@base_url}/rest/3/Commerce/Payment/Notifications/#{notification_id}"
        json_put(url, '', {"Authorization"  => "Bearer #{access_token}"})
      end

=begin rdoc
/**
 * Processes the payment callback redirect url
 *
 * Looks for the TransactionAuthCode and if found, sends it back to the client
 * if not found, it sends back the error info
 * @param {Object} params the params from the http response
 * @method processPaymentCallback
 */
=end
     def processPaymentCallback(params)

       response = Hash.new

       transactionAuthCode = params[:TransactionAuthCode] || params[:SubscriptionAuthCode]

       if !transactionAuthCode.nil?

         response[:success] = true
         response[:TransactionAuthCode] = transactionAuthCode

      else
        # Check for errors
        # attempt to normalize error messsages...
        response[:success] = false

         # If the payment fails to complete the app will have one set of query parameters.
         if params[:success] == "false"
           response[:error_reason] = params[:faultCode]
           response[:error_description] = params[:faultDescription]
         else
           # If the user submits a 'cancel' then we receive a different set of errors.
           response[:error] = params[:error]
           response[:error_reason] = params[:error_reason]
           response[:error_description] = params[:error_description]
         end

       end

       # send back our JSON wrapped in html
       content_type 'text/html'
       REDIRECT_HTML_PRE + response.to_json + REDIRECT_HTML_POST

     end

=begin rdoc
/**
 * Process the notification callback url
 *
 * @param {Object} request the request object from the http request
 * @param {Object} params the params object from the http request
 *
 * @method processPaymentNotification
 */
=end
     def processPaymentNotification(request, params)
       puts "Processing payment notification"
       notification_ids = Crack::XML.parse(request.body)
       notification_ids['hub:notifications']['hub:notificationId'].each do |id|
         puts "notificationId=#{id}"
         token = get_client_model_token('getNotification')
         getNotification(token, id)
         acknowledgeNotification(token, id)
       end
     end

     
     
=begin rdoc
 /**
  * Creates a JSONObject representing a Single Payment based on the given parameters
  * @param amount Amount of Transaction with a maximum of 2 decimals
  * @param category Product category
  * @param paymentDescription Short description of the entire purchase
  * @param productDescription Product name or short description
  * @param merchantTransactionId the id for the merchantTransaction.
  * @param paymentRedirectUrl url used when the transaction is completed
  * @method createSinglePaymentDescription
  */
=end
     def createSinglePaymentDescription(amount, category, paymentDescription, productDescription, merchantTransactionId, paymentRedirectUrl)
       return {
         "Amount" => amount,
         "Category" => category,
         "Channel" => "MOBILE_WEB",
         "Description" => paymentDescription,
         "MerchantTransactionId" =>  merchantTransactionId,
         "MerchantProductId"  => productDescription,
         "MerchantPaymentRedirectUrl"  => paymentRedirectUrl
       }
     end

=begin rdoc
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
  * @method createSubscriptionPaymentDescription
  */
=end
     def createSubscriptionPaymentDescription(amount, category, paymentDescription, productDescription, merchantTransactionId, paymentRedirectUrl, merchantSubscriptionIdList, freePeriods)
       payment = createSinglePaymentDescription(amount,category,paymentDescription,productDescription, merchantTransactionId, paymentRedirectUrl)
       payment[:MerchantSubscriptionIdList] = merchantSubscriptionIdList
       payment[:SubscriptionRecurrences] = 99999
       payment[:SubscriptionPeriod] = "MONTHLY"
       payment[:SubscriptionPeriodAmount] = 1
       payment[:IsPurchaseOnNoActiveSubscription] = false
       payment[:FreePeriods] = freePeriods
       
       return payment
    end

=begin rdoc

=end    
    def refundTransactionDescription(refundReasonCode, refundReasonText)
      return {
              "TransactionOperationStatus" => "Refunded",
              "RefundReasonCode" => refundReasonCode,
              "RefundReasonText" => refundReasonText  
            }
    end

=begin rdoc

=end        
    def cancelSubscriptionDescription(cancelReasonCode, cancelReasonText)
      return {
              "TransactionOperationStatus" => "SubscriptionCancelled",
              "RefundReasonCode" => cancelReasonCode,
              "RefundReasonText" => cancelReasonText  
            }
    end
    
    end
  end
end