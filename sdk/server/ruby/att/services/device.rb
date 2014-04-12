class Html5SdkApp < Sinatra::Base

  get '/att/Devices/Info' do
    content_type :json # set response type
    token_map = session[:tokenMap]
    return json_error(401, "user has not authorized this app to collect device capabilities") unless token_map and token_map["DC"]
    svc = Service::DCService.new($config['apiHost'], token_map["DC"], :raw_response => true)
    svc.getDeviceCapabilities
  end
end
