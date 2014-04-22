class Html5SdkApp < Sinatra::Base

  include Att::Codekit

  # @private This points the static files (ie, the sample apps) hosted by this server
  WEB_APP_ROOT = File.expand_path(File.dirname(__FILE__) + '/../../../webcontent')

  # @private defines the location used to hold static and temporary content files
  MEDIA_DIR = File.expand_path(File.dirname(__FILE__) + '/../media')

  # @private
  CONFIG_DIR = File.expand_path(File.dirname(__FILE__) + '/../conf')

  # Sinatra configuration
  enable :sessions
  disable :raise_errors, :show_exceptions
  set :bind, '0.0.0.0'
  set :port, ARGV[0] || 4567
  set :session_secret, 'random line noize634$#&g45gs%hrt#$%RTbw%Ryh46w5yh' # must be the same in app.rb and listener.rb
  set :public_folder, WEB_APP_ROOT

  $config = YAML.load_file(File.join(CONFIG_DIR, 'att-api.properties'))

  host = $config['apiHost'].to_s
  client_id = $config['appKey'].to_s
  client_secret = $config['Secret'].to_s
  client_model_scope = $config['clientModelScope'].to_s
    
  if(/\/$/ =~ host)
    host.slice!(/\/$/)
  end

  #disable SSL verification if enableSSLCheck is set to false
  enableSSLCheck = $config['enableSSLCheck']
  if(!enableSSLCheck)
    # @private
    I_KNOW_THAT_OPENSSL_VERIFY_PEER_EQUALS_VERIFY_NONE_IS_WRONG = nil
    OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
  end
    
  client_credential = Auth::ClientCred.new(host, client_id, client_secret)
  $client_token = client_credential.createToken(client_model_scope)


  # @private
  def return_json_file(file, error_response)
    begin
    file_contents = File.read file
    rescue Exception => e
    file_contents = error_response
    end
    JSON.parse(file_contents).to_json # clean up the json
  end

  # @private
  def querystring_to_options(request, allowed_options, opts = {})
    allowed_options.each do |sym| 
    str = sym.to_s
    if request[str]
      opts[sym] = URI.decode request[str]
    end
    end
    return opts
  end

  # convert a map of file-extensions to mime-types into
  # a map of mime-types to file-extensions
  $extension_map = Rack::Mime::MIME_TYPES.invert

  # @private
  def mime_type_to_extension(mime_type)
    return '.wav' if mime_type == 'audio/wav' # some systems only have audio/x-wav in their MIME_TYPES
    return '.xml' if mime_type == 'application/xml'
    return $extension_map[mime_type]
  end

  # @private
  def save_attachment_as_file(file_data)
    rack_file = file_data[:tempfile]
    rack_filename = rack_file.path
    file_extension = mime_type_to_extension file_data[:type]
    filename = File.join(MEDIA_DIR, File.basename(rack_filename) + file_extension)
    FileUtils.copy(rack_filename, filename)
    filename
  end

  # @private
  def json_error(status, message)
    [status, {'Content-Type' => 'application/json'}, { :error => message }.to_json]
  end
end
