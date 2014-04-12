class Html5SdkApp < Sinatra::Base

  # @method post_att_security_notary_rest_1_signedpayload
  # @overload post '/att/Security/Notary/Rest/1/SignedPayload'
  #   @param payload [JSON body] The data to sign and encrypt.
  #   @return [JSON]
  #
  #   Sign and encrypt data, for later use by the payment endpoints.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/payment/notary for more details of the parameters and their allowed values.
  #
  post '/att/Security/Notary/Rest/1/SignedPayload' do 
    content_type :json # set response type
    payload = request.body.read
    client = Auth::Client.new($config['apiKey'], $config['secretKey'])
    svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
    svc.signPayload(payload)
  end

  # @method post_att_rest_3_commerce_payment_transactions
  # @overload post '/att/rest/3/Commerce/Payment/Transactions'
  #   @param payment [JSON body] Payment request details.
  #   @return [JSON] Authorization URL
  #
  #   Send payment details and receive an authorization URL.
  #   Navigating to the URL will display an AT&T authorization
  #   page allowing the user to verify the payment. When this
  #   completes, the page will redirect back to the payment
  #   callback endpoint on the SDK server, with querystring
  #   parameter details about the success or failure of the
  #   authorization.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/payment/docs for more details of the parameters and their allowed values.
  #
  post '/att/rest/3/Commerce/Payment/Transactions' do
    content_type :json # set response type
    payment = request.body.read
    begin
      payment = JSON.parse(payment)
    rescue JSON::ParserError => e
      return json_error(400, "payment request info was not valid JSON: #{e.message}")
    end
    client = Auth::Client.new($config['apiKey'], $config['secretKey'])
    svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
    url = svc.newTransaction(payment['amount'], payment['category'], payment['desc'], payment['merch_trans_id'], payment['merch_prod_id'], payment['redirect_uri'])
    {:url => url}.to_json
  end

  # @method post_att_rest_3_commerce_payment_subscriptions
  # @overload post '/att/rest/3/Commerce/Payment/Subscriptions'
  #   @param subscription [JSON body] Subscription request details.
  #   @return [JSON] Authorization URL
  #
  #   Send subscription details and receive an authorization URL.
  #   Navigating to the URL will display an AT&T authorization
  #   page allowing the user to verify the subscription. When this
  #   completes, the page will redirect back to the payment
  #   callback endpoint on the SDK server, with querystring
  #   parameter details about the success or failure of the
  #   authorization.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/payment/docs for more details of the parameters and their allowed values.
  #
  post '/att/rest/3/Commerce/Payment/Subscriptions' do
    content_type :json # set response type
    subscription = request.body.read
    begin
      subscription = JSON.parse(subscription)
    rescue JSON::ParserError => e
      return json_error(400, "subscription request info was not valid JSON: #{e.message}")
    end
    client = Auth::Client.new($config['apiKey'], $config['secretKey'])
    svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
    url = svc.newSubscription(subscription['amount'], subscription['category'], subscription['desc'], subscription['merch_trans_id'], subscription['merch_prod_id'], subscription['merch_sub_id_list'], subscription['sub_recurrences'], subscription['redirect_uri'])
    {:url => url}.to_json
  end

  # @method get_att_rest_3_commerce_payment_transactions_type_id
  # @overload get '/att/rest/3/Commerce/Payment/Transactions/{type}/{id}'
  #   @param type [URL path segment] The type of ID being used.
  #   @param id [URL path segment] The ID of the payment being queried.
  #   @return [JSON] Payment details
  #
  #   Get details about a particular payment.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/payment/docs for more details of the parameters and their allowed values.
  #
  get '/att/rest/3/Commerce/Payment/Transactions/:type/:id' do |type, id|
    content_type :json # set response type
    client = Auth::Client.new($config['apiKey'], $config['secretKey'])
    svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
    svc.getTransaction(type, id)
  end

  # @method get_att_rest_3_commerce_payment_subscriptions_type_id
  # @overload get '/att/rest/3/Commerce/Payment/Subscriptions/{type}/{id}'
  #   @param type [URL path segment] The type of ID being used.
  #   @param id [URL path segment] The ID of the subscription being queried.
  #   @return [JSON] Subscription details
  #
  #   Get details about a particular subscription.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/payment/docs for more details of the parameters and their allowed values.
  #
  get '/att/rest/3/Commerce/Payment/Subscriptions/:type/:id' do |type, id|
    content_type :json # set response type
    client = Auth::Client.new($config['apiKey'], $config['secretKey'])
    svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
    svc.getSubscription(type, id)
  end

  # @method put_att_rest_3_commerce_payment_transactions
  # @overload put '/att/rest/3/Commerce/Payment/Transactions'
  #   @param transactionId [querystring parameter] The ID of the payment or subscription to be modified.
  #   @param reasonId [querystring parameter] The number code explaining the reason for the modification.
  #   @param reasonText [querystring parameter] Text explaining the reason for the modification.
  #   @param reasonText [querystring parameter] 'Refunded' or 'SubscriptionCancelled'
  #   @return [JSON]
  #
  #   Cancel a subscription; or refund either a payment or a
  #   subscription.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/payment/docs for more details of the parameters and their allowed values.
  #
  put '/att/rest/3/Commerce/Payment/Transactions' do
    transaction_id = request.GET['transactionId']
    reason_id = request.GET['reasonId']
    reason_text = request.GET['reasonText']
    state = request.GET['state']
    
    if transaction_id.nil? or reason_id.nil? or reason_text.nil? or state.nil?
      return json_error(400, "one or more of the following required querystring parameters is missing: 'transactionId', 'reasonId', 'reasonText', 'state'")
    end
    
    transaction_id = URI.decode(transaction_id)
    reason_id = URI.decode(reason_id)
    reason_text = URI.decode(reason_text)
    state = URI.decode(state)
    
    if state == 'Refunded'
      state = Service::TransactionState::Refunded
    elsif state == 'SubscriptionCancelled'
      state = Service::TransactionState::SubscriptionCancelled
    else
      return json_error(400, "invalid 'state' querystring parameter; must be 'Refunded' or 'SubscriptionCancelled'")
    end
    client = Auth::Client.new($config['apiKey'], $config['secretKey'])
    svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)

    svc.refundTransaction(transaction_id, reason_id, reason_text, state)
  end

  # @method get_att_rest_3_commerce_payment_subscriptions_mid_detail_cid
  # @overload get '/att/rest/3/Commerce/Payment/Subscriptions/{merchant_subscription_id}/Detail/{consumer_id}'
  #   @param merchant_subscription_id [URL path segment] The number code explaining the reason for the modification.
  #   @param consumer_id [URL path segment] The ID of the payment or subscription to be modified.
  #   @return [JSON]
  #
  #   Get subscription details.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/payment/docs for more details of the parameters and their allowed values.
  #
  get '/att/rest/3/Commerce/Payment/Subscriptions/:mid/Detail/:cid' do
    consumer_id = URI.decode(params[:cid])
    merchant_subscription_id = URI.decode(params[:mid])
    client = Auth::Client.new($config['apiKey'], $config['secretKey'])
    svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
    svc.getSubscriptionDetails(consumer_id, merchant_subscription_id)
  end

  post '/att/payment/getnotification' do
  end

  post '/att/payment/acknotification' do
  end

  # @method get_att_payment
  # @overload get '/att/payment'
  #   @return [HTML]
  #
  #   Handle the redirect back to the SDK server after
  #   the user authorizes a payment or subscription.
  #
  get '/att/payment' do
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
    "<!DOCTYPE html><html><head><script>window.parent.postMessage('" + response.to_json + "', '*');</script></head><body></body></html>"
  end
end
