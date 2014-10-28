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

    authorized = true
    requested_services.each do |scope|
      authorized = false unless tokenMap[scope] and tokenMap[scope].access_token != 'revoked'
    end
    
    # make sure the browser never caches this result
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    { :authorized =>  authorized }.to_json
  end

  # @method get_att_showTokens
  # @overload get '/att/showTokens'
  #   @return [HTML] security token debug page
  #
  # Supplies a debug page that can be used to view and manage the user's
  # (and optionally, the app's) security tokens.
  get '/att/showTokens' do
    erb :showTokens
  end

  # POST back to the showTokens page occurs when a security token
  # is being revoked.
  post '/att/showTokens' do

    scope = request.POST['scope']
    token_type = request.POST['token_type']

    if scope.nil? or token_type.nil?
      return [400, { :error => "'scope' and 'token_type' parameters are required." }.to_json]
    end

    unless token_type == 'access_token' or token_type == 'refresh_token'
      return [400, { :error => "'token_type' must be set to 'access_token' or 'refresh_token'." }.to_json]
    end

    revoking_client = scope == 'client'

    if revoking_client and not $config['enableUnsafeClientTokenRevocation']
      return [400, { :error => "unsafe client token revocation is disabled on the server." }.to_json]
    end

    if revoking_client
      oauth_token = $client_token
    else
      token_map = session[:tokenMap]
      oauth_token = token_map[scope] unless token_map.nil?
    end

    unless oauth_token.nil?
      revoking_refresh_token = token_type == 'refresh_token'
      token = revoking_refresh_token ? oauth_token.refresh_token : oauth_token.access_token

      svc = Auth::OAuthService.new($config['apiHost'], $config['appKey'], $config['Secret'])
      svc.revokeToken(token, token_type)

      # revoking the refresh token automatically revokes the access_token too.
      oauth_token.access_token = 'revoked'
      oauth_token.refresh_token = 'revoked' if revoking_refresh_token
    end

    # make sure the user ends up on a GET page, not a POST page, so that when
    # they refresh the page they don't get a warning about resubmitting their
    # form data.
    redirect to('/att/showTokens')
  end

  post '/att/logout' do
    token_map = session[:tokenMap] || {}
    token_map.each do |scope, oauth_token|
      unless oauth_token.refresh_token == 'revoked'
        svc = svc || Auth::OAuthService.new($config['apiHost'], $config['appKey'], $config['Secret'])
        begin
          # revoking the refresh_token automatically revokes the associated access_token as well
          svc.revokeToken(oauth_token.refresh_token, 'refresh_token')
          token_map[scope].access_token = 'revoked'
          token_map[scope].refresh_token = 'revoked'
        rescue StandardError => e
          puts "silently failed to revoke a security token: #{e.message}"
        end
      end
    end
    redirect back
  end
end
