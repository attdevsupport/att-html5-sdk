class Html5SdkApp < Sinatra::Base

  # @method get_att_check
  # @overload get '/att/check'
  #   @param scope [querystring parameter] the specific web service APIs being checked.
  #   @return [JSON] { authorized: true/false }
  #
  # Return a json object with either 'true' or 'false' depending on whether the
  # user has previously authorized the specified web services.
  get '/att/check' do
    content_type :json # set response type
    
    return json_error(400, "'scope' querystring parameter missing") if params[:scope].nil?
    
    scope = URI.decode params[:scope]
    requested_services = scope.split(",")
    requested_services.each do |value|
        get_current_consent_token(value) # refresh the current tokens if any
    end
    
    tokenMap = session[:tokenMap] || {}
    
    authorized_services = tokenMap.keys 
        
    authorized = !authorized_services.empty? && !requested_services.empty? && (requested_services - authorized_services).empty?

    # make sure the browser never caches this result
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    
    { :authorized =>  authorized }.to_json
  end

  get '/att/showTokens' do
    erb :showTokens
  end

  post '/att/showTokens' do
    if scope = request.POST['scope'] and token_type = request.POST['token_type']
      if oauth_token = scope == 'client' ? $client_token : session[:tokenMap][scope]
        token = token_type == 'access_token' ? oauth_token.access_token : oauth_token.refresh_token
        svc = Auth::OAuthService.new($config['apiHost'], $config['appKey'], $config['Secret'])
        svc.revokeToken(token, token_type)
        oauth_token.access_token = 'revoked'
        if token_type == 'refresh_token'
          oauth_token.refresh_token = 'revoked'
        end
      end
    end
    erb :showTokens
  end
  
  get '/att/logout' do
    content_type :json # set response type
    
    session[:tokenMap] = {}
    authorized = false

      
    # make sure the browser never caches this result
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    
    { :authorized =>  authorized }.to_json
  end
end
