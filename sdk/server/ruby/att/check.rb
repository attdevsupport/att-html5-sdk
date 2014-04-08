# Return a json object with either 'true' or 'false' depending on whether an
# access_token has been set. This indicates whether the user is logged in.
get '/att/check' do
  content_type :json # set response type
  
  return json_error(400, "'scope' querystring parameter missing") if params[:scope].nil?
  
  scope = URI.decode params[:scope]
  tokenMap = session[:tokenMap] || {}
  
  authorized_services = tokenMap.keys 
  requested_services = scope.split(",")   
      
  authorized = !authorized_services.empty? && !requested_services.empty? && (requested_services - authorized_services).empty?
  
  { :authorized =>  authorized }.to_json
end
