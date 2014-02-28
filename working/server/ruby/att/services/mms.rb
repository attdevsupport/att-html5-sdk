post '/att/mms/v3/messaging/outbox' do
  content_type :json # set response type
  addresses = request.GET['addresses']
  message = request.GET['message']
  if addresses.nil? || message.nil?
    return [400, [{:error => "valid 'addresses' and 'message' querystring parameters required"}.to_json]]
  end
  addresses = URI.decode addresses
  message = URI.decode message
  
  server_file = request.GET['fileId']
  server_file = File.join(MEDIA_DIR, URI.decode(server_file)) unless server_file.nil?
  filenames = []
  filenames.push(server_file) unless server_file.nil?
  
  begin
    request.POST.each do |key, file_data|
      return [400, [{:error => "attachment was a String where file data was expected"}.to_json]] if file_data.is_a? String
      filenames.push save_attachment_as_file(file_data)
    end
    
    should_notify = true
    notify = request.GET['notify']
    if notify.nil? || notify.casecmp("false") || notify.eql?("0")
      should_notify = false
    end
    svc = Service::MMSService.new($config['apiHost'], $client_token, :raw_response => true)
    begin
      svc.sendMms(addresses, message, filenames, should_notify)
    rescue Service::ServiceException => e
      return [400, {:error => e.message}.to_json]
    end
  ensure
    filenames.each { |filename| FileUtils.remove(filename) unless filename.eql?(server_file) }
  end
end

get '/att/mms/v3/messaging/outbox/:mms_id' do |mms_id|
  content_type :json # set response type
  svc = Service::MMSService.new($config['apiHost'], $client_token, :raw_response => true)
  begin
    svc.mmsStatus(mms_id)
  rescue Service::ServiceException => e
    return [400, {:error => e.message}.to_json]
  end
end

GALLERY_TMP_FOLDER = File.join(MEDIA_DIR, '/gallery/')
GALLERY_TMP_FILE = File.join(GALLERY_TMP_FOLDER, 'gallery.json')

get '/att/mms/gallerygetter' do
  content_type :json
  return_json_file(GALLERY_TMP_FILE, '{"success":false, "errorMessage": "Photo gallery is empty." }')
end

get '/att/mms/gallery/:filename' do |filename|
  begin
    content_type Rack::Mime::MIME_TYPES[File.extname(filename)]
    File.read(File.join(GALLERY_TMP_FOLDER, filename), :mode => "rb")
  rescue Exception => e
    puts e.inspect
    error 404
  end
end  
