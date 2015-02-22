class Html5SdkApp < Sinatra::Base

  # @!group Webhooks

  def initialize
    super
    @notifications = {}
    @channel_lock = Mutex.new
  end
  
  def channel_id
    @channel_lock.synchronize do
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
      return $notification_channel.channel_id
    end
  end
  
  # 
  # @method post_att_notification_v1_subscriptions
  # @overload post '/att/notification/v1/subscriptions'
  #   @param config [JSON request body] A subscription configuration describing the subscription to be created.
  #   @return [JSON]
  #
  #   Create a subscription to receive notifications of changes to the specified user's messaging inbox.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/webhooks/docs for more details of the parameters and their allowed values.
  #
  post '/att/notification/v1/subscriptions' do
    content_type :json # set response type
    return json_error(401, "app not authorized by user") unless consent_token = get_current_consent_token("MIM")
    begin
      subscription = JSON.parse(request.body.read)
    rescue JSON::ParserError => e
      return json_error(400, "request body was not valid JSON: #{e.message}")
    end
    svc = Service::UserSubscriptionService.new($config['apiHost'], consent_token, channel_id)
    rsp = svc.createNotificationSubscription(subscription)
    rspHash = JSON.parse(rsp)
    session[:subscription_id] = rspHash['subscription']['subscriptionId']
    rsp
  end

  # 
  # @method get_att_notification_v1_subscriptions_id
  # @overload get '/att/notification/v1/subscriptions/{id}'
  #   @param id [URL path segment] The subscription_id of the subscription being queried.
  #   @return [JSON]
  #
  #   Get details about the specified subscription.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/webhooks/docs for more details of the parameters and their allowed values.
  #
  get '/att/notification/v1/subscriptions/:subscription_id' do
    content_type :json # set response type
    return json_error(401, "app not authorized by user") unless consent_token = get_current_consent_token("MIM")
    svc = Service::UserSubscriptionService.new($config['apiHost'], consent_token, channel_id)
    svc.getNotificationSubscription(params[:subscription_id])
  end

  # 
  # @method delete_att_notification_v1_subscriptions_id
  # @overload delete '/att/notification/v1/subscriptions/{id}'
  #   @param id [URL path segment] The subscription_id of the subscription to be deleted.
  #   @return [JSON]
  #
  #   Delete the specified subscription.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/webhooks/docs for more details of the parameters and their allowed values.
  #
  delete '/att/notification/v1/subscriptions/:subscription_id' do
    content_type :json # set response type
    svc = Service::ClientSubscriptionService.new($config['apiHost'], $client_token, channel_id)
    begin
      svc.deleteNotificationSubscription(params[:subscription_id])
    rescue Service::SubscriptionNotFoundException
      return json_error(404, "no subscription found for subscription_id #{params[:subscription_id]}")
    end
  end

  # update notification subscription
  # 
  # @method put_att_notification_v1_subscriptions_id
  # @overload put '/att/notification/v1/subscriptions/{id}'
  #   @param id [URL path segment] The subscription_id of the subscription being updated.
  #   @param config [JSON request body] A subscription configuration describing the subscription updates.
  #   @return [JSON]
  #
  #   Update the configuration of the specified subscription.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/webhooks/docs for more details of the parameters and their allowed values.
  #
  put '/att/notification/v1/subscriptions/:subscription_id' do
    content_type :json # set response type
    return json_error(401, "app not authorized by user") unless consent_token = get_current_consent_token("MIM")
    begin
      subscription = JSON.parse(request.body.read)
    rescue JSON::ParserError => e
      return json_error(400, "request body was not valid JSON: #{e.message}")
    end
    svc = Service::UserSubscriptionService.new($config['apiHost'], consent_token, channel_id)
    svc.updateNotificationSubscription(params[:subscription_id], subscription)
  end

  def get_notifications(subscription_id)
    content_type :json # set response type

    begin
      file_contents = File.open('notifications.json', 'r+') { |f| f.read }
    rescue Exception => e
      #if file doesn't exist, create content
      file_contents = '{}'
    end    
    stored_notifications = JSON.parse(file_contents)

    notifications = stored_notifications[subscription_id] || []
    result = {'notificationEvents' => notifications}
    result.to_json
  end

  # 
  # @method get_att_notification_v1_subscriptions_id
  # @overload get '/att/notification/v1/subscriptions/{id}'
  #   @param id [URL path segment] The subscription_id of the subscription being queried.
  #   @return [JSON]
  #
  #   Get the existing notifications associated with the specified subscription.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/webhooks/docs for more details of the parameters and their allowed values.
  #
  get '/att/notification/v1/notifications/:subscription_id' do
    get_notifications(params[:subscription_id])
  end

  get '/att/notification/v1/notifications' do
    get_notifications(session[:subscription_id])
  end

  def delete_notifications(subscription_id)
    content_type :json # set response type

    begin
      file_contents = File.open('notifications.json', 'r+') { |f| f.read }
    rescue Exception => e
      #if file doesn't exist, create content
      file_contents = '{}'
    end    
    stored_notifications = JSON.parse(file_contents)
    notifications = stored_notifications[subscription_id] || []
    File.open('notifications.json', 'w') { |f| f.write '{}' }
    result = {'notificationEvents' => notifications}
    result.to_json
  end

  # 
  # @method get_att_notification_v1_subscriptions_id
  # @overload get '/att/notification/v1/subscriptions/{id}'
  #   @param id [URL path segment] The subscription_id of the subscription being deleted.
  #   @return [JSON]
  #
  #   Delete the existing notifications associated with the specified subscription, 
  #   and return them.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/webhooks/docs for more details of the parameters and their allowed values.
  #
  delete '/att/notification/v1/notifications/:subscription_id' do
    delete_notifications(params[:subscription_id])
  end
  
  delete '/att/notification/v1/notifications' do
    delete_notifications(session[:subscription_id])
  end
end