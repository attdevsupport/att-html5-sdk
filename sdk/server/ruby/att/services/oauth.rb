class Html5SdkApp < Sinatra::Base

  # @!group Authorization

  # @method get_att_oauth_userauthurl
  # @overload get '/att/oauth/userAuthUrl'
  #   @param scope [querystring parameter] The web services the app wants to access.
  #   @param returnUrl [querystring parameter] The page to redirect to, after authorization is complete.
  #   @return [JSON] Authorization URL
  #
  #   Return a URL that can be used to authorize the app to
  #   access the specified AT&T web services on behalf of the
  #   authorizing user.
  #
  get '/att/oauth/userAuthUrl' do
    content_type :json # set response type
    scope = request.GET['scope']
    return_url = request.GET['returnUrl']
    custom_param = request.GET['custom_param']
    if scope.nil? or return_url.nil?
      return [400, { :error => "'scope' and 'returnUrl' querystring parameters must be specified" }.to_json] 
    end
    encoded_scope = CGI.escape scope
    encoded_return_url = CGI.escape return_url
    callback_handler = "#{$config['localAuthServer']}/att/callback?scope=#{encoded_scope}&returnUrl=#{encoded_return_url}"      
    
    auther = Auth::AuthCode.new($config['apiHost'], $config['appKey'], $config['Secret'])
    user_auth_url = auther.generateConsentFlowUrl(:scope => [scope], :redirect => callback_handler)
    if !custom_param.nil? && !custom_param.to_s.empty?
      user_auth_url = "#{user_auth_url}&custom_param=#{custom_param}"
    end
    {:url => user_auth_url}.to_json
  end
end
