class Html5SdkApp < Sinatra::Base

  # @!group Webhooks

  # TODO: handle threading issues around accessing $notification_channel
  def getSubscriptionService(consent_token)
    # create the channel if necessary
    unless $notification_channel
      svc = Service::ChannelService.new($config['apiHost'], $client_token)
      begin
        $notification_channel = svc.createMIMNotificationChannel('application/json')
      rescue Att::Codekit::Service::ServiceException => sex
        errorInfo = JSON.parse(sex.message)
        unless errorInfo['RequestError'] && errorInfo['RequestError']['MessageId'] && errorInfo['RequestError']['MessageId'] == 'POL1001'
          raise
        end
        # 'Variables' looks like 'channelId:mychannelid'; the third partition contains 'mychannelid'
        id = errorInfo['RequestError']['Variables'].partition(':')[2]
        $notification_channel = svc.getNotificationChannel(id)
      end
    end
    Service::SubscriptionService.new($config['apiHost'], consent_token, $notification_channel.channel_id)
  end
  
  # create notification subscription
  post '/att/notification/v1/subscriptions' do
    content_type :json # set response type
    return json_error(401, "app not authorized by user") unless consent_token = get_current_consent_token("MIM")
    begin
      subscription = JSON.parse(request.body.read)
    rescue JSON::ParserError => e
      return json_error(400, "request body was not valid JSON: #{e.message}")
    end
    svc = getSubscriptionService(consent_token)
    svc.createNotificationSubscription(subscription)
  end
  
  # get notification subscription
  get '/att/notification/v1/subscriptions/:subscription_id' do
    content_type :json # set response type
    return json_error(401, "app not authorized by user") unless token = get_current_consent_token("MIM")
    svc = getSubscriptionService(consent_token)
    svc.getNotificationSubscription(:subscription_id)
  end

  # delete notification subscription
  delete '/att/notification/v1/subscriptions/:subscription_id' do
    content_type :json # set response type
    return json_error(401, "app not authorized by user") unless token = get_current_consent_token("MIM")
    svc = getSubscriptionService(consent_token)
    svc.deleteNotificationSubscription(:subscription_id)
  end

  # update notification subscription
  put '/att/notification/v1/subscriptions/:subscription_id' do
    content_type :json # set response type
    return json_error(401, "app not authorized by user") unless token = get_current_consent_token("MIM")
    begin
      subscription = JSON.parse(request.body.read)
    rescue JSON::ParserError => e
      return json_error(400, "request body was not valid JSON: #{e.message}")
    end
    svc = getSubscriptionService(consent_token)
    svc.updateNotificationSubscription(:subscription_id, subscription)
  end
end
