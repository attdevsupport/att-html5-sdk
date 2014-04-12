class Html5SdkApp < Sinatra::Base

  post '/att/sms/v3/messaging/outbox' do
    content_type :json # set response type
    addresses = request.GET['addresses']
    message = request.GET['message']
    if addresses.nil? || message.nil?
      return json_error(400, "valid 'addresses' and 'message' querystring parameters required")
    end
    addresses = URI.decode addresses
    message = URI.decode message
    should_notify = true
    notify = request.GET['notify']
    if notify.nil? || notify.casecmp("false") || notify.eql?("0")
      should_notify = false
    end
    svc = Service::SMSService.new($config['apiHost'], $client_token, :raw_response => true)
    svc.sendSms(addresses, message, should_notify)
  end

  get '/att/sms/v3/messaging/outbox/:sms_id' do |sms_id|
    content_type :json # set response type
    svc = Service::SMSService.new($config['apiHost'], $client_token, :raw_response => true)
    svc.smsStatus(sms_id)
  end

  get '/att/sms/v3/messaging/inbox/:shortcode' do |shortcode|
    content_type :json # set response type
    svc = Service::SMSService.new($config['apiHost'], $client_token, :raw_response => true)
    svc.getReceivedMessages(shortcode)
  end

  VOTES_TMP_FILE = File.expand_path(File.dirname(__FILE__) + '/../votes.json')

  get '/att/sms/votegetter' do
    content_type :json # set response type
    return_json_file(VOTES_TMP_FILE, '{"success":true,"total":0,"data":[{"sport":"Football","votes":0},{"sport":"Baseball","votes":0},{"sport":"Basketball","votes":0}]}')
  end
end
