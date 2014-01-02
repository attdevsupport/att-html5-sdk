##
# This is an example Sinatra application demonstrating both server and client components
# of the Sencha library for interacting with AT&T's HTML APIs.
#
# Each API has a corresponding button a user can press in order to exercise that API.
#
# In order to run this example code, you will need an application set up on the AT&T
# Dev Connect. You can sign up for an account at https://devconnect-api.att.com/
#
# Once you have logged in, set-up an application and make sure all of the APIs are provisioned.
# Be sure to set your OAuth callback URL to http://127.0.0.1:4567/att/callback
#
# Update the variables below with your Application ID and Secret Key, then start the server by executing:
#
#     ruby app.rb
#

require 'rubygems'
require 'sinatra'

require File.dirname(__FILE__) + '/../lib/base'

# This stores sinatra sessions in memory rather than client side cookies for efficiency.
use Rack::Session::Pool

# This enables application's 'debug' mode. Set to 'false` to disable debugging.
Sencha::DEBUG = :all

# This defines some needed constants.
REDIRECT_HTML_PRE = "<!DOCTYPE html><html><head><script>window.parent.postMessage('";
REDIRECT_HTML_POST = "', '*');</script></head><body></body></html>";

SENCHA_APP_ROOT = File.dirname(__FILE__) + '/../../../client'
CONFIG_DIR = File.dirname(__FILE__) + '/../conf'
PROVIDER = "ServiceProvider"

#defines the media folder location used to find files for MMS, MOBO and SPEECH
MEDIA_DIR = File.dirname(__FILE__) + '/../media'

# This points the public folder to the Sencha Touch application.
set :public_folder, SENCHA_APP_ROOT

# This ensures that sinatra doesn't set the X-Frame-Options header.
set :protection, :except => :frame_options

# This ensure the config data.
$config = YAML.load_file(File.join(CONFIG_DIR, 'att-api.properties'))

# This configures which port to listen on.
configure do
  set :port, ARGV[0] || 4567
end


host = $config['apiHost'].to_s
  
if(/\/$/ =~ host)
  host.slice!(/\/$/)
end

# This sets up the ATT library with the client applicationID and secretID. These will have been
# given to you when you registered your application on the AT&T developer site.
@@att = Sencha::ServiceProvider::Base.init(
  :provider => :att,

  :client_id => $config['apiKey'].to_s,
  :client_secret => $config['secretKey'].to_s,

  # This is the main endpoint through which all API requests are made.
  :host => host,
  # This is the address of the locally running server. This is used when a callback URL is
  # required when making a request to the AT&T APIs.
  :local_server => $config['localServer'].to_s,

  :client_model_methods => %w(sendSms smsStatus receiveSms sendMms mmsStatus wapPush requestChargeAuth subscriptionDetails refundTransaction transactionStatus subscriptionStatus getNotification acknowledgeNotification speechToText),
  :client_model_scope => $config['clientModelScope'].to_s

)

# The clientCredentialsManager needs to run in a thread so the sinatra app can run concurrently.
Thread.new do
  sleep 1 # Wait for a second to allow sinatra to start.

  #while true
    puts "Starting fetch of client credentials info"
    @@att.run_get_client_model_info_in_thread
    sleep $config['clientModelRefreshSeconds']
    puts ""
  #end

# exit
end



# The root URL starts off the Sencha Touch application. On the desktop, any Webkit browser
# will work, such as Google Chrome or Apple Safari. It's best to use desktop browsers
# when developing and debugging your application due to the superior developer tools such
# as the Web Inspector.
get '/' do
  File.read(File.join(SENCHA_APP_ROOT, 'index.html'))
end

# Return a json object with either 'true' or 'false' depending on whether an
# access_token has been set. This indicates whether the user is logged in.
get '/att/check' do
  content_type :json
  { :authorized => session['token'] ? true : false }.to_json
end

get '/att/payment' do
  @@att.processPaymentCallback(params)
end

post '/att/notifications' do
  @@att.processPaymentNotification(request, params)
end

# This obtains a new access token from the refresh token.
post '/att/refresh' do

  response = @@att.refreshToken(session['refresh_token'])

  content_type :json

  if response.error?
    { :error => response.error }.to_json
  else

    session['token'] = response.data['access_token']
    session['refresh_token'] = response.data['refresh_token']

    response.data.to_json
  end
end


# Endpoint to display MIM get message content
get '/att/content' do
  token = session[:token]
  messageId = params[:messageId]
  messagePart = params[:partNumber]  
  begin
    r = @@att.getMessageContents(token, messageId, messagePart)
    if r.respond_to?(:response_code)
      status r.response_code
    end
    headers \
      "Content-Type" => r.content_type
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


# Once the user has logged in with their credentials, they get redirected to this URL
# with a 'code' parameter. This is exchanged for an access token which can be used in any
# future calls to the AT&T APIs.
get '/att/callback' do

  puts "handle callback"

  if !params[:code]
    puts 'callback : No auth code on querystring'

    content_type 'text/html'
    response = {
      :success => false,
      :msg => "No auth code"
    }
    
    if params[:error]
        response.merge!({
          :msg => params[:error_description],
          :code => params[:error]
        })
    end

    # This sends back our json wrapped in html.
    return REDIRECT_HTML_PRE + response.to_json + REDIRECT_HTML_POST

    # This ensures that we don't process the rest of the codeblock.
    
  end

  puts "getToken"
  response = @@att.getToken(params[:code])

  if response.error?
    puts "callback : error in response"

    content_type 'text/html'
    response = {
      :success => false,
      :msg => "Process Callback",
      :error => response.error
    }

    # This sends back our json wrapped in html.
    REDIRECT_HTML_PRE + response.to_json + REDIRECT_HTML_POST

  else
    puts "callback : response good"
    # This stores the OAuth token in the session for use in future API calls.
    session['token'] = response.data['access_token']
    session['refresh_token'] = response.data['refresh_token']
    puts "token = #{session[:token]}"
    puts "refresh_token = #{session[:refresh_token]}"

    content_type 'text/html'
    response = {
      :success => true,
      :msg => "Process Callback"
    }

    # This sends back our json wrapped in html.
    REDIRECT_HTML_PRE + response.to_json + REDIRECT_HTML_POST

  end

end


# This method passes whitelisted methods through to the Provider instance.
post '/att/direct_router' do
  puts "Processing /att/direct_router call"

  content_type :json
  request.body.rewind
  data = JSON.parse request.body.read
  puts "direct_router call for method #{data['method']}"

  response = {
    :type => "rpc",
    :tid => data['tid'],
    :action => data['action'],
    :method => data['method']
  }

  method_whitelist = %w(oauthUrl signPayload)

  if data['action'] == PROVIDER and method_whitelist.include?(data['method'])
    puts "WHITELISTED Request, NO Token needed for #{data['method']}"
    response = response.merge(@@att.send("direct_#{data['method']}", data['data']))
  elsif data['action'] == PROVIDER

    # Fist, see if this method has a client credentials model OAuth token.
    token = @@att.get_client_model_token(data['method'])

    # If not, then use the session token which would be an authorize model OAuth token.
    if !token
      puts "getting authorize model token from session[:token]"
      token = session[:token]
    end

    if !token
      puts "ERROR! no token found!"
      response[:error] = 'Unauthorized request'
    else
      puts "TOKEN is good, calling Provider method #{data['method']}"
      puts "token = " + token
      args = (data['data'] || []).unshift(token)
      response = response.merge(@@att.send("direct_#{data['method']}", *args))
    end
  else
    response[:error] = "Invalid direct_router action"
  end

  if response[:error]
    puts "Received ERROR response from calling Provider method #{data['method']}"
    response = response.merge({
      :type => 'exception',
      :error => response[:error]
    })
  end

  response.to_json
end


## sms listener for voting app

VOTES_TMP_FILE = File.dirname(__FILE__) + '/../votes.json'

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

get '/att/sms/votegetter' do
  content_type :json

  begin
    file_contents = File.open(VOTES_TMP_FILE, 'r') { |f| f.read }
  rescue Exception => e
    #if file doesn't exist, create content
    file_contents = '{"success":true,"total":0,"data":[{"sport":"Football","votes":0},{"sport":"Baseball","votes":0},{"sport":"Basketball","votes":0}]}'
  end 
  response = JSON.parse file_contents
  
  return response.to_json
end


GALLERY_TMP_FOLDER = MEDIA_DIR + '/gallery/' 
GALLERY_TMP_FILE = GALLERY_TMP_FOLDER + 'gallery.json'


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

get '/att/mms/gallerygetter' do
  content_type :json
  begin
    file_contents = File.open(GALLERY_TMP_FILE, 'r') { |f| f.read }
  rescue Exception => e
    #if file doesn't exist, create content
    file_contents = '{"success":false, "errorMessage": "Photo gallery is empty." }'
  end 
  response = JSON.parse file_contents
  
  return response.to_json
end

get '/att/mms/gallery/:fileName' do |fileName|
  begin
    response = File.open("#{GALLERY_TMP_FOLDER}/#{fileName}", 'r') { |f| f.read }
  rescue Exception => e
    error 404   
  end
end  
