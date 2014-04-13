class Html5SdkApp < Sinatra::Base

  # @!group MMS

  # @method post_att_mms_v3_messaging_outbox
  # @overload post '/att/mms/v3/messaging/outbox'
  #   @param addresses [querystring parameter] The MMS recipients.
  #   @param message [querystring parameter] The MMS text.
  #   @param fileId [querystring parameter] (optional) The name of a file on the SDK server that should be attached to the MMS.
  #   @param file [attachment] (optional) any file attachments on the request will be attached to the MMS.
  #   @return [JSON]
  #
  #   Send an MMS message.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/mms/docs for more details of the parameters and their allowed values.
  #
  post '/att/mms/v3/messaging/outbox' do
    content_type :json # set response type
    addresses = request.GET['addresses']
    message = request.GET['message']
    if addresses.nil? || message.nil?
      return json_error(400, "valid 'addresses' and 'message' querystring parameters required")
    end
    addresses = URI.decode addresses
    message = URI.decode message
    
    server_file = request.GET['fileId']
    server_file = File.join(Html5SdkApp::MEDIA_DIR, URI.decode(server_file)) unless server_file.nil?
    filenames = []
    filenames.push(server_file) unless server_file.nil?
    
    begin
      request.POST.each do |key, file_data|
        return json_error(400, "attachment was a String where file data was expected") if file_data.is_a? String
        filenames.push save_attachment_as_file(file_data)
      end
      
      should_notify = true
      notify = request.GET['notify']
      if notify.nil? || notify.casecmp("false") || notify.eql?("0")
        should_notify = false
      end
      svc = Service::MMSService.new($config['apiHost'], $client_token, :raw_response => true)
      svc.sendMms(addresses, message, filenames, should_notify)
    ensure
      filenames.each { |filename| FileUtils.remove(filename) unless filename.eql?(server_file) }
    end
  end

  # @method get_att_mms_v3_messaging_outbox_id
  # @overload get '/att/mms/v3/messaging/outbox/{mms_id}'
  #   @param mms_id [URL path segment] The ID of the desired MMS message.
  #   @return [JSON]
  #
  #   Get the delivery status of a previously-sent MMS.
  #
  #   Refer to the API documentation at http://developer.att.com/apis/mms/docs for more details of the parameters and their allowed values.
  #
  get '/att/mms/v3/messaging/outbox/:mms_id' do |mms_id|
    content_type :json # set response type
    svc = Service::MMSService.new($config['apiHost'], $client_token, :raw_response => true)
    svc.mmsStatus(mms_id)
  end

  # @private
  GALLERY_TMP_FOLDER = File.join(Html5SdkApp::MEDIA_DIR, '/gallery/')

  # @private
  GALLERY_TMP_FILE = File.join(GALLERY_TMP_FOLDER, 'gallery.json')

  # @method get_att_mms_gallerygetter
  # @overload get '/att/mms/gallerygetter'
  #   @return [JSON]
  #
  #   Get a list of picture attachments the MMS notification endpoint has received.
  #
  get '/att/mms/gallerygetter' do
    content_type :json # set response type
    return_json_file(GALLERY_TMP_FILE, '{"success":false, "errorMessage": "Photo gallery is empty." }')
  end

  # @method get_att_mms_gallery_filename
  # @overload get '/att/mms/{filename}'
  #   @param filename [URL path segment] The name of the image file on the SDK server that is being requested.
  #   @return [binary image data]
  #
  #   Get an picture file.
  #
  get '/att/mms/gallery/:filename' do |filename|
    begin
      content_type Rack::Mime::MIME_TYPES[File.extname(filename)]
      File.read(File.join(GALLERY_TMP_FOLDER, filename), :mode => "rb")
    rescue => e
      puts e.inspect
      error 404
    end
  end  
end
