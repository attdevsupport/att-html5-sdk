##
# This is an example Sinatra application demonstrating both server and client
# components of the AT&T HTML5 SDK library for interacting with AT&T's APIs.
#
# In order to run this example code, you will need an application set up. 
# You can sign up for an account at https://developer.att.com/
#
# Once you have logged in, set-up an application and make sure all of the APIs
# are provisioned. If you are exercising APIs that require a user consent flow
# for authorization, you will also need to run the listener.rb server and set 
# your OAuth callback URL to http://localhost:4568/att/callback
#
# Update the server/ruby/conf/att-api.properties file with your Application ID
# and Secret Key, then start the server by executing:
#
#     ruby app.rb
#

require 'rubygems'
require 'yaml'
require 'sinatra'
require File.join(File.dirname(__FILE__), '../lib/codekit')

include Att::Codekit

# This points the static files (ie, the sample apps) hosted by this server
WEB_APP_ROOT = File.expand_path(File.dirname(__FILE__) + '/../../../webcontent')

#defines the location used to hold static and temporary content files
MEDIA_DIR = File.expand_path(File.dirname(__FILE__) + '/../media')

CONFIG_DIR = File.expand_path(File.dirname(__FILE__) + '/../conf')

# Sinatra configuration
enable :sessions
disable :raise_errors, :show_exceptions
set :bind, '0.0.0.0'
set :session_secret, 'random line noize634$#&g45gs%hrt#$%RTbw%Ryh46w5yh' # must be the same in app.rb and listener.rb
set :public_folder, WEB_APP_ROOT


# This ensures that sinatra doesn't set the X-Frame-Options header.
# With the sencha decouple, I don't think we have iframes any more;
# try commenting it out. TODO: remove it if it works.
# set :protection, :except => :frame_options

$config = YAML.load_file(File.join(CONFIG_DIR, 'att-api.properties'))

# This configures which port to listen on.
configure do
  set :port, ARGV[0] || 4567
end


host = $config['apiHost'].to_s
client_id = $config['apiKey'].to_s
client_secret = $config['secretKey'].to_s
client_model_scope = $config['clientModelScope'].to_s
  
if(/\/$/ =~ host)
  host.slice!(/\/$/)
end

#disable SSL verification if enableSSLCheck is set to false
enableSSLCheck = $config['enableSSLCheck']
if(!enableSSLCheck)
  I_KNOW_THAT_OPENSSL_VERIFY_PEER_EQUALS_VERIFY_NONE_IS_WRONG = nil
  OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
end
    
client_credential = Auth::ClientCred.new(host, client_id, client_secret)
$client_token = client_credential.createToken(client_model_scope)


def return_json_file(file, error_response)
  begin
    file_contents = File.read file
  rescue Exception => e
    file_contents = error_response
  end
  JSON.parse(file_contents).to_json # clean up the json
end

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

def mime_type_to_extension(mime_type)
  return '.wav' if mime_type == 'audio/wav' # some systems only have audio/x-wav in their MIME_TYPES
  return $extension_map[mime_type]
end

def save_attachment_as_file(file_data)
  rack_file = file_data[:tempfile]
  rack_filename = rack_file.path
  file_extension = mime_type_to_extension file_data[:type]
  filename = File.join(MEDIA_DIR, File.basename(rack_filename) + file_extension)
  FileUtils.copy(rack_filename, filename)
  filename
end

def json_error(status, message)
  [status, {'Content-Type' => 'application/json'}, { :error => message }.to_json]
end

# The root URL starts off the web application. On the desktop, any Webkit browser
# will work, such as Google Chrome or Apple Safari. It's best to use desktop browsers
# when developing and debugging your application due to the superior developer tools such
# as the Web Inspector.
get '/' do
  File.read(File.join(WEB_APP_ROOT, 'index.html'))
end

# Since this server primarily serves up web service endpoints, change the default
# error handler to return a JSON message instead of the default HTML.
error do
  json_error(400, env['sinatra.error'].message)
end

require File.join(File.dirname(__FILE__), 'check.rb')
require File.join(File.dirname(__FILE__), 'services/ads.rb')
require File.join(File.dirname(__FILE__), 'services/device.rb')
require File.join(File.dirname(__FILE__), 'services/iam.rb')
require File.join(File.dirname(__FILE__), 'services/mms.rb')
require File.join(File.dirname(__FILE__), 'services/oauth.rb')
require File.join(File.dirname(__FILE__), 'services/payment.rb')
require File.join(File.dirname(__FILE__), 'services/sms.rb')
require File.join(File.dirname(__FILE__), 'services/speech.rb')
