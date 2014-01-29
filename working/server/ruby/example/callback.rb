# Once the user has logged in with their credentials, they get redirected to this URL
# with a 'code' and a 'scopes' parameters. This is exchanged for an access token which can be used in any
# future calls to the AT&T APIs.
get '/att/callback' do

  puts "handle callback"

  session[:NAME]  = "CONCHADETURAOSIDH"
  if !params[:code]
    puts 'callback : No auth code on querystring'

    content_type 'text/html'
    response = {
      :success => false,
      :msg => "No auth code"
    }
    
    if params[:error]
        response.merge!({
          :msg => params[:error_description],
          :code => params[:error]
        })
    end

  else

    puts "getToken"
    response = @@att.getToken(params[:code])
  
    if response.error?
      puts "callback : error in response"
  
      content_type 'text/html'
      response = {
        :success => false,
        :msg => "Process Callback",
        :error => response.error
      }
  
    else
      puts "callback : response good"
      # This stores the OAuth token in the session for use in future API calls.
      tokenMap = session[:tokenMap] || {} 
     
      scopes = params[:scopes]

      scopes.split(",").each {|scope|
        tokenMap[scope] = response.data['access_token']
        puts "saved #{scope}: #{tokenMap[scope]}"
      } unless scopes.nil?
      
      session['tokenMap'] = tokenMap

      session['refresh_token'] = response.data['refresh_token']
      puts "refresh_token = #{session[:refresh_token]}"
  
      content_type 'text/html'
      response = {
        :success => true,
        :msg => "Process Callback"
      }
    end
    
  end
  # This sends back our json wrapped in html.
  return REDIRECT_HTML_PRE + response.to_json + REDIRECT_HTML_POST

end
