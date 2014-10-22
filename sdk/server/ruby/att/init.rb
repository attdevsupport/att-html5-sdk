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

  $host = $config['apiHost'].to_s
  $client_id = $config['appKey'].to_s
  $client_secret = $config['Secret'].to_s
  $client_model_scope = $config['clientModelScope'].to_s
  $reduce_token_expiry_by = $config['ReduceTokenExpiryInSeconds_Debug'].to_i
    
  if(/\/$/ =~ $host)
    $host.slice!(/\/$/)
  end

  #disable SSL verification if enableSSLCheck is set to false
  enableSSLCheck = $config['enableSSLCheck']
  if(!enableSSLCheck)
    # @private
    I_KNOW_THAT_OPENSSL_VERIFY_PEER_EQUALS_VERIFY_NONE_IS_WRONG = nil
    OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
  end
  
  $client_token = nil
  
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

  # @private
  def initialize_current_client_token()
    if $client_token == nil
      get_client_credentials()
    elsif ($client_token.expiry - Time.now.to_i - $reduce_token_expiry_by) <= 0
      begin
        oauth_service = Auth::OAuthService.new($host, $client_id, $client_secret)
        $client_token = oauth_service.refreshToken($client_token)
        puts "Refreshed the client token..."
      rescue Exception => e
        puts "Exception occurred... #{e}"
        get_client_credentials()
      end
    end
    return $client_token
  end

  # @private
  def get_client_credentials()
    $client_token = nil
    begin
      client_credential = Auth::ClientCred.new($host, $client_id, $client_secret)
      $client_token = client_credential.createToken($client_model_scope)
      puts "Got new client token..."
    rescue Exception => e
      puts "Exception occurred while refreshing client token... #{e}"
      $client_token = nil
    end
    return $client_token
  end

  # @private
  def remove_token_from_token_map(oauth_token, token_map)
    token_map.each do |key, value|
      if value == oauth_token
        token_map.delete(key)
      end
    end
  end
  
  # @private
  def get_current_consent_token(scope)
    consent_token = nil
    
    token_map = session[:tokenMap]
    
    return nil unless token_map and consent_token = token_map[scope]
    
    expired = (consent_token.expiry - Time.now.to_i - $reduce_token_expiry_by) <= 0
    revoked = consent_token.access_token == 'revoked'
    expired_or_revoked = expired || revoked
    refreshable = consent_token.refresh_token != 'revoked'
    
    if consent_token and expired_or_revoked
      unless refreshable
        remove_token_from_token_map(consent_token, token_map)
        return nil
      end
      old_consent_token = consent_token
      begin
        oauth_service = Auth::OAuthService.new($host, $client_id, $client_secret)
        consent_token = oauth_service.refreshToken(old_consent_token)
        token_map.each do |key, value|
          if value == old_consent_token
            token_map[key] = consent_token
          end
        end
        puts "Refreshed the consent token..."
      rescue Exception => e
        puts "Exception occurred while refreshing consent token... #{e}"
        consent_token = nil
        remove_token_from_token_map(old_consent_token, token_map)
      end
    end

    return consent_token
  end
  
  before '/att/*' do
    initialize_current_client_token()
  end
end
