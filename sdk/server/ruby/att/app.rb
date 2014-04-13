require 'rubygems'
require 'yaml'
require 'sinatra/base'
require_relative '../lib/codekit'
require_relative 'init.rb'
require_relative 'check.rb'
require_relative 'services/ads.rb'
require_relative 'services/device.rb'
require_relative 'services/iam.rb'
require_relative 'services/mms.rb'
require_relative 'services/oauth.rb'
require_relative 'services/payment.rb'
require_relative 'services/sms.rb'
require_relative 'services/speech.rb'

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
class Html5SdkApp < Sinatra::Base

  # @method get_root
  # @overload get '/'
  #   @return [HTML]
  #
  # The root URL starts off the web application. On the desktop, any Webkit browser
  # will work, such as Google Chrome or Apple Safari. It's best to use desktop browsers
  # when developing and debugging your application due to the superior developer tools such
  # as the Web Inspector.
  get '/' do
    File.read(File.join(WEB_APP_ROOT, 'index.html'))
  end

  # @method error
  # @return [JSON]
  
  # Since this server primarily serves up web service endpoints, change the default
  # error handler to return a JSON message instead of the default HTML.
  error do
    json_error(400, env['sinatra.error'].message)
  end

  run!
end
