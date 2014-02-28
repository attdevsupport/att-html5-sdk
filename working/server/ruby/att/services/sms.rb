post '/att/sms/v3/messaging/outbox' do
  content_type :json # set response type
  addresses = request.GET['addresses']
  message = request.GET['message']
  if addresses.nil? || message.nil?
    return [400, [{:error => "valid 'addresses' and 'message' querystring parameters required"}.to_json]]
  end
  addresses = URI.decode addresses
  message = URI.decode message
  should_notify = true
  notify = request.GET['notify']
  if notify.nil? || notify.casecmp("false") || notify.eql?("0")
    should_notify = false
  end
  svc = Service::SMSService.new($config['apiHost'], $client_token, :raw_response => true)
  begin
    svc.sendSms(addresses, message, should_notify)
  rescue Service::ServiceException => e
    return [400, {:error => e.message}.to_json]
  end
end

get '/att/sms/v3/messaging/outbox/:sms_id' do |sms_id|
  content_type :json # set response type
  svc = Service::SMSService.new($config['apiHost'], $client_token, :raw_response => true)
  begin
    svc.smsStatus(sms_id)
  rescue Service::ServiceException => e
    return [400, {:error => e.message}.to_json]
  end
end

get '/att/sms/v3/messaging/inbox/:shortcode' do |shortcode|
  content_type :json # set response type
  svc = Service::SMSService.new($config['apiHost'], $client_token, :raw_response => true)
  begin
    svc.getReceivedMessages(shortcode)
  rescue Service::ServiceException => e
    return [400, {:error => e.message}.to_json]
  end
end

VOTES_TMP_FILE = File.expand_path(File.dirname(__FILE__) + '/../votes.json')

get '/att/sms/votegetter' do
  content_type :json
  return_json_file(VOTES_TMP_FILE, '{"success":true,"total":0,"data":[{"sport":"Football","votes":0},{"sport":"Baseball","votes":0},{"sport":"Basketball","votes":0}]}')
end
