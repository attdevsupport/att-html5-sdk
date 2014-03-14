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

get '/att/rest/3/Commerce/Payment/Transactions/:type/:id' do |type, id|
  content_type :json # set response type
  client = Auth::Client.new($config['apiKey'], $config['secretKey'])
  svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
  svc.getTransaction(type, id)
end

get '/att/rest/3/Commerce/Payment/Subscriptions/:type/:id' do |type, id|
  content_type :json # set response type
  client = Auth::Client.new($config['apiKey'], $config['secretKey'])
  svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
  svc.getSubscription(type, id)
end

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
