##
# This is an example Sinatra application demonstrating both server and client components
# of the Sencha library for interacting with AT&T's HTML APIs.
#
# Each API has a corresponding button a user can press in order to exercise that API.
#
# In order to run this example code, you will need an application set up. 
# You can sign up for an account at https://developer.att.com/
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

require File.join(File.dirname(__FILE__), '../lib.old/base')
require File.join(File.dirname(__FILE__), '../lib/codekit')
require File.join(File.dirname(__FILE__), 'callback.rb')
require File.join(File.dirname(__FILE__), 'check.rb')
require File.join(File.dirname(__FILE__), 'direct_router.rb')

include Att::Codekit


# This stores sinatra sessions in memory rather than client side cookies for efficiency.
use Rack::Session::Pool

# This enables application's 'debug' mode. Set to 'false` to disable debugging.
Sencha::DEBUG = :all

# This defines some needed constants.
REDIRECT_HTML_PRE = "<!DOCTYPE html><html><head><script>window.parent.postMessage('";
REDIRECT_HTML_POST = "', '*');</script></head><body></body></html>";

SENCHA_APP_ROOT = File.dirname(__FILE__) + '/../../../webcontent'
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
client_id = $config['apiKey'].to_s
client_secret = $config['secretKey'].to_s
client_model_scope = $config['clientModelScope'].to_s
  
if(/\/$/ =~ host)
  host.slice!(/\/$/)
end

#disable SSL verification is enableSSLCheck is set to false
enableSSLCheck = $config['enableSSLCheck']
if(!enableSSLCheck)
  I_KNOW_THAT_OPENSSL_VERIFY_PEER_EQUALS_VERIFY_NONE_IS_WRONG = nil
  OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
end
    

# can be removed when completely migrated to codekit
#
# This sets up the ATT library with the client applicationID and secretID. These will have been
# given to you when you registered your application on the AT&T developer site.
@@att = Sencha::ServiceProvider::Base.init(
  :provider => :att,

  :client_id => client_id,
  :client_secret => client_secret,

  # This is the main endpoint through which all API requests are made.
  :host => host,
  
  # This is the address of the locally running server. This is used when a callback URL is
  # required when making a request to the AT&T APIs.
  :local_server => $config['localServer'].to_s,

  :client_model_methods => %w(getAd sendSms smsStatus receiveSms sendMms mmsStatus wapPush requestChargeAuth subscriptionDetails refundTransaction transactionStatus subscriptionStatus getNotification acknowledgeNotification speechToText cmsCreateSession cmsSendSignal),
  :client_model_scope => client_model_scope,
  :auth_model_scope_methods => {
    "deviceInfo" => "DC",
    "deviceLocation" => "TL",
    "sendMobo" => "IMMN",
    "getMessageHeaders" => "MIM"  
  }
)

client_credential = Auth::ClientCred.new(host, client_id, client_secret)
$client_token = client_credential.createToken(client_model_scope)


# The root URL starts off the Sencha Touch application. On the desktop, any Webkit browser
# will work, such as Google Chrome or Apple Safari. It's best to use desktop browsers
# when developing and debugging your application due to the superior developer tools such
# as the Web Inspector.
get '/' do
  File.read(File.join(SENCHA_APP_ROOT, 'index.html'))
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

post '/att/ads/getads' do
end

post '/att/dc/getdevicecapabilities' do
end

post '/att/immn/sendmessage' do
end

post '/att/immn/immnsendsms' do
end

post '/att/immn/immnsendmms' do
end

post '/att/mim/getmessagelist' do
end

post '/att/mim/getmessage' do
end

post '/att/mim/getmessagecontent' do
end

post '/att/mim/getdelta' do
end

post '/att/mim/updatemessages' do
end

post '/att/mim/updatemessage' do
end

post '/att/mim/deletemessage' do
end

post '/att/mim/getindexinfo' do
end

post '/att/mim/createindex' do
end

post '/att/mim/getnoticationdetails' do
end

post '/att/mim/updatereadflag' do
end

post '/att/mim/markread' do
end

post '/att/mim/markunread' do
end

post '/att/mms/sendmms' do
end

post '/att/mms/mmsstatus' do
end

post '/att/payment/newtransaction' do
end

post '/att/payment/newsubscription' do
end

post '/att/payment/gettransaction' do
end

post '/att/payment/getsubscription' do
end

post '/att/payment/getsubscriptiondetails' do
end

post '/att/payment/refundtransaction' do
end

post '/att/payment/cancelsubscription' do
end

post '/att/payment/signpayload' do
end

post '/att/payment/getnotification' do
end

post '/att/payment/acknotification' do
end

post '/att/sms/sendsms' do
end

post '/att/sms/smsstatus' do
end

post '/att/sms/getreceivedmessages' do
end

def codekit_speech_response_to_json(response)
    response_hash = response.to_h
    response_hash[:nbest].map! { |nb| nb.to_h }
    return response_hash.to_json
end

post '/att/speech/simplespeechtotext' do
  content_type :json # set response type
  
  if form_data?
    file = request['speechaudio'][:tempfile].path
  else
    filename = URI.decode request['filename']
    file = File.join(MEDIA_DIR, filename)
  end

  puts "file = #{file}"

  speech = Service::SpeechService.new(host, $client_token)
  begin
    response = speech.toText(file)
    return codekit_speech_response_to_json response
  rescue Service::ServiceException => e
    return {:error => e.message}.to_json
  end
end

post '/att/speech/speechtotext' do
end

post '/att/speech/customspeechtotext' do
end

post '/att/speech/texttospeech' do
end

post '/att/tl/getdevicelocation' do
end

