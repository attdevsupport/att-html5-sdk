class Html5SdkApp < Sinatra::Base

  # @!group In-App Messaging

  # @method get_att_mymessages_v2_messages_index_info
  # @overload get '/att/myMessages/v2/messages/index/info'
  #   @return [JSON]
  #
  #   Get the status of the user's inbox cache.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details.
  #
  get '/att/myMessages/v2/messages/index/info' do
    content_type :json # set response type
    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
    svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
    svc.getIndexInfo
  end

  # @method get_att_mymessages_v2_messages_index
  # @overload get '/att/myMessages/v2/messages/index'
  #   @return [HTTP status code]
  #
  #   Make sure the user's inbox cache is created and available.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details.
  #
  post '/att/myMessages/v2/messages/index' do
    #
    # Refer to http://developer.att.com/static-assets/documents/apis/ATT-In-App-Messaging-Index-Management.pdf
    # for details of the algorithm used below.
    #
    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
    svc = Service::MIMService.new($config['apiHost'], token)
    info = svc.getIndexInfo
    svc.createIndex if info.status == "NOT_INITIALIZED" or info.status == "ERROR"
    until info.status == "INITIALIZED"
      info = svc.getIndexInfo
    end
  end

  # @method get_att_mymessages_v2_delta
  # @overload get '/att/myMessages/v2/delta'
  #   @param state [querystring parameter] an opaque ID representing a particular prior state of the user's inbox
  #   @return [JSON]
  #
  #   Get a list of all the changes that occurred in the user's
  #   inbox, since it was in the state represented by the 'state'
  #   parameter.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  get '/att/myMessages/v2/delta' do
    content_type :json # set response type

    return json_error(401, "'state' querystring parameter is required") unless state = request.GET['state']
    state = URI.decode(state)
    
    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
    svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
    svc.getDelta(state)
  end

  # @method post_att_mymessages_v2_messages
  # @overload post '/att/myMessages/v2/messages'
  #   @param addresses [querystring parameter]
  #   @param message [querystring parameter]
  #   @param subject [querystring parameter]
  #   @param group [querystring parameter]
  #   @param file [attachment] Any files attached to the request will also be attached to the sent message.
  #   @return [JSON]
  #
  #   Send a message - an SMS if the parameters allow it,
  #   otherwise an MMS.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  post '/att/myMessages/v2/messages' do
    content_type :json # set response type
    filenames = []
    begin
      # process incoming parameters
      #
      return json_error(400, "'addresses' querystring parameter required") unless addresses = request.GET['addresses']
      addresses = URI.decode(addresses)
      message = request.GET['message']
      subject = request.GET['subject']
      group = request.GET['group']
      request.POST.each do |key, file_data|
        return json_error(400, "attachment was a String where file data was expected") if file_data.is_a? String
        filenames.push save_attachment_as_file(file_data)
      end

      # construct outgoing parameters
      #
      opts = {}
      opts[:message] = URI.decode(message) if message
      opts[:subject] = URI.decode(subject) if subject
      opts[:group] = URI.decode(group) if group
      opts[:attachments] = filenames unless filenames.length == 0

      token_map = session[:tokenMap]
      return json_error(401, "app not authorized by user") unless token_map and token = token_map["IMMN"]

      # call the service and send the message
      #
      svc = Service::IMMNService.new($config['apiHost'], token, :raw_response => true)
      svc.sendMessage(addresses, opts)
    ensure
      filenames.each { |filename| FileUtils.remove(filename) }
    end
  end

  # @method get_att_mymessages_v2_messages_id_parts_num
  # @overload get '/att/myMessages/v2/messages/{message_id}/parts/{part_num}'
  #   @param message_id [URL path segment] The message being queried.
  #   @param part_num [URL path segment] The attachment to be retrieved.
  #   @return [binary file data]
  #
  #   Get a message attachment.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  get '/att/myMessages/v2/messages/:message_id/parts/:part_num' do |message_id, part_num|
    message_id = URI.decode(message_id)
    part_num = URI.decode(part_num)
    
    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]

    svc = Service::MIMService.new($config['apiHost'], token)
    info = svc.getMessageContent(message_id, part_num)
    content_type info.content_type
    info.attachment
  end

  # @method get_att_mymessages_v2_messages_id
  # @overload get '/att/myMessages/v2/messages/{message_id}'
  #   @param message_id [URL path segment] The message being retrieved.
  #   @return [JSON]
  #
  #   Get a message from the user's inbox.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  get '/att/myMessages/v2/messages/:id' do |id|
    content_type :json # set response type
    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
    svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
    svc.getMessage(URI.decode(id))
  end

  # @method get_att_mymessages_v2_messages
  # @overload get '/att/myMessages/v2/messages'
  #   @param count [querystring parameter] The maximum number of messages to retrieve.
  #   @param * [querystring parameter] (optional) there are a number of other parameters that can be specified in order to filter the list of retrieved messages. See the doc link below for more details.
  #   @return [JSON]
  #
  #   Get a list of messages from the user's inbox.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  get '/att/myMessages/v2/messages' do
    content_type :json # set response type
    return json_error(400, "'count' querystring parameter required") unless count = params['count']
    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
    svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
    svc.getMessageList(count, params)
  end

  # @method put_att_mymessages_v2_messages_id
  # @overload put '/att/myMessages/v2/messages/{id}'
  #   @param id [URL path segment] The message to modify.
  #   @param attributes [JSON request body] The updated message attributes.
  #   @return [HTTP status code]
  #
  #   Update a message's attributes (isUnread, for example).
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  put '/att/myMessages/v2/messages/:id' do |id|
    begin
      attributes = JSON.parse(request.body.read)
    rescue JSON::ParserError => e
      return json_error(400, "request body was not valid JSON: #{e.message}")
    end
    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
    svc = Service::MIMService.new($config['apiHost'], token)
    svc.updateMessage(id, attributes["isUnread"], attributes["isFavorite"])
  end

  # @method put_att_mymessages_v2_messages
  # @overload put '/att/myMessages/v2/messages'
  #   @param attributes [JSON request body] A list of message attribute updates.
  #   @return [HTTP status code]
  #
  #   Update attributes (isUnread, for example) for multiple messages.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  put '/att/myMessages/v2/messages' do
    begin
      json_messages = JSON.parse(request.body.read)
    rescue JSON::ParserError => e
      return json_error(400, "request body was not valid JSON: #{e.message}")
    end

    messages = []
    json_messages['messages'].each do |json_msg|
      messages << Model::MessageMetadata.new(json_msg['id'], json_msg['isUnread'], json_msg['isFavorite'])
    end
    
    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]

    svc = Service::MIMService.new($config['apiHost'], token)
    svc.updateMessages(messages)
  end

  # @method delete_att_mymessages_v2_messages_id
  # @overload delete '/att/myMessages/v2/messages/{id}'
  #   @param id [URL path segment] The message to delete.
  #   @return [HTTP status code]
  #
  #   Delete a message.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  delete '/att/myMessages/v2/messages/:id' do |id|
    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]

    svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
    svc.deleteMessage [URI.decode(id)]
  end

  # @method delete_att_mymessages_v2_messages
  # @overload delete '/att/myMessages/v2/messages'
  #   @param messageIds [querystring parameter] A comma-separated list of messages to delete.
  #   @return [HTTP status code]
  #
  #   Delete multiple messages.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  delete '/att/myMessages/v2/messages' do
    return json_error(400, "required 'messageIds' querystring parameter is missing") unless ids = request.GET['messageIds']

    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]

    svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
    svc.deleteMessage [URI.decode(ids)]
  end

  # @method get_att_mymessages_v2_notificationconnectiondetails
  # @overload get '/att/myMessages/v2/notificationConnectionDetails'
  #   @param queues [querystring parameter]
  #   @return [JSON]
  #
  #   Get details of any configured push notifications for the user's inbox.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/in-app-messaging/docs for more details of the parameters and their allowed values.
  #
  get '/att/myMessages/v2/notificationConnectionDetails' do
    content_type :json # set response type

    return json_error(400, "required 'queues' querystring parameter is missing") unless queues = request.GET['queues']

    token_map = session[:tokenMap]
    return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]

    svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
    svc.getNotificationDetails(URI.decode(queues))
  end
end
