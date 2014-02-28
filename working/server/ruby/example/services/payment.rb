get '/att/payment' do
  @@att.processPaymentCallback(params)
end

post '/att/notifications' do
  @@att.processPaymentNotification(request, params)
end

post '/att/payment/newtransaction' do
end

post '/att/payment/newsubscription' do
end

post '/att/payment/gettransaction' do
end

post '/att/payment/getsubscription' do
end

post '/att/payment/getsubscriptiondetails' do
end

post '/att/payment/refundtransaction' do
end

post '/att/payment/cancelsubscription' do
end

post '/att/payment/signpayload' do
end

post '/att/payment/getnotification' do
end

post '/att/payment/acknotification' do
end
