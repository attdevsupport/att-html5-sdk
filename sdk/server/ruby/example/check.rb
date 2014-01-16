# Return a json object with either 'true' or 'false' depending on whether an
# access_token has been set. This indicates whether the user is logged in.
get '/att/check' do
  content_type :json
  
  tokenMap = session[:tokenMap] || {}
  scopes = params[:scope] || ''
  
  t = tokenMap.keys 
  r = scopes.split(",")   
      
  authorized = (!t.empty? && !r.empty? && (r-t).empty?)  
  
  { :authorized =>  authorized }.to_json

end