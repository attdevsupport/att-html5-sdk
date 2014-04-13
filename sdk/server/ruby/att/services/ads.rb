class Html5SdkApp < Sinatra::Base

  # @method get_ads
  #   @overload get '/att/rest/1/ads'
  #     @param Category [querystring parameter] The type of ad desired; for example, 'movies'. 
  #     @param UserAgent [querystring parameter] The browser that will be displaying the ad, in User-Agent format.
  #     @param Udid [querystring parameter] An anonymous, unique, short-term (session lifetime) identifier of the user who will be viewing the ad.
  #     @param AgeGroup [querystring parameter] (optional)
  #     @param AreaCode [querystring parameter] (optional)
  #     @param City [querystring parameter] (optional)
  #     @param Country [querystring parameter] (optional)
  #     @param Gender [querystring parameter] (optional)
  #     @param Keywords [querystring parameter] (optional)
  #     @param Latitude [querystring parameter] (optional)
  #     @param Longitude [querystring parameter] (optional)
  #     @param MaxHeight [querystring parameter] (optional)
  #     @param MaxWidth [querystring parameter] (optional)
  #     @param MinHeight [querystring parameter] (optional)
  #     @param MinWidth [querystring parameter] (optional)
  #     @param Type [querystring parameter] (optional)
  #     @param ZipCode [querystring parameter] (optional)
  #     @return [JSON]
  #
  #     Returns the URL of an advertisement that matches the supplied 
  #     demographic information.
  #
  #     Refer to the API documentation at http://developer.att.com/apis/advertising/docs for more details of the parameters and their allowed values.
  #
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
end
