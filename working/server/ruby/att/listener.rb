##
# This is an example Sinatra application that handles any incoming SSL/HTTPS connections
# that the main server app (app.rb) can't handle.
#

require 'rubygems'
require 'sinatra/base'
require 'rack/mime'
require 'json'
require 'base64'
require 'yaml'
require File.join(File.dirname(__FILE__), '../lib/codekit')


class Html5SdkListener < Sinatra::Base

  include Att::Codekit

  # Sinatra configuration
  enable :sessions
  set :bind, '0.0.0.0'
  set :port, 4568
  set :session_secret, 'random line noize634$#&g45gs%hrt#$%RTbw%Ryh46w5yh' # must be the same in app.rb and listener.rb
  
  CONFIG_DIR = File.expand_path(File.dirname(__FILE__) + '/../conf')
  MEDIA_DIR = File.dirname(__FILE__) + '/../media'
  VOTES_TMP_FILE = File.dirname(__FILE__) + '/../votes.json'
  GALLERY_TMP_FOLDER = MEDIA_DIR + '/gallery/' 
  GALLERY_TMP_FILE = GALLERY_TMP_FOLDER + 'gallery.json'

  $config = YAML.load_file(File.join(CONFIG_DIR, 'att-api.properties'))

  
  ## sms listener for voting app
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

  ## mms listener for gallery app
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

  # Once the user has logged in with their credentials, they get redirected to this URL
  # with a 'code' and a 'scope' parameters. This is exchanged for an access token which can be used in any
  # future calls to the AT&T APIs.
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
      :cert_chain_file => File.join(File.dirname(__FILE__), '../certs/58637088_ec2-54-224-240-216.compute-1.amazonaws.com.cert'),
      :private_key_file => File.join(File.dirname(__FILE__), '../certs/58637088_ec2-54-224-240-216.compute-1.amazonaws.com.key'),
      :verify_peer => false
    }
    server.ssl = true
    server.ssl_options = ssl_options

    Thin::Logging::trace = true
  end
end
