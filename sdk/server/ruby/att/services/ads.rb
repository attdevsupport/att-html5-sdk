get '/att/rest/1/ads' do
  content_type :json # set response type
  
  category = request.GET['Category']
  user_agent = request.GET['UserAgent']
  udid = request.GET['Udid']
  
  return json_error(400, "required 'Category' querystring parameter is missing") if category.nil?

  category = URI.decode(category)
  user_agent = user_agent.nil? ? request.user_agent : URI.decode(user_agent)
  udid = udid.nil? ? "HTML5 SDK Sample ID providing a short-term unique advertising identity for the user" : URI.decode(udid)
  # construct optional parameters from query string
  #
  opts = {}
  [:AgeGroup, :AreaCode, :City, :Country, :Gender, :Keywords, :Latitude, :Longitude, :MaxHeight, :MaxWidth, :MinHeight, :MinWidth, :Type, :ZipCode].each do |valid_param|
    actual_param = request.GET[valid_param.to_s]
    opts[valid_param] = URI.decode(actual_param) unless actual_param.nil?
  end
  
  svc = Service::ADSService.new($config['apiHost'], $client_token, :raw_response => true)
  svc.getAds(category, user_agent, udid, opts)
end
