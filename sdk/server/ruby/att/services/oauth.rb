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
  
  class RevokeTokenRequestParameterError < StandardError
  end
  
  def revoke_token(request, access_token, refresh_token)
    token_type = request.POST['token_type']
    if token_type != 'access_token' and token_type != 'refresh_token'
      raise RevokeTokenRequestParameterError.new(), "'token_type' form parameter must be either 'access_token' or 'refresh_token', but was '#{token_type.to_s}' instead."
    end
    svc = OAuthService.new($config['apiHost'], $config['appKey'], $config['Secret'])
    begin
      svc.revokeToken($client_token.refresh_token, 'refresh_token') unless token_type_hint == 'access_token'
    ensure
      svc.revokeToken($client_token.access_token, 'access_token') unless token_type_hint == 'refresh_token'
    end
  end
  
  post '/att/oauth/revoke/user' do
    scope = request.POST['scope']
    if scope.nil?
      return [400, { :error => "please specify a 'scope' form parameter, set to one of the scopes associated with the token(s) to be revoked." }.to_json]
    end
    scope = scope.split(',')[0].upcase # just in case they pass multiple scopes, just take the first one
    get_current_consent_token(scope) # refresh the tokens if necessary
    tokenMap = session[:tokenMap] || {}
    oauth_token = tokenMap[scope]
    if oauth_token.nil?
      return [200, { :message => "No token found for the requested scope (#{scope})." }.to_json]
    end
    begin
      revoke_token(request, oauth_token.access_token, oauth_token.refresh_token)
    rescue RevokeTokenRequestParameterError => e
      return [400, { :error => e.message }.to_json]
    end
  end
end
