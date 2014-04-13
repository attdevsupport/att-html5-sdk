class Html5SdkApp < Sinatra::Base

  # @method post_att_sms_v3_messaging_outbox
  # @overload post '/att/sms/v3/messaging/outbox'
  #   @param addresses [querystring parameter] The SMS recipients.
  #   @param message [querystring parameter] The SMS text.
  #   @return [JSON]
  #
  #   Send an SMS message.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/sms/docs for more details of the parameters and their allowed values.
  #
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

  # @method get_att_sms_v3_messaging_outbox_id
  # @overload get '/att/sms/v3/messaging/outbox/{sms_id}'
  #   @param sms_id [URL path segment] The ID of the desired SMS message.
  #   @return [JSON]
  #
  #   Get the delivery status of a previously-sent SMS.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/sms/docs for more details of the parameters and their allowed values.
  #
  get '/att/sms/v3/messaging/outbox/:sms_id' do |sms_id|
    content_type :json # set response type
    svc = Service::SMSService.new($config['apiHost'], $client_token, :raw_response => true)
    svc.smsStatus(sms_id)
  end

  # @method get_att_sms_v3_messaging_inbox_shortcode
  # @overload get '/att/sms/v3/messaging/inbox/{shortcode}'
  #   @param shortcode [URL path segment] Your app's shortcode.
  #   @return [JSON]
  #
  #   Get the SMS messages that have been sent to your app.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/sms/docs for more details of the parameters and their allowed values.
  #
  get '/att/sms/v3/messaging/inbox/:shortcode' do |shortcode|
    content_type :json # set response type
    svc = Service::SMSService.new($config['apiHost'], $client_token, :raw_response => true)
    svc.getReceivedMessages(shortcode)
  end

  # @private
  VOTES_TMP_FILE = File.expand_path(File.dirname(__FILE__) + '/../votes.json')

  # @method get_att_sms_votegetter
  # @overload get '/att/sms/votegetter'
  #   @return [JSON]
  #
  #   Get a tally of SMS messages as reported by the SMS notification callback.
  #
  get '/att/sms/votegetter' do
    content_type :json # set response type
    return_json_file(VOTES_TMP_FILE, '{"success":true,"total":0,"data":[{"sport":"Football","votes":0},{"sport":"Baseball","votes":0},{"sport":"Basketball","votes":0}]}')
  end
end
