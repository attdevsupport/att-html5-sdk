get '/att/rest/ads' do
  content_type :json # set response type
  
  category = request.GET['Category']
  user_agent = request.GET['UserAgent']
  udid = request.GET['Udid']
  opts = request.GET['opts']
  
  return json_error(400, "required 'Category' querystring parameter is missing") if category.nil?

  category = URI.decode(category)
  user_agent = user_agent.nil? ? request.user_agent : URI.decode(user_agent)
  udid = udid.nil? ? "HTML5 SDK Sample ID providing a short-term unique advertising identity for the user" : URI.decode(udid)

  begin
    opts = opts.nil? ? {} : JSON.parse(URI.decode(opts))
  rescue JSON::ParserError => e
    return json_error(400, "'opts' querystring parameter was not valid JSON: #{e.message}")
  end
  
  svc = Service::ADSService.new($config['apiHost'], $client_token, :raw_response => true)
  svc.getAds(category, user_agent, udid, opts)
end
