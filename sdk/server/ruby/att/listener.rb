require 'rubygems'
require 'sinatra/base'
require 'rack/mime'
require 'json'
require 'base64'
require 'yaml'
require_relative '../lib/codekit'

##
# This is an example Sinatra application that handles any incoming
# SSL/HTTPS connections that the main server app (app.rb) can't handle.
#
class Html5SdkListener < Sinatra::Base

  include Att::Codekit

  # Sinatra configuration
  enable :sessions
  disable :raise_errors, :show_exceptions
  set :bind, '0.0.0.0'
  set :port, 4568
  set :session_secret, 'random line noize634$#&g45gs%hrt#$%RTbw%Ryh46w5yh' # must be the same in app.rb and listener.rb
  
  # @private
  CONFIG_DIR = File.expand_path(File.dirname(__FILE__) + '/../conf')

  # @private
  MEDIA_DIR = File.dirname(__FILE__) + '/../media'

  # @private
  VOTES_TMP_FILE = File.dirname(__FILE__) + '/../votes.json'

  # @private
  GALLERY_TMP_FOLDER = MEDIA_DIR + '/gallery/' 

  # @private
  GALLERY_TMP_FILE = GALLERY_TMP_FOLDER + 'gallery.json'

  $config = YAML.load_file(File.join(CONFIG_DIR, 'att-api.properties'))

  
  # @method post_att_sms_votelistener
  # @overload post '/att/sms/votelistener'
  #   @param sms [message body] a JSON object describing the SMS message being forwarded.
  #   @return [HTTP status code]
  # An application registered at http://developer.att.com can receive SMS
  # messages that are sent to its shortcode. If the app is configured to
  # forward these messages to this endpoint, the endpoint will process them.
  # Specifically, it will check if the text of the message is 'Football',
  # 'Baseball', or 'Basketball', and keep track of how many of each type
  # of message that it has received.
  #
  # For more details on the JSON message format, please refer to http://developer.att.com/apis/sms/docs
  post '/att/sms/votelistener' do
    request.body.rewind
    data = JSON.parse request.body.read
    if data
      message = data["Message"]
    end

    begin
      file_contents = File.open(VOTES_TMP_FILE, 'r+') { |f| f.read }
    rescue Exception => e
      #if file doesn't exist, create content
      file_contents = '{"success":true,"total":0,"data":[{"sport":"Football","votes":0},{"sport":"Baseball","votes":0},{"sport":"Basketball","votes":0}]}'
    end    
      
    votes = JSON.parse file_contents

    votes["data"].each {|cat| 
        if cat["sport"].casecmp(message) == 0  
            cat["votes"] += 1
            votes["total"] += 1
          end
    } 
    File.open(VOTES_TMP_FILE, 'w') { |f| f.write votes.to_json }
  end

  # @method post_att_mms_gallerylistener
  # @overload post '/att/mms/gallerylistener'
  #   @param mms [message body] multipart form data describing the MMS message being forwarded.
  #   @return [HTTP status code]
  # An application registered at http://developer.att.com can receive MMS
  # messages that are sent to its shortcode. If the app is configured to
  # forward these messages to this endpoint, the endpoint will process them.
  # Specifically, it will save any attached image into a 'gallery' directory.
  #
  # For more details on the MMS message format, please refer to http://developer.att.com/apis/mms/docs
  post '/att/mms/gallerylistener' do
    request.body.rewind
    input   = request.body.read
    address = /\<SenderAddress\>tel:([0-9\+]+)<\/SenderAddress>/.match(input)[1]
    parts   = input.split "--Nokia-mm-messageHandler-BoUnDaRy"
    body    = parts[2].split "BASE64"
    type    = /Content\-Type: image\/([^;]+)/.match(body[0])[1];
    date    = Time.now

    begin
      file_contents = File.open(GALLERY_TMP_FILE, 'r+') { |f| f.read }
    rescue Exception => e
      # if the directory doesn't exist, create it
      Dir.mkdir(GALLERY_TMP_FOLDER) unless File.directory? GALLERY_TMP_FOLDER
      #if file doesn't exist, create content
      file_contents = '{"success":true, "galleryCount": 0, "galleryImages" : [] }'
    end 
    
    gallery = JSON.parse file_contents
    
    random  = rand(10000000).to_s

    File.open("#{GALLERY_TMP_FOLDER}#{random}.#{type}", 'w') { |f| f.puts(Base64.decode64(body[1])) }

    text = parts.length > 4 ? Base64.decode64(parts[3].split("BASE64")[1]).strip : ""
    File.open("#{GALLERY_TMP_FOLDER}#{random}.#{type}.txt", 'w') { |f| f.puts address, date, text } 

    galleryImage = {
      "image" => "#{random}.#{type}",
      "date" => date,  
      "address" => address,
      "textMessage" => text  
    }
    gallery["galleryCount"] += 1
    gallery["galleryImages"].push(galleryImage)
    
    File.open(GALLERY_TMP_FILE, 'w') { |f| f.write gallery.to_json }
  end

  # @method get_att_callback
  # @overload get '/att/callback'
  #   @param code [querystring parameter] authorization code representing API acknowledgement of the user's consent. This code can be converted to an access token, valid for making API web service calls.
  #   @param scope [querystring parameter] the specific web service APIs that the user authorized.
  #   @param returnUrl [querystring parameter] the URL this method will redirect back to, once it has finished processing the authorization.
  #   @return [Redirect]
  # Once the user has logged in with their credentials, they get redirected to this
  # URL with a 'code' and a 'scope' parameters. This is exchanged for an access token
  # which can be used in any future calls to the AT&T APIs.
  get '/att/callback' do

    encoded_code = request.GET["code"]
    encoded_scope = request.GET["scope"]
    encoded_return_url = request.GET["returnUrl"]

    if encoded_return_url.nil?
      return [500, "user authentication completed but I don't have a returnUrl to go back to"]
    end
    
    return_url = URI.decode encoded_return_url
    
    if encoded_code.nil?
      error = request.GET["error"]
      if error.nil?
        error = "no code and no error message returned from the user authentication"
      else
        error_description = request.GET["error_description"]
        error = "#{error} - #{error_description}" unless error_description.nil?
      end
      return_url = return_url + (return_url.include?('?') ? '&' : '?') + "error=" + URI.encode(error)
      return redirect to(return_url)
    end
    
    code = URI.decode encoded_code

    auther = Auth::AuthCode.new($config['apiHost'], $config['apiKey'], $config['secretKey'])
    begin
      token = auther.createToken(code)
    rescue Auth::OAuthException => e
      return_url = return_url + (return_url.include?('?') ? '&' : '?') + "error=" + URI.encode(e.message)
      return redirect to(return_url)
    end
      
    # note in the user's session the new services they have now authenticated
    unless encoded_scope.nil?
      tokenMap = session[:tokenMap] || {} 
      scope = URI.decode encoded_scope
      scope.split(",").each do |authorized_service|
        tokenMap[authorized_service] = token
      end
      session['tokenMap'] = tokenMap
    end
    redirect to(return_url)
  end

  run! do |server|
    ssl_options = {
      :cert_chain_file => File.join(File.dirname(__FILE__), '../certs/www.example.com.cert'),
      :private_key_file => File.join(File.dirname(__FILE__), '../certs/www.example.com.key'),
      :verify_peer => false
    }
    server.ssl = true
    server.ssl_options = ssl_options

    Thin::Logging::trace = true
  end
end
