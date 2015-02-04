class Html5SdkApp < Sinatra::Base

  # @!group Webhooks

  def getOrCreateChannel(svc)
    unless $notification_channel
      begin
        $notification_channel = svc.createMIMNotificationChannel()
      rescue ex
        id = ex.channel_id # TODO: extract channel_id correctly from exception
        $notification_channel = svc.getNotificationChannel(id)
      end
    end
    return $notification_channel
  end
  
  # create notification subscription
  post '/att/notification/v1/subscriptions' do
    content_type :json # set response type
    begin
      subscription = JSON.parse(request.body.read)
    rescue JSON::ParserError => e
      return json_error(400, "request body was not valid JSON: #{e.message}")
    end
    svc = Service::Webhooks.new($config['apiHost'], $client_token, :raw_response => true)
    channel = getOrCreateChannel(svc)
    svc.createNotificationSubscription(channel.channel_id, subscription)
  end
  
  # get notification subscription
  get '/att/notification/v1/subscriptions/:subscription_id' do
    content_type :json # set response type
    svc = Service::Webhooks.new($config['apiHost'], $client_token, :raw_response => true)
    channel = getOrCreateChannel(svc)
    svc.getNotificationSubscription(channel.channel_id, :subscription_id)
  end

  # delete notification subscription
  delete '/att/notification/v1/subscriptions/:subscription_id' do
    content_type :json # set response type
    svc = Service::Webhooks.new($config['apiHost'], $client_token, :raw_response => true)
    channel = getOrCreateChannel(svc)
    svc.deleteNotificationSubscription(channel.channel_id, :subscription_id)
  end

  # create notification subscription
  put '/att/notification/v1/subscriptions/:subscription_id' do
    content_type :json # set response type
    begin
      subscription = JSON.parse(request.body.read)
    rescue JSON::ParserError => e
      return json_error(400, "request body was not valid JSON: #{e.message}")
    end
    svc = Service::Webhooks.new($config['apiHost'], $client_token, :raw_response => true)
    channel = getOrCreateChannel(svc)
    svc.updateNotificationSubscription(channel.channel_id, :subscription_id, subscription)
  end
end
