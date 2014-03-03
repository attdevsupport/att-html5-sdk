post '/att/immn/sendmessage' do
end

post '/att/immn/immnsendsms' do
end

post '/att/immn/immnsendmms' do
end

get '/att/myMessages/v2/messages' do
  content_type :json
  unless count = params['count']
    return [400, [{:error => "'count' querystring parameter required"}.to_json]]
  end
  token_map = session[:tokenMap]
  unless token_map and token = token_map["IMMN"]
    return [401, { :error => "user has not authorized this app to see their inbox" }.to_json]
  end
  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  begin
    svc.getMessageList(count, params)
  rescue Service::ServiceException => e
    [400, { :error => e.message }.to_json]
  end
end

post '/att/myMessages/v2/messages/:id' do |id|
  content_type :json
  token_map = session[:tokenMap]
  unless token_map and token = token_map["IMMN"]
    return [401, { :error => "user has not authorized this app to see their inbox" }.to_json]
  end
  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  begin
    svc.getMessage(id)
  rescue Service::ServiceException => e
    [400, { :error => e.message }.to_json]
  end
end

post '/att/mim/getmessagecontent' do
end

post '/att/mim/getdelta' do
end

post '/att/mim/updatemessages' do
end

post '/att/mim/updatemessage' do
end

delete '/att/myMessages/v2/messages/:id' do |id|
  token_map = session[:tokenMap]
  unless token_map and token = token_map["IMMN"]
    return [401, { :error => "user has not authorized this app to delete messages" }.to_json]
  end
  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  begin
    svc.deleteMessage [URI.decode(id)]
  rescue Service::ServiceException => e
    [400, { :error => e.message }.to_json]
  end
end

delete '/att/myMessages/v2/messages' do
  unless ids = request.GET['messageIds']
    return [400, { :error => "required 'messageIds querystring parameter is missing" }.to_json]
  end
  token_map = session[:tokenMap]
  unless token_map and token = token_map["IMMN"]
    return [401, { :error => "user has not authorized this app to delete messages" }.to_json]
  end
  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  begin
    svc.deleteMessage [URI.decode(ids)]
  rescue Service::ServiceException => e
    [400, { :error => e.message }.to_json]
  end
end

get '/att/myMessages/v2/messages/index/info' do
  content_type :json
  token_map = session[:tokenMap]
  unless token_map and token = token_map["MIM"]
    return [401, { :error => "user has not authorized this app to see their message cache index details" }.to_json]
  end
  svc = Service::MIMService.new($config['apiHost'], token, :raw_response => true)
  begin
    svc.getIndexInfo
  rescue Service::ServiceException => e
    [400, { :error => e.message }.to_json]
  end
end

post '/att/myMessages/v2/messages/index' do
  token_map = session[:tokenMap]
  unless token_map and token = token_map["MIM"]
    return [401, { :error => "user has not authorized this app to create a message cache index" }.to_json]
  end
  svc = Service::MIMService.new($config['apiHost'], token)
  begin
    svc.createIndex
  rescue Service::ServiceException => e
    [400, e.message]
  end
end

post '/att/mim/getnoticationdetails' do
end

post '/att/mim/updatereadflag' do
end

post '/att/mim/markread' do
end

post '/att/mim/markunread' do
end

# Endpoint to display MIM get message content
get '/att/content' do
  token = session[:tokenMap]["MIM"]
  messageId = params[:messageId]
  messagePart = params[:partNumber]  
  begin
    r = @@att.getMessageContents(token, messageId, messagePart)
    
    if r.respond_to?(:content_type)
      content_type_r = r.content_type
    else
      content_type_r = r.header['content-type']
    end   
        
    if r.respond_to?(:response_code)
      status r.response_code
    end
    
    content_type content_type_r
    
    body r.body  
  rescue Exception => e
    if e.is_a?(Exception) && !e.respond_to?(:response_code)
      puts e.to_s()
    else
      status e.response_code
      if e.respond_to?(:page)
        body e.page.body  
      else
        body e.inspect
      end
    end  
  end  
end
