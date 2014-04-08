get '/att/oauth/userAuthUrl' do
  content_type :json # set response type
  encoded_scope = request.GET['scope']
  encoded_return_url = request.GET['returnUrl']
  if encoded_scope.nil? or encoded_return_url.nil?
    return [400, { :error => "'scope' and 'returnUrl' querystring parameters must be specified" }.to_json] 
  end
  scope = URI.decode encoded_scope
  return_url = URI.decode encoded_return_url
  callback_handler = "#{$config['localAuthServer']}/att/callback?scope=#{encoded_scope}&returnUrl=#{encoded_return_url}"
  auther = Auth::AuthCode.new($config['apiHost'], $config['apiKey'], $config['secretKey'])
  user_auth_url = auther.generateConsentFlowUrl(:scope => [scope], :redirect => callback_handler)
  {:url => user_auth_url}.to_json
end
