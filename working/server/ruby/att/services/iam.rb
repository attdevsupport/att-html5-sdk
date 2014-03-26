get '/att/myMessages/v2/messages/index/info' do
  content_type :json # set response type
  token_map = session[:tokenMap]
  return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  svc.getIndexInfo
end

# Refer to http://developer.att.com/static-assets/documents/apis/ATT-In-App-Messaging-Index-Management.pdf
# for details of the algorithm used below.
#
post '/att/myMessages/v2/messages/index' do
  token_map = session[:tokenMap]
  return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
  svc = Service::MIMService.new($config['apiHost'], token)
  info = svc.getIndexInfo
  svc.createIndex if info.status == "NOT_INITIALIZED" or info.status == "ERROR"
  until info.status == "INITIALIZED"
    info = svc.getIndexInfo
  end
end

get '/att/myMessages/v2/delta' do
  content_type :json # set response type

  return json_error(401, "'state' querystring parameter is required") unless state = request.GET['state']
  state = URI.decode(state)
  
  token_map = session[:tokenMap]
  return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  svc.getDelta(state)
end

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

get '/att/myMessages/v2/messages/:id' do |id|
  content_type :json # set response type
  token_map = session[:tokenMap]
  return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  svc.getMessage(URI.decode(id))
end

get '/att/myMessages/v2/messages' do
  content_type :json # set response type
  return json_error(400, "'count' querystring parameter required") unless count = params['count']
  token_map = session[:tokenMap]
  return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]
  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  svc.getMessageList(count, params)
end

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

delete '/att/myMessages/v2/messages/:id' do |id|
  token_map = session[:tokenMap]
  return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]

  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  svc.deleteMessage [URI.decode(id)]
end

delete '/att/myMessages/v2/messages' do
  return json_error(400, "required 'messageIds' querystring parameter is missing") unless ids = request.GET['messageIds']

  token_map = session[:tokenMap]
  return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]

  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  svc.deleteMessage [URI.decode(ids)]
end

get '/att/myMessages/v2/notificationConnectionDetails' do
  return json_error(400, "required 'queues' querystring parameter is missing") unless queues = request.GET['queues']

  token_map = session[:tokenMap]
  return json_error(401, "app not authorized by user") unless token_map and token = token_map["MIM"]

  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  svc.getNotificationDetails(URI.decode(queues))
end
