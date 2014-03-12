post '/att/rest/3/Commerce/Payment/Transactions' do
  content_type :json
  payment = request.body.read
  begin
    payment = JSON.parse(payment)
  rescue JSON::ParserError => e
    return json_error(400, "payment request info was not valid JSON: #{e.message}")
  end
  client = Auth::Client.new($config['apiKey'], $config['secretKey'])
  svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
  url = svc.newTransaction(payment['amount'], payment['category'], payment['desc'], payment['merch_trans_id'], payment['merch_prod_id'], payment['redirect_uri'])
  { :url => url}.to_json
end

get '/att/rest/3/Commerce/Payment/Transactions/:type/:id' do |type, id|
  content_type :json
  client = Auth::Client.new($config['apiKey'], $config['secretKey'])
  svc = Service::PaymentService.new($config['apiHost'], $client_token, :raw_response => true, :client => client)
  svc.getTransaction(type, id)
end

post '/att/payment/newsubscription' do
end

post '/att/payment/getsubscription' do
end

post '/att/payment/getsubscriptiondetails' do
end

post '/att/payment/refundtransaction' do
end

post '/att/payment/cancelsubscription' do
end

post '/att/payment/getnotification' do
end

post '/att/payment/acknotification' do
end
