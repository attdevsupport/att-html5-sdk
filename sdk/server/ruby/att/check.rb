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
    tokenMap = session[:tokenMap] || {}
    
    authorized_services = tokenMap.keys 
    requested_services = scope.split(",")   
        
    authorized = !authorized_services.empty? && !requested_services.empty? && (requested_services - authorized_services).empty?

    # make sure the browser never caches this result
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    
    { :authorized =>  authorized }.to_json
  end

  get '/att/showTokens' do
    
    retval = "Time Now: #{Time.now} (#{Time.now.to_i})<br>"
    retval = retval + "Reduce token expiry by: #{$reduce_token_expiry_by} seconds.<br>"
    retval = retval + "<table border=""1""><tr><td>Scopes</td><td>Access Token</td><td>Refresh Token</td><td>Actual Expiry</td><td>Adjusted Expiry</td></tr>"
    
    retval = retval + "<tr><td>#{$client_model_scope}</td><td>#{$client_token.access_token}</td><td>#{$client_token.refresh_token}</td>" +
      "<td>#{$client_token.expiry}</td><td>#{Time.at($client_token.expiry - $reduce_token_expiry_by)}</td></tr>"
    
    tokenMap = session[:tokenMap] || {}
            
    tokenMap.each {|key, value| retval = retval + "<tr><td>#{key}</td><td>#{value.access_token}</td><td>#{value.refresh_token}</td>" +
      "<td>#{value.expiry}</td><td>#{Time.at(value.expiry - $reduce_token_expiry_by)}</td></tr>"
      }
    
    retval = retval + "</table>"
    
    return retval
    
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
