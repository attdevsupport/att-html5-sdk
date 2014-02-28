# Once the user has logged in with their credentials, they get redirected to this URL
# with a 'code' and a 'scope' parameters. This is exchanged for an access token which can be used in any
# future calls to the AT&T APIs.
get '/att/callback' do

  encoded_code = request.GET["code"]
  encoded_scope = request.GET["scope"]
  encoded_return_url = request.GET["returnUrl"]

  if return_url.nil?
    return [500, "user authentication completed but I don't have a returnUrl to go back to"]
  end
  
  return_url = URI.decode encoded_return_url
  
  if encoded_code.nil?
    error = request.GET["error"]
    if error.nil?
      error = "no code and no error message returned from the user authentication"
    else
      error_description = request.GET["error_description"]
      error = "#{error} - #{error_description}" unless error_description.nil?
    end
    return_url = return_url + (return_url.include?('?') ? '&' : '?') + "error=" + URI.encode(error)
    return redirect to(return_url)
  end
  
  code = URI.decode encoded_code

  auther = Auth::AuthCode.new($config['apiHost'], $config['apiKey'], $config['secretKey'])
  begin
    token = auther.createToken(code)
  rescue Service::ServiceException => e
    return_url = return_url + (return_url.include?('?') ? '&' : '?') + "error=" + URI.encode(e.message)
    return redirect to(return_url)
  end

  # note in the user's session the new services they have now authorized
  unless encoded_scope.nil?
    tokenMap = session[:tokenMap] || {} 
    scope = URI.decode encoded_scope
    scope.split(",").each do |authorized_service|
      tokenMap[authorized_service] = token
    end
    session[:tokenMap] = tokenMap
  end
  redirect to(return_url)
end
