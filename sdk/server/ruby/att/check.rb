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
end
