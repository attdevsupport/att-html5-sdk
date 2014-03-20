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
  opts[:AgeGroup] = URI.decode(request.GET['AgeGroup']) if request.GET['AgeGroup']
  opts[:AreaCode] = URI.decode(request.GET['AreaCode']) if request.GET['AreaCode']
  opts[:City] = URI.decode(request.GET['City']) if request.GET['City']
  opts[:Country] = URI.decode(request.GET['Country']) if request.GET['Country']
  opts[:Gender] = URI.decode(request.GET['Gender']) if request.GET['Gender']
  opts[:Keywords] = URI.decode(request.GET['Keywords']) if request.GET['Keywords']
  opts[:Latitude] = URI.decode(request.GET['Latitude']) if request.GET['Latitude']
  opts[:Longitude] = URI.decode(request.GET['Longitude']) if request.GET['Longitude']
  opts[:MaxHeight] = URI.decode(request.GET['MaxHeight']) if request.GET['MaxHeight']
  opts[:MaxWidth] = URI.decode(request.GET['MaxWidth']) if request.GET['MaxWidth']
  opts[:MinHeight] = URI.decode(request.GET['MinHeight']) if request.GET['MinHeight']
  opts[:MinWidth] = URI.decode(request.GET['MinWidth']) if request.GET['MinWidth']
  opts[:Type] = URI.decode(request.GET['Type']) if request.GET['Type']
  opts[:ZipCode] = URI.decode(request.GET['ZipCode']) if request.GET['ZipCode']
  
  svc = Service::ADSService.new($config['apiHost'], $client_token, :raw_response => true)
  svc.getAds(category, user_agent, udid, opts)
end
