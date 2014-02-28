get '/att/Devices/Info' do
  content_type :json
  token_map = session[:tokenMap]
  return [401, { :error => "user has not authorized this app to collect device capabilities" }.to_json] unless token_map and token_map["DC"]
  svc = Service::DCService.new($config['apiHost'], token_map["DC"], :raw_response => true)
  begin
    svc.getDeviceCapabilities
  rescue Service::ServiceException => e
    { :error => e.message }.to_json
  end
end
