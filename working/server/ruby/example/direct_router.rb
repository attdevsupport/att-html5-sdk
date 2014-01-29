# This method passes whitelisted methods through to the Provider instance.
post '/att/direct_router' do
  puts "Processing /att/direct_router call"
  @@att.agent.user_agent  = request.user_agent
  content_type :json
  request.body.rewind
  data = JSON.parse request.body.read
  puts "direct_router call for method #{data['method']}"
  
  response = {
    :type => "rpc",
    :tid => data['tid'],
    :action => data['action'],
    :method => data['method']
  }

  method_whitelist = %w(oauthUrl signPayload)

  if data['action'] == PROVIDER and method_whitelist.include?(data['method'])
    puts "WHITELISTED Request, NO Token needed for #{data['method']}"
    response = response.merge(@@att.send("direct_#{data['method']}", data['data']))
  elsif data['action'] == PROVIDER

    # Fist, see if this method has a client credentials model OAuth token.
    token = @@att.get_client_model_token(data['method'])

    # If not, then use the session token which would be an authorize model OAuth token.
    if !token
      scope = @@att.get_auth_scope_for(data['method'])
      puts "getting authorize model token from #{session} and scope #{scope}"

      token = session[:tokenMap][scope]
    end

    if !token
      puts "ERROR! no token found!"
      response[:error] = 'Unauthorized request'
    else
      puts "TOKEN is good, calling Provider method #{data['method']}"
      puts "token = " + token
      args = (data['data'] || []).unshift(token)
      response = response.merge(@@att.send("direct_#{data['method']}", *args))
    end
  else
    response[:error] = "Invalid direct_router action"
  end

  if response[:error]
    puts "Received ERROR response from calling Provider method #{data['method']}"
    response = response.merge({
      :type => 'exception',
      :error => response[:error]
    })
  end

  response.to_json
end
