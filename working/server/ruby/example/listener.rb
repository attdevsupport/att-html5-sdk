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
require 'sinatra/base'
require 'rack/mime'
require 'json'

class Html5SdkListener < Sinatra::Base

  set :bind, '0.0.0.0'
  set :port, 4568

  MEDIA_DIR = File.dirname(__FILE__) + '/../media'
  VOTES_TMP_FILE = File.dirname(__FILE__) + '/../votes.json'
  GALLERY_TMP_FOLDER = MEDIA_DIR + '/gallery/' 
  GALLERY_TMP_FILE = GALLERY_TMP_FOLDER + 'gallery.json'

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
