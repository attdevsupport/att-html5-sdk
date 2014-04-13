class Html5SdkApp < Sinatra::Base

  # @method get_att_devices_info
  # @overload get '/att/Devices/Info'
  #   @return [JSON]
  #
  #   Get details of the device the user is using to connect
  #   to the AT&T network. The user must be accessing the internet
  #   through the AT&T network when they authorize the app to use
  #   the 'DC' scope, as required by this endpoint.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/device-capabilities/docs for more details.
  #
  get '/att/Devices/Info' do
    content_type :json # set response type
    token_map = session[:tokenMap]
    return json_error(401, "user has not authorized this app to collect device capabilities") unless token_map and token_map["DC"]
    svc = Service::DCService.new($config['apiHost'], token_map["DC"], :raw_response => true)
    svc.getDeviceCapabilities
  end
end
